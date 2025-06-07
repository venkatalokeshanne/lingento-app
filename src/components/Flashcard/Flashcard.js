"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";
import { motion } from "framer-motion";
import { audioService } from "@/services/audioService";
import { spacedRepetitionService } from "@/services/spacedRepetitionService";
import { bedrockService } from "@/services/bedrockService";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import toast from "react-hot-toast";

// Helper function to get ordered French pronouns
function getOrderedFrenchPronouns() {
  return ['je', 'tu', 'il/elle/on', 'nous', 'vous', 'ils/elles'];
}

// Helper function to order conjugations by French pronoun order
function orderConjugations(conjugations) {
  if (!conjugations || typeof conjugations !== 'object') {
    return conjugations;
  }
  
  const orderedPronouns = getOrderedFrenchPronouns();
  const ordered = {};
  
  // First, add pronouns in the correct order
  orderedPronouns.forEach(pronoun => {
    if (conjugations[pronoun]) {
      ordered[pronoun] = conjugations[pronoun];
    }
  });
  
  // Then add any remaining pronouns that might not match exactly
  Object.entries(conjugations).forEach(([pronoun, form]) => {
    if (!ordered[pronoun]) {
      ordered[pronoun] = form;
    }
  });
    return ordered;
}

// ConjugationModal Component
function ConjugationModal({ isOpen, onClose, word }) {
  const [playingAudio, setPlayingAudio] = useState(null);

  if (!isOpen || !word) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConjugationAudio = async (conjugatedForm, pronoun, tense) => {
    const audioKey = `${tense}-${pronoun}`;

    if (playingAudio === audioKey) {
      audioService.stop();
      setPlayingAudio(null);
      return;
    }

    try {
      // Create full phrase with pronoun and conjugated form
      let fullPhrase;
      if (word.language === 'fr' && pronoun.toLowerCase() === 'je' && /^[aeiouéèàh]/.test(conjugatedForm)) {
        fullPhrase = `J'${conjugatedForm}`;
      } else {
        fullPhrase = `${pronoun.charAt(0).toUpperCase() + pronoun.slice(1)} ${conjugatedForm}`;
      }

      await audioService.playAudio(fullPhrase, word.language, {
        onStart: () => {
          setPlayingAudio(audioKey);
        },
        onEnd: () => {
          setPlayingAudio(null);
        },
        onError: (error) => {
          console.error("Error playing conjugation audio:", error);
          setPlayingAudio(null);
        },
      });
    } catch (error) {
      console.error("Error with conjugation audio service:", error);
      setPlayingAudio(null);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {word.word}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {word.translation}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Word Info */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-full font-medium">
                {word.category}
              </span>
              {word.pronunciation && (
                <span className="text-gray-500 dark:text-gray-400 italic">
                  /{word.pronunciation}/
                </span>
              )}
            </div>
          </div>

          {/* Conjugations Table */}
          {word.conjugations && Object.keys(word.conjugations).length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Verb Conjugations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(word.conjugations).map(
                  ([tense, conjugations]) => (
                    <div
                      key={tense}
                      className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-700 shadow-sm"
                    >
                      <h4 className="text-lg font-bold text-emerald-800 dark:text-emerald-200 mb-3 text-center uppercase tracking-wide">
                        {tense === "passe" ? "Passé Composé" : tense}
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(orderConjugations(conjugations)).map(([pronoun, form]) => {
                          const audioKey = `${tense}-${pronoun}`;
                          const isPlaying = playingAudio === audioKey;
                          
                          // Handle French contractions (je + vowel = j')
                          let fullPhrase;
                          if (word.language === 'fr' && pronoun.toLowerCase() === 'je' && /^[aeiouéèàh]/.test(form)) {
                            fullPhrase = `J'${form}`;
                          } else {
                            fullPhrase = `${pronoun.charAt(0).toUpperCase() + pronoun.slice(1)} ${form}`;
                          }

                          return (
                            <div
                              key={pronoun}
                              className="flex items-center py-1 px-2 bg-white dark:bg-gray-700 rounded border border-emerald-100 dark:border-emerald-800"
                            >
                              <button
                                onClick={() =>
                                  handleConjugationAudio(form, pronoun, tense)
                                }
                                className={`w-full text-left font-medium text-gray-800 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer underline-offset-2 hover:underline flex items-center justify-between ${
                                  isPlaying ? 'text-emerald-600 dark:text-emerald-400' : ''
                                }`}
                                title={`Click to pronounce ${fullPhrase}`}
                              >
                                <span>{fullPhrase}</span>
                                {isPlaying ? (
                                  <motion.svg
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{
                                      repeat: Infinity,
                                      duration: 0.8,
                                    }}
                                    className="w-3 h-3 ml-2 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                                  </motion.svg>
                                ) : (
                                  <svg
                                    className="w-3 h-3 ml-2 flex-shrink-0 text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M3 9v6h4l5 5V4L7 9H3z" />
                                  </svg>
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function Flashcard({
  id,
  frontText,
  backText,
  imageUrl,
  category = "",
  mastered = false,
  onMasterToggle,
  onQualityRating,
  onExampleUpdate, // New prop to update examples
  language = "english", // Default language for backwards compatibility
  example,
  translatedExample,
  originalWord,
  translation,
  pronunciation, // IPA pronunciation notation
  conjugations, // Verb conjugations data
  // Spaced repetition props
  easinessFactor,
  repetitionNumber,
  interval,
  nextReviewDate,  isNew = false,
  showQualityRating = false,
}) {
  const { audioSpeed } = useUserPreferences();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRating, setShowRating] = useState(false);
  // Auto-generation states
  const [isGeneratingExamples, setIsGeneratingExamples] = useState(false);
  const [generatedExamples, setGeneratedExamples] = useState([]);
  const [showExamplesModal, setShowExamplesModal] = useState(false);
  const [localExample, setLocalExample] = useState(example);
  const [localTranslatedExample, setLocalTranslatedExample] =
    useState(translatedExample);

  // Conjugation modal state
  const [showConjugationModal, setShowConjugationModal] = useState(false);

  // Get quality rating options for spaced repetition
  const qualityOptions = spacedRepetitionService.getQualityRatingOptions(); // Update local state when props change
  useEffect(() => {
    setLocalExample(example);
    setLocalTranslatedExample(translatedExample);
  }, [example, translatedExample]);  // Auto-generate examples for the flashcard
  const handleGenerateExamples = async (e) => {
    // Ensure event doesn't propagate and prevent any unwanted side effects
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log("🔍 Add Example button clicked - event:", e);
    console.log("🔍 Current state - isFlipped:", isFlipped, "showQualityRating:", showQualityRating, "showRating:", showRating);
    
    if (!frontText || !backText || !bedrockService.isReady()) {
      toast.error(
        "Unable to generate examples. Please ensure AWS Bedrock is configured."
      );
      return;
    }

    console.log("🔍 Generating examples for:", frontText, "->", backText);
    
    setIsGeneratingExamples(true);
    try {
      const examples = await bedrockService.generateExamples(
        originalWord || frontText,
        translation || backText,
        language,
        "", // No definition available in flashcard context
        "intermediate"
      );

      if (examples && examples.length > 0) {
        setGeneratedExamples(examples);
        setShowExamplesModal(true);
        toast.success("Examples generated successfully!");
      } else {
        toast.error("No examples could be generated.");
      }
    } catch (error) {
      console.error("Error generating examples:", error);
      toast.error("Failed to generate examples. Please try again.");
    } finally {
      setIsGeneratingExamples(false);
    }
  };
  // Use a generated example
  const useExample = async (exampleText) => {
    try {
      // Auto-translate the example if we have translation service
      let translatedText = "";
      try {
        // Import translation service dynamically to avoid circular dependencies
        const { translateService } = await import(
          "@/services/translateService"
        );
          // Check if text is valid for translation before trying to translate
        if (translateService.isValidTextForTranslation(exampleText)) {          // Get the user's native language preference from window if available
          const userNativeLanguage = typeof window !== 'undefined' && window.__userNativeLanguage 
                                    ? window.__userNativeLanguage 
                                    : 'english';
                                    
          console.log(`Translating example from ${language} to ${userNativeLanguage}`);
          const result = await translateService.translateText(
            exampleText,
            language, // Source language (the language being learned)
            userNativeLanguage // Target language (user's native language)
          );
          translatedText = result?.translatedText || "";
        } else {
          console.log(`Example text not suitable for translation: "${exampleText}"`);
          translatedText = `[Translation needed] ${exampleText}`;
        }
      } catch (translateError) {
        console.warn("Could not translate example:", translateError);
      }

      setLocalExample(exampleText);
      setLocalTranslatedExample(translatedText);
      setShowExamplesModal(false);
      // Notify parent component if callback is provided
      if (onExampleUpdate) {
        onExampleUpdate(id, exampleText, translatedText);
      }

      toast.success("Example added to flashcard!");
    } catch (error) {
      console.error("Error updating example:", error);
      toast.error("Failed to update example.");
    }
  };

  const handleAudioPlay = async (e) => {
    e.stopPropagation();

    // if (isPlaying) {
    //   // Stop current audio
    //   try {
    //     console.log("@saibaba Stopping audio playback");
    //     audioService.stop();
    //     setIsPlaying(false);
    //   } catch (error) {
    //     console.error("Error stopping audio:", error);
    //     setIsPlaying(false);
    //   }
    //   return;
    // }

    try {
      setIsLoading(true);
      // Play the original word if we have an example, otherwise play frontText      console.log("@saibaba Playing audio for:", example ? originalWord || frontText : frontText);
      const textToPlay = example ? originalWord || frontText : frontText;
      await audioService.playAudio(textToPlay, language, {
        speed: audioSpeed, // Use the audio speed from user preferences
        onStart: () => {
          setIsPlaying(true);
          setIsLoading(false);
        },
        onEnd: () => {
          setIsPlaying(false);
        },
      });
    } catch (error) {
      console.error("Error with audio service:", error);

      // Show user-friendly error message
      if (
        error.message &&
        error.message.includes("User interaction required")
      ) {
        toast.error(
          "Audio requires user interaction on mobile devices. Please tap anywhere first!",
          {
            duration: 4000,
          }
        );
      } else {
        toast.error("Audio service unavailable. Please try again later.", {
          duration: 3000,
        });
      }

      setIsLoading(false);
      setIsPlaying(false);
    }
  };  const handleFlip = () => {
    console.log("🔄 Card flip triggered - current isFlipped:", isFlipped, "showQualityRating:", showQualityRating);
    setIsFlipped(!isFlipped);
    // Show quality rating buttons when flipping to the back (answer side)
    if (!isFlipped && showQualityRating) {
      console.log("🔄 Showing quality rating buttons");
      setShowRating(true);
    }
  };const handleQualityRating = (quality) => {
    console.log("⭐ Flashcard handleQualityRating called with quality:", quality);
    console.log("⭐ Current state - showQualityRating:", showQualityRating, "showRating:", showRating);
    
    // Prevent multiple clicks by hiding rating immediately
    setShowRating(false);
    
    if (onQualityRating) {
      console.log("⭐ Calling parent onQualityRating");
      onQualityRating(id, quality);
    }
    
    setIsFlipped(false); // Reset card for next review
  };

  const handleMasterToggle = (e) => {
    e.stopPropagation();
    if (onMasterToggle) {
      onMasterToggle(id, !mastered);
    }
  };
  // Add swipe functionality
  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleFlip,
    onSwipedRight: handleFlip,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-sm mx-auto"
    >
      <div className="flashcard-container" style={{ perspective: "1000px" }}>
        <div
          {...swipeHandlers}
          className={`flashcard ${isFlipped ? "flipped" : ""}`}
          onClick={handleFlip}
        >
          {/* Front of card */}
          <div className="flashcard-face flashcard-front">
            <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 flex flex-col border border-gray-200 dark:border-gray-700 shadow-lg">
              {" "}              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-2">
                  {category && (
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full w-fit">
                      {category}
                    </span>
                  )}
                  {/* Spaced Repetition Status */}
                  {showQualityRating && (
                    <div className="flex gap-1">
                      {isNew && (
                        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">
                          New
                        </span>
                      )}
                      {repetitionNumber > 0 && (
                        <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full">
                          Review #{repetitionNumber}
                        </span>
                      )}
                    </div>
                  )}{" "}
                </div>
                
                {/* Conjugation Button - only show if conjugations exist */}
                {conjugations && Object.keys(conjugations).length > 0 && (
                  <motion.button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowConjugationModal(true);
                    }}
                    className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-all shadow-lg"
                    aria-label="Show conjugations"
                    whileTap={{ scale: 0.95 }}
                    title="View conjugations"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </motion.button>
                )}
              </div>{" "}
              {/* Main content */}
              <div className="flex-1 flex flex-col items-center justify-center">
                {" "}
                {localExample ? (
                  <div className="text-center space-y-3">
                    <h3 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                      {frontText}
                    </h3>
                    {pronunciation && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                        ({pronunciation})
                      </p>
                    )}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Example:
                      </p>
                      <p className="text-base text-gray-700 dark:text-gray-300 italic">
                        "{localExample}"
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <h3 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                      {frontText}
                    </h3>
                    {pronunciation && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                        ({pronunciation})
                      </p>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Translate this word
                    </p>                    {/* Generate Example Button */}
                    {bedrockService.isReady() && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleGenerateExamples(e);
                          }}
                          disabled={isGeneratingExamples}
                          className="inline-flex items-center gap-2 px-3 py-2 text-xs bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-md transition-all duration-200 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
                        >
                          {isGeneratingExamples ? (
                            <>
                              <svg
                                className="w-3 h-3 animate-spin"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                              </svg>
                              Generating...
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                              </svg>
                              Add Example
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>              {/* Footer */}
              <div className="flex justify-between items-center mt-4">
                <motion.button
                  onClick={handleAudioPlay}
                  disabled={isLoading}
                  className={`w-10 h-10 rounded-full ${
                    isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                  } text-white flex items-center justify-center transition-all shadow-lg ${
                    isPlaying ? "ring-2 ring-blue-300 animate-pulse" : ""
                  }`}
                  aria-label="Play audio"
                  whileTap={{ scale: 0.95 }}
                >
                  {isLoading ? (
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : isPlaying ? (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 ml-0.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </motion.button>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  Tap to flip
                </span>
              </div>
            </div>
          </div>{" "}
          {/* Back of card */}
          <div className="flashcard-face flashcard-back">
            <div className="absolute inset-0 bg-blue-50 dark:bg-gray-700 rounded-2xl p-4 sm:p-6 flex flex-col border border-blue-200 dark:border-gray-600 shadow-lg">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <span className="px-3 py-1 text-xs font-medium bg-blue-200 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full">
                  Translation
                </span>
                {!showQualityRating && (
                  <button
                    onClick={handleMasterToggle}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      mastered
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {mastered ? "✓ Mastered" : "Mark as mastered"}
                  </button>
                )}
              </div>{" "}
              {/* Main content */}
              <div className="flex-1 flex items-center justify-center">
                {localExample && localTranslatedExample ? (
                  <div className="text-center space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        {translation || backText}
                      </h3>
                    </div>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Example translation:
                      </p>
                      <p className="text-lg text-gray-900 dark:text-white font-medium italic">
                        "{localTranslatedExample}"
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-lg sm:text-2xl text-center text-gray-900 dark:text-white font-medium leading-tight">
                      {backText}
                    </p>                    {/* Generate Example Button for back side */}
                    {bedrockService.isReady() && !showQualityRating && (
                      <div 
                        className="pt-4 border-t border-gray-200 dark:border-gray-600"
                        onClick={(e) => {
                          console.log("🔍 Add Example container clicked");
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <button
                          onClick={(e) => {
                            console.log("🔍 Add Example button clicked");
                            e.preventDefault();
                            e.stopPropagation();
                            handleGenerateExamples(e);
                          }}
                          disabled={isGeneratingExamples}
                          className="inline-flex items-center gap-2 px-3 py-2 text-xs bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-md transition-all duration-200 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
                        >
                          {isGeneratingExamples ? (
                            <>
                              <svg
                                className="w-3 h-3 animate-spin"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                              </svg>
                              Generating...
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                              </svg>
                              Add Example
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>              {/* Quality Rating Buttons for Spaced Repetition */}
              {showQualityRating && showRating && (
                <div className="mt-6 space-y-3 quality-rating">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                    How well did you know this?
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {qualityOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        onClick={() => handleQualityRating(option.value)}
                        className={`p-3 rounded-lg text-white text-sm font-medium transition-all ${option.color} hover:opacity-90 shadow-sm`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="text-center">
                          <div className="font-bold">{option.label}</div>
                          <div className="text-xs opacity-90">
                            {option.description}
                          </div>
                          <div className="text-xs opacity-75">
                            {option.interval}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
              {/* Footer */}
              {!showRating && (
                <div className="flex justify-end mt-4">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {showQualityRating
                      ? "Rate your recall"
                      : "Tap to flip back"}
                  </span>
                </div>
              )}
            </div>
          </div>{" "}
        </div>
      </div>

      {/* AI Generated Examples Modal */}
      {showExamplesModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setShowExamplesModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full p-6 border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                AI Generated Examples
              </h3>
              <button
                onClick={() => setShowExamplesModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              {generatedExamples.map((example, index) => (
                <div
                  key={index}
                  className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => useExample(example)}
                >
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    "{example}"
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Click to use this example
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowExamplesModal(false)}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Close
              </button>
            </div>          </motion.div>
        </motion.div>
      )}

      {/* Conjugation Modal */}
      {showConjugationModal && conjugations && (
        <ConjugationModal
          isOpen={showConjugationModal}
          onClose={() => setShowConjugationModal(false)}
          word={{
            word: frontText,
            translation: backText,
            pronunciation: pronunciation,
            conjugations: conjugations,
            language: language,
            category: category
          }}
        />
      )}
    </motion.div>
  );
}
