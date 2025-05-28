// AudioService - Centralized audio management with AWS Polly and browser fallback
'use client';

class AudioService {
  constructor() {
    this.cache = new Map();
    this.isInitialized = false;
    this.currentAudio = null;
    this.pollyClient = null;
    this.initializePolly();
  }

  async initializePolly() {
    try {
      // Only initialize Polly on the client side with proper environment variables
      if (typeof window !== 'undefined') {
        // Check if AWS credentials are available
        const hasAwsCredentials = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID && 
                                 process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY && 
                                 process.env.NEXT_PUBLIC_AWS_REGION;
        
        if (hasAwsCredentials) {
          const AWS = await import('aws-sdk');
          
          // Configure AWS
          AWS.default.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
            region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1'
          });

          this.pollyClient = new AWS.default.Polly();
          console.log('AWS Polly initialized successfully');
        } else {
          console.log('AWS credentials not available, using browser speech synthesis as fallback');
        }
      }
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize AWS Polly:', error);
      this.isInitialized = true; // Still mark as initialized to allow fallback
    }
  }

  // Get appropriate voice ID for language
  getVoiceId(language) {
    const voiceMap = {
      'french': 'Lea',
      'spanish': 'Conchita',
      'german': 'Marlene',
      'italian': 'Carla',
      'portuguese': 'Ines',
      'english': 'Joanna',
      'chinese': 'Zhiyu',
      'japanese': 'Mizuki',
      'korean': 'Seoyeon',
      'arabic': 'Zeina',
      'hindi': 'Aditi',
      'russian': 'Tatyana'
    };
    return voiceMap[language?.toLowerCase()] || 'Joanna';
  }

  // Play audio using AWS Polly with browser fallback
  async playAudio(text, language = 'english', options = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        // Wait for initialization
        if (!this.isInitialized) {
          await new Promise(resolve => {
            const checkInit = () => {
              if (this.isInitialized) {
                resolve();
              } else {
                setTimeout(checkInit, 100);
              }
            };
            checkInit();
          });
        }

        // Stop any currently playing audio
        this.stop();

        // Try AWS Polly first
        if (this.pollyClient) {
          try {
            const audioData = await this.synthesizeWithPolly(text, language);
            await this.playAudioData(audioData, options);
            resolve();
            return;
          } catch (pollyError) {
            console.warn('AWS Polly failed, falling back to browser speech synthesis:', pollyError);
          }
        }

        // Fallback to browser speech synthesis
        await this.playWithBrowserSpeech(text, language, options);
        resolve();

      } catch (error) {
        if (options.onError) options.onError(error);
        reject(error);
      }
    });
  }

  // Synthesize speech using AWS Polly
  async synthesizeWithPolly(text, language) {
    const cacheKey = `${text}-${language}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const params = {
      Text: text,
      OutputFormat: 'mp3',
      VoiceId: this.getVoiceId(language),
      Engine: 'neural' // Use neural engine for better quality
    };

    try {
      const data = await this.pollyClient.synthesizeSpeech(params).promise();
      const audioData = data.AudioStream;
      
      // Cache the result
      this.cache.set(cacheKey, audioData);
      
      return audioData;
    } catch (error) {
      console.error('Polly synthesis error:', error);
      throw error;
    }
  }

  // Play audio data from Polly
  async playAudioData(audioData, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const arrayBuffer = audioData.buffer.slice(audioData.byteOffset, audioData.byteOffset + audioData.byteLength);
        
        audioContext.decodeAudioData(arrayBuffer, (buffer) => {
          const source = audioContext.createBufferSource();
          source.buffer = buffer;
          source.connect(audioContext.destination);
          
          this.currentAudio = { source, context: audioContext };
          
          source.onended = () => {
            this.currentAudio = null;
            if (options.onEnd) options.onEnd();
            resolve();
          };
          
          if (options.onStart) options.onStart();
          source.start();
        }, (error) => {
          reject(new Error('Failed to decode audio data: ' + error));
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Fallback to browser speech synthesis
  async playWithBrowserSpeech(text, language, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        if (!('speechSynthesis' in window)) {
          throw new Error('Speech synthesis not supported');
        }

        // Cancel any ongoing speech
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set language-specific voice
        const voices = speechSynthesis.getVoices();
        let languageCode = language?.toLowerCase();
        
        // Map language names to language codes
        const languageCodeMap = {
          'french': 'fr',
          'spanish': 'es',
          'german': 'de',
          'italian': 'it',
          'portuguese': 'pt',
          'english': 'en',
          'chinese': 'zh',
          'japanese': 'ja',
          'korean': 'ko',
          'arabic': 'ar',
          'hindi': 'hi',
          'russian': 'ru'
        };
        
        if (languageCodeMap[languageCode]) {
          languageCode = languageCodeMap[languageCode];
        }
        
        const languageVoice = voices.find(voice => 
          voice.lang.toLowerCase().includes(languageCode || 'en')
        );
        
        if (languageVoice) {
          utterance.voice = languageVoice;
        }
        
        utterance.rate = 0.8;
        utterance.pitch = 1;
        
        utterance.onstart = () => {
          if (options.onStart) options.onStart();
        };
        
        utterance.onend = () => {
          if (options.onEnd) options.onEnd();
          resolve();
        };
        
        utterance.onerror = (error) => {
          if (options.onError) options.onError(error);
          reject(error);
        };
        
        speechSynthesis.speak(utterance);
      } catch (error) {
        if (options.onError) options.onError(error);
        reject(error);
      }
    });
  }

  // Stop currently playing audio
  stop() {
    // Stop AWS Polly audio
    if (this.currentAudio) {
      try {
        this.currentAudio.source.stop();
        this.currentAudio.context.close();
      } catch (error) {
        console.warn('Error stopping Polly audio:', error);
      }
      this.currentAudio = null;
    }
    
    // Stop browser speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }

  // Check if service is ready
  isReady() {
    return this.isInitialized;
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }
}

// Create a singleton instance
const audioService = new AudioService();

export default audioService;
export { audioService };
