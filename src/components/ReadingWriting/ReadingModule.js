"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import { toast } from "react-hot-toast";
import { bedrockService } from "@/services/bedrockService";
import audioService from "@/services/audioService";
import { addUserData } from "@/utils/firebaseUtils";
import translateService from "@/services/translateService";
import WordModal from "@/components/WordModal/WordModal";

export default function ReadingModule({
  readingState,
  setReadingState,
  level,
  language,
}) {  const { currentUser } = useAuth();
  const { audioSpeed } = useUserPreferences();  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [showWordModal, setShowWordModal] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  // Use audio speed from user preferences, with fallback to 0.8 for language learning
  const playbackSpeed = audioSpeed || 0.8;

  // Create a ref to track previous text for change detection
  const prevTextRef = useRef("");
    // Log when audio speed changes from user preferences
  useEffect(() => {
    console.log("Reading module using audio speed:", playbackSpeed);
  }, [playbackSpeed]);

  // Update playback speed immediately when speed changes during playback
  useEffect(() => {
    if (isPlaying && !isPaused) {
      const success = audioService.updatePlaybackSpeed(playbackSpeed);
      if (success) {
        console.log("Audio speed updated to:", playbackSpeed);
      }
    }
  }, [playbackSpeed, isPlaying, isPaused]);

  // Extract state values from props
  const { text, textTitle, isGenerating } = readingState; // Sync local audio state with service state only when needed
  useEffect(() => {
    const syncAudioState = () => {
      // Don't sync if we're in the middle of generating text
      if (isGenerating) return;

      const serviceIsPlaying = audioService.isPlaying();
      const serviceIsPaused = audioService.isPaused();

      // Only update if the state has actually changed and log it
      if (serviceIsPlaying !== isPlaying || serviceIsPaused !== isPaused) {
        console.log("Syncing audio state:", {
          serviceIsPlaying,
          serviceIsPaused,
          localIsPlaying: isPlaying,
          localIsPaused: isPaused,
        });
        setIsPlaying(serviceIsPlaying);
        setIsPaused(serviceIsPaused);
      }
    };

    // Only sync when generating state changes
    syncAudioState();
  }, [isGenerating]); // Add isGenerating as dependency// Stop audio when text changes to a new text (not on first load)
  useEffect(() => {
    // Only stop if we already had text before and it's actually different
    if (prevTextRef.current && prevTextRef.current !== text && text) {
      console.log("Text changed, stopping audio");
      stopAudio();
      // Clear translation when text changes
      setTranslatedText('');
      setShowTranslation(false);
    }

    prevTextRef.current = text;
  }, [text]);

  const levels = {
    beginner: "Beginner (A1-A2)",
    intermediate: "Intermediate (B1-B2)",
    advanced: "Advanced (C1-C2)",
  };

  const languages = {
    english: "English",
    spanish: "Spanish",
    german: "German",
    italian: "Italian",
    portuguese: "Portuguese",
  };  // AI-only text generation - no local content fallbacks
  const generateText = async () => {
    console.log("generateText called - starting AI generation");
    console.log("Current state:", { text: text?.substring(0, 50), textTitle, isGenerating });
    console.log("Level:", level, "Language:", language);
    
    if (!bedrockService.isReady()) {
      console.log("Bedrock service not ready");
      toast.error("AI service is not available");
      return;
    }

    console.log("Setting isGenerating to true");
    setReadingState((prev) => ({ ...prev, isGenerating: true }));    try {
      console.log("Generating AI content for:", { level, language });
      
      // Create sophisticated variety in topics by avoiding previously generated ones
      const avoidTopics = readingState.generatedTopics && readingState.generatedTopics.length > 0 
        ? `\n\nCRITICAL: NEVER repeat these previously used topics: ${readingState.generatedTopics.join(', ')}. You MUST choose a completely different subject area.`
        : '';

      // Diverse topic pools with specific variety for reading
      const readingTopicCategories = {
        beginner: {
          cultural: ['traditional festivals', 'local customs', 'food traditions', 'family celebrations', 'regional music', 'folk stories'],
          nature: ['seasonal changes', 'animal behaviors', 'plant life cycles', 'weather patterns', 'natural landmarks', 'environmental care'],
          daily_life: ['transportation methods', 'shopping habits', 'work routines', 'educational systems', 'healthcare practices', 'communication styles'],
          entertainment: ['popular sports', 'traditional games', 'music genres', 'dance forms', 'storytelling traditions', 'art forms']
        },
        intermediate: {
          historical: ['historical figures', 'important events', 'cultural movements', 'technological advances', 'social changes', 'architectural developments'],
          scientific: ['medical discoveries', 'space exploration', 'environmental research', 'technological innovations', 'biological studies', 'physics concepts'],
          social: ['cultural exchange', 'migration stories', 'community projects', 'social movements', 'generational differences', 'urban development'],
          economic: ['trade relationships', 'business innovations', 'market trends', 'entrepreneurship', 'sustainable practices', 'global commerce']
        },
        advanced: {
          philosophical: ['ethical debates', 'moral dilemmas', 'philosophical schools', 'existential questions', 'consciousness studies', 'human nature'],
          analytical: ['policy analysis', 'research findings', 'statistical trends', 'comparative studies', 'theoretical frameworks', 'academic discourse'],
          global: ['geopolitical issues', 'international relations', 'global challenges', 'cross-cultural analysis', 'diplomatic history', 'world systems'],
          futuristic: ['emerging technologies', 'future predictions', 'scientific possibilities', 'societal evolution', 'innovation impacts', 'paradigm shifts']
        }
      };

      // Randomly select a category and topic to ensure maximum variety
      const categories = Object.keys(readingTopicCategories[level] || readingTopicCategories.beginner);
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const categoryTopics = readingTopicCategories[level]?.[randomCategory] || readingTopicCategories.beginner.cultural;
      const randomTopic = categoryTopics[Math.floor(Math.random() * categoryTopics.length)];

      // Different text styles for variety
      const textStyles = {
        beginner: ['informational article', 'personal story', 'descriptive piece', 'simple explanation', 'cultural introduction'],
        intermediate: ['analytical article', 'comparative study', 'historical account', 'research summary', 'opinion piece'],
        advanced: ['academic analysis', 'critical examination', 'theoretical discussion', 'research paper excerpt', 'philosophical treatise']
      };

      const styles = textStyles[level] || textStyles.beginner;
      const randomStyle = styles[Math.floor(Math.random() * styles.length)];
      
      // Create a detailed prompt for better AI generation
      const prompt = `You are a ${language} language teacher. Create a ${level} level reading text as a ${randomStyle} about "${randomTopic}" from the "${randomCategory}" category.

MANDATORY REQUIREMENTS:
1. Text length: 150-250 words
2. Focus specifically on: "${randomTopic}"
3. Write as: ${randomStyle}
4. Vocabulary appropriate for ${level} level
5. Include interesting facts or perspectives

${avoidTopics}

CRITICAL FORMATTING REQUIREMENTS:
1. Return ONLY valid JSON in this exact format with no additional text or explanation
2. Use proper line breaks (\\n) in the content for paragraphs
3. Format: {"title": "Title Here", "content": "Text content here with \\n for new paragraphs"}

Create an engaging, educational text that provides unique insights about ${randomTopic}.`;

      console.log("Sending prompt to AI:", prompt);
      const response = await bedrockService.generateText(prompt);
      console.log("AI response received:", response.substring(0, 100) + "...");

      // Enhanced JSON parsing with better cleaning and formatting
      try {
        // Remove any markdown formatting, extra text, and normalize the response
        let cleanResponse = response
          .replace(/```json/gi, "")
          .replace(/```/g, "")
          .replace(/Here is.*?format:\s*/i, "")
          .replace(/Here is.*?JSON format:\s*/i, "")
          .replace(/Here's.*?format:\s*/i, "")
          .trim();
        
        // Find JSON-like content between braces
        const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          cleanResponse = jsonMatch[0];
        }
        
        const parsed = JSON.parse(cleanResponse);
        
        if (parsed.title && parsed.content) {
          console.log("Successfully parsed AI response");
          
          // Format the content properly - convert \\n to actual line breaks
          const formattedContent = parsed.content
            .replace(/\\n/g, '\n')
            .replace(/\\\"/g, '"')
            .replace(/\\\'/g, "'")
            .trim();
            // Track this topic to avoid repetition - use the specific topic we asked for
          const currentTopics = readingState.generatedTopics || [];
          const newTopics = [...currentTopics, `${randomCategory}-${randomTopic}`].slice(-5); // Keep last 5 topics
          
          setReadingState((prev) => ({
            ...prev,
            textTitle: parsed.title,
            text: formattedContent,
            isGenerating: false,
            generatedTopics: newTopics
          }));
          toast.success("New reading text generated!");
        } else {
          throw new Error("Invalid JSON structure");
        }
      } catch (parseError) {
        console.log("JSON parsing failed, extracting content manually");
        
        // Fallback: extract content manually if JSON parsing fails
        const titleMatch = response.match(/"title":\s*"([^"]+)"/);
        const contentMatch = response.match(/"content":\s*"([^"]*?)"/);
        
        if (titleMatch && contentMatch) {
          const formattedContent = contentMatch[1]
            .replace(/\\n/g, '\n')
            .replace(/\\\"/g, '"')
            .replace(/\\\'/g, "'")
            .trim();
              const currentTopics = readingState.generatedTopics || [];
          const newTopics = [...currentTopics, `${randomCategory}-${randomTopic}`].slice(-5);
          
          setReadingState((prev) => ({
            ...prev,
            textTitle: titleMatch[1],
            text: formattedContent,
            isGenerating: false,
            generatedTopics: newTopics
          }));
        } else {          // Final fallback: use raw response with basic cleaning
          const cleanedText = response
            .replace(/^.*?"content":\s*"/, "")
            .replace(/".*$/, "")
            .replace(/\\n/g, '\n')
            .replace(/\\\"/g, '"')
            .replace(/\\\'/g, "'")
            .trim();
            
          const currentTopics = readingState.generatedTopics || [];
          const newTopics = [...currentTopics, `${randomCategory}-${randomTopic}`].slice(-5);
            
          setReadingState((prev) => ({
            ...prev,
            textTitle: "Reading Text",
            text: cleanedText,
            isGenerating: false,
            generatedTopics: newTopics
          }));
        }
        toast.success("Reading text generated!");
      }
    } catch (error) {
      console.error("Error generating text:", error);
      setReadingState((prev) => ({ ...prev, isGenerating: false }));
      toast.error("Failed to generate reading text. Please try again.");
    }  };

  // Play/pause/resume audio for the entire text
  const toggleAudio = async () => {
    if (!text) return;

    try {
      // Check current audio service state
      const serviceIsPlaying = audioService.isPlaying();
      const serviceIsPaused = audioService.isPaused();

      console.log(
        "Toggle audio - serviceIsPlaying:",
        serviceIsPlaying,
        "serviceIsPaused:",
        serviceIsPaused
      );

      // If currently playing, pause it
      if (serviceIsPlaying && !serviceIsPaused) {
        console.log("Pausing audio");
        const success = audioService.pause();
        if (success) {
          setIsPlaying(false);
          setIsPaused(true);
        }
        return;
      }

      // If paused, resume it
      if (serviceIsPaused) {
        console.log("Resuming audio");
        const success = audioService.resume();
        if (success) {
          setIsPlaying(true);
          setIsPaused(false);
        }
        return;
      }      // If not playing and not paused, start playing
      console.log("Starting new audio with speed:", playbackSpeed);
      setIsPlaying(true);
      setIsPaused(false);      await audioService.playAudio(text, language, {
        speed: playbackSpeed, // Pass the speed from user preferences
        onStart: () => {
          console.log("Audio started at speed:", playbackSpeed);
          setIsPlaying(true);
          setIsPaused(false);
        },
        onEnd: () => {
          console.log("Audio ended");
          setIsPlaying(false);
          setIsPaused(false);
        },
        onError: (error) => {
          console.error("Audio error:", error);
          // Only show error if we're still in a playing state
          if (isPlaying) {
            // Provide more detailed error handling
            if (error?.code === "USER_INTERACTION_REQUIRED") {
              toast.error(
                "Please tap anywhere on the screen first to enable audio!"
              );
            } else if (
              error?.message &&
              error.message !==
                "The play() request was interrupted by a call to pause()."
            ) {
              console.error("Audio error details:", error.message);
              toast.error("Audio playback failed: " + error.message);
            } else if (!error?.message) {
              console.error("Unknown audio error:", error);
              toast.error("Audio playback failed");
            }
            // If it's just an interruption error (from stopping), don't show an error
          }
          setIsPlaying(false);
          setIsPaused(false);
        },
      });
    } catch (error) {
      console.error("Error with audio:", error);
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  // Stop audio completely
  const stopAudio = () => {
    console.log("Stopping audio");
    audioService.stop();
    setIsPlaying(false);
    setIsPaused(false);
  };

  // Handle word selection in text
  const handleWordSelect = (word) => {
    // Clean the word (remove punctuation)
    const cleanWord = word.replace(/[.,!?;:"()]/g, "").trim();
    if (cleanWord.length > 0) {
      setSelectedWord(cleanWord);
      setShowWordModal(true);
    }
  };

  // Add selected word to vocabulary
  const addToVocabulary = async (wordData) => {
    if (!currentUser) {
      toast.error("Please log in to add words to vocabulary");
      return;
    }

    try {
      const vocabularyEntry = {
        word: wordData.word,
        translation: wordData.translation || "",
        pronunciation: wordData.pronunciation || "",
        definition: wordData.definition || "",
        example: wordData.example || "",
        category: "Vocabulary",
        language: language,
        dateAdded: new Date().toISOString(),
        source: "reading_practice",
      };

      await addUserData(currentUser, "vocabulary", vocabularyEntry);
      toast.success(`"${wordData.word}" added to vocabulary!`);
      setShowWordModal(false);
      setSelectedWord(null);    } catch (error) {
      console.error("Error adding to vocabulary:", error);
      toast.error("Failed to add word to vocabulary");
    }
  };

  // Translate complete reading text
  const translateCompleteText = async () => {
    if (!text) {
      toast.error("No text available to translate");
      return;
    }

    if (isTranslating) return;

    try {
      setIsTranslating(true);
      
      // If translation is already available, just toggle display
      if (translatedText && !showTranslation) {
        setShowTranslation(true);
        return;
      }

      // Translate the complete text to user's native language (English by default)
      const result = await translateService.translateText(text, language, 'english');
      setTranslatedText(result.translatedText);
      setShowTranslation(true);
      toast.success("Text translated successfully!");
      
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Failed to translate text. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  // Toggle translation display
  const toggleTranslation = () => {
    if (translatedText) {
      setShowTranslation(!showTranslation);
    } else {
      translateCompleteText();
    }
  };

  // Render text with clickable words
  const renderInteractiveText = (text) => {
    if (!text) return null;

    return text.split(/(\s+)/).map((part, index) => {
      if (part.trim().length === 0) {
        return part; // Return whitespace as-is
      }

      const isWord = /[a-zA-ZÀ-ÿ]+/.test(part);
      if (isWord) {
        return (
          <span
            key={index}
            className="cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800 rounded px-1 py-0.5 mx-0.5 transition-colors inline-block touch-manipulation"
            onClick={() => handleWordSelect(part)}
            title="Tap to add to vocabulary"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };  return (
    <div className="space-y-4">
      {/* Compact Header with Essential Controls */}
      <div className="bg-white/90 dark:bg-gray-800/90 shadow-md rounded-xl p-4 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white text-sm">📖</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-white">
                Reading Practice
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI-generated content
              </p>
            </div>
          </div>

          {/* Compact Generate Button */}
          <button
            onClick={generateText}
            disabled={isGenerating}
            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-400 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>New Text</span>
              </>
            )}
          </button>
        </div>
      </div>      {/* Compact Reading Text Display */}
      {text && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          {/* Minimalist Header */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 mr-2 overflow-hidden">
                <span className="text-blue-500 text-sm">📖</span>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {textTitle}
                </h3>
              </div>                {/* Compact Audio Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleAudio}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 ${
                    isPlaying && !isPaused
                      ? "bg-amber-500 text-white"
                      : isPaused
                      ? "bg-green-500 text-white"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {isPlaying && !isPaused ? (
                    <>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" />
                      </svg>
                      <span>Pause</span>
                    </>
                  ) : isPaused ? (
                    <>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                      </svg>
                      <span>Resume</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                      </svg>
                      <span>Play</span>
                    </>
                  )}
                </button>
                  {(isPlaying || isPaused) && (
                  <button
                    onClick={stopAudio}
                    className="px-2.5 py-1.5 bg-red-500 text-white rounded-md text-xs font-medium flex items-center gap-1.5"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" />
                    </svg>
                    <span>Stop</span>
                  </button>
                )}

                {/* Translate Button */}
                <button
                  onClick={toggleTranslation}
                  disabled={isTranslating}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 ${
                    showTranslation
                      ? "bg-purple-500 text-white"
                      : "bg-indigo-500 text-white hover:bg-indigo-600"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isTranslating ? (
                    <>
                      <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Translating...</span>
                    </>
                  ) : showTranslation ? (
                    <>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                      </svg>
                      <span>Hide Translation</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.723 1.447a1 1 0 11-1.79-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd"/>
                      </svg>
                      <span>Translate</span>
                    </>
                  )}
                </button>
                  {/* Speed control UI removed, fixed speed of 0.8 is used */}
              </div>
            </div>
          </div>          {/* Text Content */}
          <div className="p-3">
            <div className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">
              {renderInteractiveText(text)}
            </div>

            {/* Translation Display */}
            {showTranslation && translatedText && (
              <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.723 1.447a1 1 0 11-1.79-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd"/>
                  </svg>
                  <h4 className="text-sm font-medium text-purple-800 dark:text-purple-200">Translation (English)</h4>
                </div>
                <div className="text-sm leading-relaxed text-purple-700 dark:text-purple-300">
                  {translatedText}
                </div>
              </div>
            )}
            
            {/* Compact Interactive Tip */}
            <div className="mt-3 flex items-center gap-1.5 border-t border-gray-100 dark:border-gray-700 pt-2 text-xs text-emerald-600 dark:text-emerald-400">
              <span>💡</span>
              <span>Tap any word to see definitions and add to vocabulary</span>
            </div>
          </div>
        </div>
      )}{/* Reusable WordModal Component */}
      {showWordModal && selectedWord && (
        <WordModal
          isOpen={showWordModal}
          initialWord={selectedWord}
          language={language}
          onSubmit={addToVocabulary}
          onClose={() => {
            setShowWordModal(false);
            setSelectedWord(null);
          }}
          userId={currentUser?.uid}
        />
      )}
    </div>
  );
}
