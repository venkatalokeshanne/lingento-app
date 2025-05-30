"use client";

class AudioService {
  constructor() {
    this.cache = new Map();
    this.isInitialized = false;
    this.currentAudio = null;
    this.pollyClient = null;
    this.isUserInteractionRequired = true;
    this.initializePolly();
    this.setupUserInteractionHandler();
  }

  async initializePolly() {
    try {
      if (typeof window !== "undefined") {
        const hasAwsCredentials =
          process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID &&
          process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY &&
          process.env.NEXT_PUBLIC_AWS_REGION;

        if (hasAwsCredentials) {
          const AWS = await import("aws-sdk");

          AWS.default.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
            region: process.env.NEXT_PUBLIC_AWS_REGION || "us-east-1",
          });

          this.pollyClient = new AWS.default.Polly();
          console.log("AWS Polly initialized");
        } else {
          console.log("AWS credentials not available");
        }
      }
      this.isInitialized = true;
    } catch (error) {
      console.error("Polly init failed:", error);
      this.isInitialized = true;
    }
  }

  setupUserInteractionHandler() {
    if (typeof window === "undefined") return;

    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    if (!isMobile) {
      this.isUserInteractionRequired = false;
    }
    const enableAudio = async () => {
      try {
        console.log("User interaction detected");

        this.isUserInteractionRequired = false;

        document.removeEventListener("click", enableAudio);
        document.removeEventListener("touchstart", enableAudio);
        document.removeEventListener("keydown", enableAudio);
      } catch (error) {
        console.warn("Enable audio failed:", error);
      }
    };

    document.addEventListener("click", enableAudio, { once: true });
    document.addEventListener("touchstart", enableAudio, { once: true });
    document.addEventListener("keydown", enableAudio, { once: true });
  }

  getVoiceId(language) {
    const voiceMap = {
      french: "Lea",
      spanish: "Conchita",
      german: "Marlene",
      italian: "Carla",
      portuguese: "Ines",
      english: "Joanna",
      chinese: "Zhiyu",
      japanese: "Mizuki",
      korean: "Seoyeon",
      arabic: "Zeina",
      hindi: "Aditi",
      russian: "Tatyana",
    };
    return voiceMap[language?.toLowerCase()] || "Joanna";
  }
  async playAudio(text, language = "english", options = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(`Playing audio: "${text}" in ${language}`);

        if (!this.isInitialized) {
          await new Promise((res) => {
            const check = () => {
              if (this.isInitialized) res();
              else setTimeout(check, 100);
            };
            check();
          });
        }

        this.stop();

        if (this.isUserInteractionRequired) {
          const error = new Error("User interaction required");
          error.code = "USER_INTERACTION_REQUIRED";
          if (options.onError) options.onError(error);
          return reject(error);
        }        if (this.pollyClient) {
          try {
            // Pass speed from options to synthesizeWithPolly
            const audioData = await this.synthesizeWithPolly(text, language, {
              speed: options.speed || 1.0
            });
            await this.playAudioData(audioData, options);
            return resolve();
          } catch (pollyError) {
            console.warn("Polly playback failed:", pollyError.message);
            await this.playWithBrowserSpeech(text, language, options);
            return resolve();
          }
        } else {
          await this.playWithBrowserSpeech(text, language, options);
          return resolve();
        }

        throw new Error("All playback methods failed");
      } catch (error) {
        if (options.onError) options.onError(error);
        reject(error);
      }
    });
  }
  async synthesizeWithPolly(text, language, options = {}) {
    // Include speed in the cache key to store different speeds separately
    const speed = options.speed || 1.0;
    const cacheKey = `${text}-${language}-${speed}`;
    if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);

    // For AWS Polly, we use SSML to control speech rate rather than audio playback rate
    // This provides better quality audio at different speeds
    const ssmlText = `<speak><prosody rate="${speed === 1.0 ? '100%' : (speed * 100) + '%'}">${text}</prosody></speak>`;

    const params = {
      Text: ssmlText,
      TextType: "ssml",
      OutputFormat: "mp3",
      VoiceId: this.getVoiceId(language),
      Engine: "neural",
    };

    try {
      const data = await this.pollyClient.synthesizeSpeech(params).promise();
      const audioData = data.AudioStream;
      this.cache.set(cacheKey, audioData);
      return audioData;
    } catch (error) {
      throw error;
    }
  }  async playAudioData(audioData, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        const arrayBuffer = audioData.buffer.slice(
          audioData.byteOffset,
          audioData.byteOffset + audioData.byteLength
        );        const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        
        // Set playback rate if specified in options
        if (options.speed) {
          audio.playbackRate = options.speed;
        }

        this.currentAudio = { audio, isPaused: false, isStopped: false };const handleEnd = () => {
          // Only handle end events if this audio is still current and not stopped
          if (this.currentAudio?.audio === audio && !this.currentAudio?.isStopped) {
            this.currentAudio = null;
            URL.revokeObjectURL(url); // Clean up blob URL
            if (options.onEnd) options.onEnd();
            resolve();
          }
        };

        const handleError = (err) => {
          console.error('Audio playback error:', err);
          // Only handle errors if this audio is still current and not stopped
          if (this.currentAudio?.audio === audio && !this.currentAudio?.isStopped) {
            this.currentAudio = null;
            URL.revokeObjectURL(url); // Clean up blob URL
            const error = new Error(err.message || 'Audio playback failed');
            error.originalError = err;
            if (options.onError) options.onError(error);
            reject(error);
          }
        };

        audio.onended = handleEnd;
        audio.onerror = handleError;

        if (options.onStart) options.onStart();
        audio.play().catch((playError) => {
          // Only handle play errors if not stopped
          if (!this.currentAudio?.isStopped) {
            reject(playError);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }  async playWithBrowserSpeech(text, language, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        if (!("speechSynthesis" in window)) {
          return reject(new Error("Speech synthesis not supported"));
        }

        speechSynthesis.cancel();

        setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(text);

          const voices = speechSynthesis.getVoices();
          const langMap = {
            french: "fr",
            spanish: "es",
            german: "de",
            italian: "it",
            portuguese: "pt",
            english: "en",
            chinese: "zh",
            japanese: "ja",
            korean: "ko",
            arabic: "ar",
            hindi: "hi",
            russian: "ru",
          };

          const langCode = langMap[language?.toLowerCase()] || "en";
          const match = voices.find((v) =>
            v.lang.toLowerCase().includes(langCode)
          );

          if (match) utterance.voice = match;
          // Use the speed option if provided, otherwise use a slightly slower default
          utterance.rate = options.speed || 0.8;

          // Store reference to this utterance
          this.currentUtterance = utterance;

          utterance.onstart = () => {
            if (this.currentUtterance === utterance) {
              options.onStart && options.onStart();
            }
          };
          
          utterance.onend = () => {
            if (this.currentUtterance === utterance) {
              this.currentUtterance = null;
              options.onEnd && options.onEnd();
              resolve();
            }
          };          utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            if (this.currentUtterance === utterance) {
              this.currentUtterance = null;
              const error = new Error(event.error || 'Speech synthesis failed');
              error.originalEvent = event;
              options.onError && options.onError(error);
              reject(error);
            }
          };

          speechSynthesis.speak(utterance);
        }, 100);
      } catch (err) {
        reject(err);
      }
    });
  }
  pause() {
    if (this.currentAudio?.audio) {
      this.currentAudio.audio.pause();
      this.currentAudio.isPaused = true;
      return true;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      speechSynthesis.pause();
      return true;
    }

    return false;
  }

  resume() {
    if (this.currentAudio?.audio && this.currentAudio.isPaused) {
      this.currentAudio.audio.play();
      this.currentAudio.isPaused = false;
      return true;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      speechSynthesis.resume();
      return true;
    }

    return false;
  }

  isPaused() {
    if (this.currentAudio?.audio) {
      return this.currentAudio.isPaused || this.currentAudio.audio.paused;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      return speechSynthesis.paused;
    }

    return false;
  }

  isPlaying() {
    if (this.currentAudio?.audio) {
      return !this.currentAudio.audio.paused && !this.currentAudio.audio.ended;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      return speechSynthesis.speaking && !speechSynthesis.paused;
    }

    return false;
  }  stop() {
    // Stop and clean up audio element
    if (this.currentAudio?.audio) {
      // Mark as stopped to prevent event handlers from firing
      this.currentAudio.isStopped = true;
      
      // Pause and reset the audio
      this.currentAudio.audio.pause();
      this.currentAudio.audio.currentTime = 0;
      
      // Remove event listeners
      this.currentAudio.audio.onended = null;
      this.currentAudio.audio.onerror = null;
      this.currentAudio.audio.onloadstart = null;
      this.currentAudio.audio.onloadeddata = null;
      
      // Clear the src and load to reset
      this.currentAudio.audio.src = "";
      this.currentAudio.audio.load();
      
      this.currentAudio = null;
    }

    // Stop speech synthesis
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }

  isReady() {
    return this.isInitialized;
  }

  requiresUserInteraction() {
    return this.isUserInteractionRequired;
  }

  clearCache() {
    this.cache.clear();
  }
  cleanup() {
    this.stop();
    this.currentAudio = null;
    this.currentUtterance = null;
    this.clearCache();
  }
}

const audioService = new AudioService();

export default audioService;
export { audioService };
