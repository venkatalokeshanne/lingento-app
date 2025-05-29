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
        }

        if (this.pollyClient) {
          try {
            const audioData = await this.synthesizeWithPolly(text, language);
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

  async synthesizeWithPolly(text, language) {
    const cacheKey = `${text}-${language}`;
    if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);

    const params = {
      Text: text,
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
  }

  async playAudioData(audioData, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        const arrayBuffer = audioData.buffer.slice(
          audioData.byteOffset,
          audioData.byteOffset + audioData.byteLength
        );

        const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);

        this.currentAudio = { audio };

        audio.onended = () => {
          this.currentAudio = null;
          if (options.onEnd) options.onEnd();
          resolve();
        };

        audio.onerror = (err) => {
          if (options.onError) options.onError(err);
          reject(err);
        };

        if (options.onStart) options.onStart();
        audio.play().catch(reject);
      } catch (err) {
        reject(err);
      }
    });
  }

  async playWithBrowserSpeech(text, language, options = {}) {
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
          utterance.rate = 0.8;

          utterance.onstart = () => options.onStart && options.onStart();
          utterance.onend = () => {
            options.onEnd && options.onEnd();
            resolve();
          };
          utterance.onerror = (e) => {
            options.onError && options.onError(e);
            reject(e);
          };

          speechSynthesis.speak(utterance);
        }, 100);
      } catch (err) {
        reject(err);
      }
    });
  }

  stop() {
    if (this.currentAudio?.audio) {
      this.currentAudio.audio.pause();
      this.currentAudio.audio.src = "";
      this.currentAudio = null;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      speechSynthesis.cancel();
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
  }
}

const audioService = new AudioService();

export default audioService;
export { audioService };
