"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";
import { motion } from "framer-motion";
import { audioService } from "@/services/audioService";
import { spacedRepetitionService } from "@/services/spacedRepetitionService";
import { bedrockService } from "@/services/bedrockService";
import toast from "react-hot-toast";

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
  language = "french", // Additional vocabulary data for examples
  example,
  translatedExample,
  originalWord,
  translation,
  pronunciation, // IPA pronunciation notation
  // Spaced repetition props
  easinessFactor,
  repetitionNumber,
  interval,
  nextReviewDate,
  isNew = false,
  showQualityRating = false,
}) {
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

  // Get quality rating options for spaced repetition
  const qualityOptions = spacedRepetitionService.getQualityRatingOptions(); // Update local state when props change
  useEffect(() => {
    setLocalExample(example);
    setLocalTranslatedExample(translatedExample);
  }, [example, translatedExample]);

  // Auto-generate examples for the flashcard
  const handleGenerateExamples = async () => {
    if (!frontText || !backText || !bedrockService.isReady()) {
      toast.error(
        "Unable to generate examples. Please ensure AWS Bedrock is configured."
      );
      return;
    }

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
        const result = await translateService.translateText(
          exampleText,
          language,
          "english"
        );
        translatedText = result?.translatedText || "";
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
      // Play the original word if we have an example, otherwise play frontText
      console.log("@saibaba Playing audio for:", example ? originalWord || frontText : frontText);
      const textToPlay = example ? originalWord || frontText : frontText;
      await audioService.playAudio(textToPlay, language, {
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
  };
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    // Show quality rating buttons when flipping to the back (answer side)
    if (!isFlipped && showQualityRating) {
      setShowRating(true);
    }
  };

  const handleQualityRating = (quality) => {
    if (onQualityRating) {
      onQualityRating(id, quality);
    }
    setShowRating(false);
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
              {" "}
              {/* Header */}
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
                    </p>

                    {/* Generate Example Button */}
                    {bedrockService.isReady() && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGenerateExamples();
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
              </div>
              {/* Footer */}
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
                    </p>

                    {/* Generate Example Button for back side */}
                    {bedrockService.isReady() && !showQualityRating && (
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGenerateExamples();
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
              </div>
              {/* Quality Rating Buttons for Spaced Repetition */}
              {showQualityRating && showRating && (
                <div className="mt-6 space-y-3">
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
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
