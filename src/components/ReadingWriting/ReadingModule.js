"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import { bedrockService } from "@/services/bedrockService";
import audioService from "@/services/audioService";
import { addUserData } from "@/utils/firebaseUtils";
import translateService from "@/services/translateService";

export default function ReadingModule({
  readingState,
  setReadingState,
  level,
  language,
}) {
  const { currentUser } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [showWordModal, setShowWordModal] = useState(false);
  // Fixed playback speed (0.8) for language learning - UI controls removed per requirements
  const playbackSpeed = 0.8;

  // Create a ref to track previous text for change detection
  const prevTextRef = useRef("");

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
    }

    prevTextRef.current = text;
  }, [text]);

  const levels = {
    beginner: "Beginner (A1-A2)",
    intermediate: "Intermediate (B1-B2)",
    advanced: "Advanced (C1-C2)",
  };

  const languages = {
    french: "French",
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
      }

      // If not playing and not paused, start playing
      console.log("Starting new audio");
      setIsPlaying(true);
      setIsPaused(false);      await audioService.playAudio(text, language, {
        speed: playbackSpeed, // Pass the speed to audio service
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
      setSelectedWord(null);
    } catch (error) {
      console.error("Error adding to vocabulary:", error);
      toast.error("Failed to add word to vocabulary");
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
                  {/* Speed control UI removed, fixed speed of 0.8 is used */}
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="p-3">
            <div className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">
              {renderInteractiveText(text)}
            </div>
            
            {/* Compact Interactive Tip */}
            <div className="mt-3 flex items-center gap-1.5 border-t border-gray-100 dark:border-gray-700 pt-2 text-xs text-emerald-600 dark:text-emerald-400">
              <span>💡</span>
              <span>Tap any word to see definitions and add to vocabulary</span>
            </div>
          </div>
        </div>
      )}{/* Mobile-Optimized Word Modal */}
      {showWordModal && selectedWord && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:w-full sm:max-w-lg max-h-[90vh] overflow-hidden shadow-2xl transform transition-all border-t sm:border border-gray-200 dark:border-gray-700">
            <WordModal
              word={selectedWord}
              language={language}
              onAddToVocabulary={addToVocabulary}
              onClose={() => {
                setShowWordModal(false);
                setSelectedWord(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Word Modal Component
function WordModal({ word, language, onAddToVocabulary, onClose }) {
  const [isLoading, setIsLoading] = useState(true);
  const [wordData, setWordData] = useState({
    word: word,
    translation: "",
    pronunciation: "",
    definition: "",
    example: "",
  });

  useEffect(() => {
    generateWordData();
  }, [word, language]);
  
  // Generate word data with translation service
 // Generate word data with translation service and AI enhancement
const generateWordData = async () => {
  setIsLoading(true);  try {    // Clean the word (remove any punctuation)
    const cleanWord = word.replace(/[.,!?;:"()]/g, "").trim();
    
    // Store translation result for later use
    let translationResult = null;
    
    // Use translation service to get the translation
    try {
      // Check first if text is valid for translation
      if (!translateService.isValidTextForTranslation(cleanWord, true)) {
        console.log(`Word not suitable for translation: "${cleanWord}"`);
        // Still keep the word but mark that translation failed
        setWordData((prev) => ({
          ...prev,
          word: cleanWord,
          translation: "[Translation needed]",
        }));
      } else {
        translationResult = await translateService.simpleTranslate(cleanWord, language);
        
        // Update word data with translation
        setWordData((prev) => ({
          ...prev,
          word: cleanWord,
          translation: translationResult.translation,
        }));
      }
    } catch (translationError) {
      console.error("Translation error in WordModal:", translationError);
      // Still keep the word but mark that translation failed
      setWordData((prev) => ({
        ...prev,
        word: cleanWord,
        translation: "[Translation needed]",
      }));
    }
    
    // Now use AI to enhance the word data with pronunciation, definition and example
    try {
      const pronunciation = await bedrockService.generatePronunciation(
        cleanWord,
        language // Use the proper language passed from props
      );

    //   const aiResponse = await bedrockService.generateText(prompt);
      
      // Clean and parse the AI response
    //   const cleanJson = aiResponse
    //     .replace(/```json|```/g, '')
    //     .replace(/(\r\n|\n|\r)/gm, '')
    //     .trim();
      
      // Parse the JSON response
    //   const aiData = JSON.parse(cleanJson);
      const examples = await bedrockService.generateExamples(
        cleanWord,
        translationResult ? translationResult.translation : cleanWord,
        language,
        "",
        'intermediate'
      );
      // Update with AI-enhanced data
      setWordData((prev) => ({
        ...prev,
        pronunciation: pronunciation || "",
        // definition: aiData.definition || "",
        example: examples[0] || ""
      }));
      
    } catch (aiError) {
      console.error("AI enhancement error:", aiError);
      // Continue with just the translation if AI enhancement fails
    }  } catch (error) {
    console.error("Word data generation error:", error);
    toast.error("Could not generate complete word data. Some features may be limited.");
    
    // If the whole process fails, just keep the original word
    setWordData((prev) => ({
      ...prev,
      word: word,
      translation: "[Translation needed]",
    }));
  } finally {
    setIsLoading(false);
  }
};

return (
    <div className="max-h-[90vh] overflow-y-auto">
      {isLoading ? (
        <div className="p-6 text-center">
          <div className="w-8 h-8 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading word data...
          </p>
        </div>
      ) : (
        <div className="p-4 sm:p-6">
          {/* Mobile-Optimized Header */}
          <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 truncate">
                {wordData.word}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Add to your vocabulary collection
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center transition-colors shrink-0"
            >
              <span className="text-gray-500 dark:text-gray-400">×</span>
            </button>
          </div>

          {/* Mobile-Friendly Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Translation
              </label>
              <input
                type="text"
                value={wordData.translation}
                onChange={(e) =>
                  setWordData((prev) => ({
                    ...prev,
                    translation: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all"
                placeholder="Enter translation..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Pronunciation (IPA)
              </label>
              <input
                type="text"
                value={wordData.pronunciation}
                onChange={(e) =>
                  setWordData((prev) => ({
                    ...prev,
                    pronunciation: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all"
                placeholder="Enter pronunciation (e.g., /bɔ̃.ʒuʁ/)..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Definition
              </label>
              <textarea
                value={wordData.definition}
                onChange={(e) =>
                  setWordData((prev) => ({
                    ...prev,
                    definition: e.target.value,
                  }))
                }
                rows={2}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all resize-none"
                placeholder="Enter definition or explanation..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Example Sentence
              </label>
              <textarea
                value={wordData.example}
                onChange={(e) =>
                  setWordData((prev) => ({ ...prev, example: e.target.value }))
                }
                rows={2}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all resize-none"
                placeholder="Enter an example sentence using this word..."
              />
            </div>

            {/* Mobile-Optimized Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => onAddToVocabulary(wordData)}
                className="w-full sm:flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 text-sm"
              >
                Add to Vocabulary
              </button>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
