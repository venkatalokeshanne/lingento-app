"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { bedrockService } from "@/services/bedrockService";
import audioService from "@/services/audioService";
import { addUserData, updateUserData } from "@/utils/firebaseUtils";
import translateService from "@/services/translateService";

// Helper function to get ordered French pronouns
function getOrderedFrenchPronouns() {
  return ["je", "tu", "il/elle/on", "nous", "vous", "ils/elles"];
}

// Helper function to order conjugations by French pronoun order
function orderConjugations(conjugations) {
  if (!conjugations || typeof conjugations !== "object") {
    return conjugations;
  }

  const orderedPronouns = getOrderedFrenchPronouns();
  const ordered = {};

  // First, add pronouns in the correct order
  orderedPronouns.forEach((pronoun) => {
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

/**
 * Reusable Word Modal Component for adding vocabulary across the app
 */
function WordModal({
  isOpen,
  onClose,
  onSubmit,
  editingWord = null,
  initialWord = "",
  language = "en",
  userId = null,
}) {
  const router = useRouter(); // Form state
  const [formData, setFormData] = useState({
    word: "",
    translation: "",
    pronunciation: "",
    example: "",
    category: "vocabulary",
    partOfSpeech: "",
    language: language || "fr",
  }); // Modal state for AI features
  const [isGeneratingExamples, setIsGeneratingExamples] = useState(false);
  const [generatedExamples, setGeneratedExamples] = useState([]);
  const [showExamples, setShowExamples] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationTimeout, setTranslationTimeout] = useState(null);
  const [isGeneratingPronunciation, setIsGeneratingPronunciation] =
    useState(false);
  const [verbConjugations, setVerbConjugations] = useState(null);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [autoFillTimeout, setAutoFillTimeout] = useState(null);

  // Word suggestions state
  const [wordSuggestions, setWordSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [suggestionTimeout, setSuggestionTimeout] = useState(null);

  // Audio state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Return null if modal is not open
  if (!isOpen) return null;
  // Initialize form with data when editing
  useEffect(() => {
    if (editingWord) {      setFormData({
        word: (editingWord.word || "").toLowerCase(),
        translation: editingWord.translation || "",
        pronunciation: editingWord.pronunciation || "",
        example: editingWord.example || "",
        category: editingWord.category || "",
        partOfSpeech: editingWord.partOfSpeech || "",
        language: editingWord.language || language || "fr",
      });

      // Load verb conjugations if they exist
      if (editingWord.conjugations) {
        setVerbConjugations(editingWord.conjugations);
      } else {
        setVerbConjugations(null);
      }    } else if (initialWord) {
      const lowercaseInitialWord = initialWord.toLowerCase();
      setFormData((prev) => ({
        ...prev,
        word: lowercaseInitialWord,
      }));

      // Clear conjugations for new words (they'll be auto-generated)
      setVerbConjugations(null);

      // Auto-fill all fields when initialWord is provided
      if (initialWord) {
        handleComprehensiveAutoFill(lowercaseInitialWord);
      }
    } else {
      // Clear conjugations when opening modal for new words
      setVerbConjugations(null);
    }
  }, [editingWord, initialWord, language]); // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (translationTimeout) {
        clearTimeout(translationTimeout);
      }
      if (suggestionTimeout) {
        clearTimeout(suggestionTimeout);
      }
      if (autoFillTimeout) {
        clearTimeout(autoFillTimeout);
      }
    };
  }, [translationTimeout, suggestionTimeout, autoFillTimeout]);

  // Handle click outside to hide suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the word input and suggestions dropdown
      const wordInput = event.target.closest('[name="word"]');
      const suggestionsDropdown = event.target.closest(".suggestions-dropdown");

      if (!wordInput && !suggestionsDropdown) {
        setShowSuggestions(false);
      }
    };

    if (showSuggestions) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showSuggestions]);
  // Auto-translate example sentences from native language to English
  const autoTranslateExample = async (exampleText, sourceLanguage) => {
    if (
      !exampleText ||
      !translateService.isValidTextForTranslation(exampleText)
    )
      return;

    try {
      // Get user's native language preference
      const userNativeLanguage =
        typeof window !== "undefined" && window.__userNativeLanguage
          ? window.__userNativeLanguage
          : "english";

      console.log(
        `Translating example from ${sourceLanguage} to ${userNativeLanguage}`
      );
      const result = await translateService.translateText(
        exampleText,
        sourceLanguage, // Source language (language being learned)
        userNativeLanguage // Target language (user's native language)
      );

      if (result?.translatedText) {
        setFormData((prev) => ({
          ...prev,
          translatedExample: result.translatedText,
        }));
      }
    } catch (error) {
      console.error("Auto-translate example failed:", error);
    }
  };  // Handle input changes and auto-generate content
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Convert word to lowercase to ensure consistency
    const processedValue = name === "word" ? value.toLowerCase() : value;
    setFormData((prev) => ({ ...prev, [name]: processedValue }));    // Generate word suggestions when word field changes
    if (name === "word") {
      // Generate suggestions as user types (using the processed lowercase value)
      handleGenerateWordSuggestions(processedValue);
      // Reset state when word field is cleared
      if (!processedValue.trim()) {
        // Clear all auto-generated content
        setFormData((prev) => ({
          ...prev,
          word: "",
          translation: "",
          pronunciation: "",
          example: "",
          partOfSpeech: "",
        }));

        // Reset all loading states
        setIsAutoFilling(false);
        setIsTranslating(false);
        setIsGeneratingPronunciation(false);
        setIsGeneratingExamples(false);
        setIsGeneratingSuggestions(false);

        // Clear suggestions and conjugations
        setWordSuggestions([]);
        setShowSuggestions(false);
        setVerbConjugations(null);
        setGeneratedExamples([]);
        setShowExamples(false);

        // Clear timeouts
        if (translationTimeout) {
          clearTimeout(translationTimeout);
          setTranslationTimeout(null);
        }
        if (autoFillTimeout) {
          clearTimeout(autoFillTimeout);
          setAutoFillTimeout(null);
        }
        if (suggestionTimeout) {
          clearTimeout(suggestionTimeout);
          setSuggestionTimeout(null);
        }
      }
    } else {
      // Hide suggestions when user focuses on other fields
      setShowSuggestions(false);
    }
  };
  // Handle word field focus
  const handleWordFieldFocus = () => {
    // Show suggestions if we have them and the word field has content
    if (wordSuggestions.length > 0 && formData.word.trim().length >= 2) {
      setShowSuggestions(true);
    }
  };
  // Handle word field blur with delay to allow suggestion clicks
  const handleWordFieldBlur = () => {
    // Use setTimeout to allow suggestion clicks to register before hiding
    setTimeout(() => {
      setShowSuggestions(false);
      // Trigger auto-fill if word field has content and other fields are empty
      const wordValue = formData.word.trim();
      if (
        wordValue &&
        !formData.translation &&
        !formData.pronunciation &&
        !formData.partOfSpeech &&
        !isAutoFilling
      ) {
        handleComprehensiveAutoFill(wordValue);
      }
    }, 200);
  };
  // Auto translate functionality - always translates from native language to English
  const handleAutoTranslate = (wordValue) => {
    // Clear any pending translation request
    if (translationTimeout) {
      clearTimeout(translationTimeout);
    }

    // Only translate if the word is a valid input and translation service is available
    if (wordValue?.trim() && translateService.isReady()) {
      // Set a small delay to avoid too many API calls while typing
      const timeoutId = setTimeout(async () => {
        try {
          setIsTranslating(true);

          // Check if text is valid for translation
          if (!translateService.isValidTextForTranslation(wordValue)) {
            console.log(`Word not suitable for translation: "${wordValue}"`);
            setIsTranslating(false);
            return;
          }
          // Get user's native language preference
          const userNativeLanguage =
            typeof window !== "undefined" && window.__userNativeLanguage
              ? window.__userNativeLanguage
              : "english";

          console.log(
            `Translating "${wordValue}" from ${formData.language} to ${userNativeLanguage}`
          );
          const result = await translateService.simpleTranslate(
            wordValue,
            formData.language
          );
          if (result?.translation) {
            setFormData((prev) => ({
              ...prev,
              translation: result.translation,
            }));

            // After translating, try to auto-generate pronunciation and examples
            handleGeneratePronunciation(false, wordValue);

            // Auto-generate examples after a short delay to ensure translation is set
            setTimeout(() => {
              handleAutoGenerateExamples(wordValue, result.translation);
            }, 300);
          }
        } catch (error) {
          console.error("Auto-translate failed:", error);
        } finally {
          setIsTranslating(false);
        }
      }, 600); // 600ms delay

      setTranslationTimeout(timeoutId);
    }
  };

  // Generate pronunciation with AI
  const handleGeneratePronunciation = async (
    manualTrigger = true,
    wordToUse = null
  ) => {
    const wordValue = wordToUse || formData.word;

    if (!wordValue || (isGeneratingPronunciation && manualTrigger)) return;

    if (!bedrockService.isReady()) {
      if (manualTrigger) {
        toast.error("AI service is not configured");
      }
      return;
    }

    try {
      if (manualTrigger) {
        setIsGeneratingPronunciation(true);
      }

      const pronunciation = await bedrockService.generatePronunciation(
        wordValue,
        formData.language
      );

      if (pronunciation) {
        setFormData((prev) => ({
          ...prev,
          pronunciation,
        }));

        if (manualTrigger) {
          toast.success("Pronunciation generated");
        }
      }
    } catch (error) {
      console.error("Error generating pronunciation:", error);
      if (manualTrigger) {
        toast.error("Failed to generate pronunciation");
      }
    } finally {
      setIsGeneratingPronunciation(false);
    }
  };

  // Generate examples with AI
  const handleGenerateExamples = async () => {
    if (!formData.word || !formData.translation || !bedrockService.isReady()) {
      toast.error(
        "Please ensure word and translation are filled, and AI service is configured"
      );
      return;
    }

    setIsGeneratingExamples(true);
    try {
      const examples = await bedrockService.generateExamples(
        formData.word,
        formData.translation,
        formData.language,
        "", // definition removed
        "intermediate"
      );

      if (examples && examples.length > 0) {
        // Use the first example by default
        const firstExample = examples[0];
        setFormData((prev) => ({
          ...prev,
          example: firstExample,
          translatedExample: "", // Will be auto-translated
        }));

        // Store all generated examples for manual selection
        setGeneratedExamples(examples);
        setShowExamples(true);

        // Auto-translate the example
        autoTranslateExample(firstExample, formData.language);

        toast.success("Examples generated successfully!");
      }
    } catch (error) {
      console.error("Error generating examples:", error);
      toast.error("Failed to generate examples");
    } finally {
      setIsGeneratingExamples(false);
    }
  };

  // Auto-generate examples silently (without showing modal)
  const handleAutoGenerateExamples = async (word, translation) => {
    if (!word || !translation || !bedrockService.isReady()) {
      return; // Silently fail for auto-generation
    }

    try {
      const examples = await bedrockService.generateExamples(
        word,
        translation,
        formData.language,
        "", // definition removed
        "intermediate"
      );

      if (examples && examples.length > 0) {
        // Use the first example automatically
        const firstExample = examples[0];
        setFormData((prev) => ({
          ...prev,
          example: firstExample,
          translatedExample: "", // Will be auto-translated
        }));

        // Store all generated examples for manual selection later
        setGeneratedExamples(examples);

        // Auto-translate the example
        autoTranslateExample(firstExample, formData.language);
      }
    } catch (error) {
      console.error("Error auto-generating examples:", error);
      // Silently fail for auto-generation, don't show error toast
    }
  };

  // Check if word is a verb and generate conjugations
  const handleCheckVerbConjugations = async () => {
    if (!formData.word || !bedrockService.isReady()) {
      return;
    }

    try {
      const conjugations = await bedrockService.generateVerbConjugations(
        formData.word,
        formData.language
      );

      if (conjugations && Object.keys(conjugations).length) {
        setVerbConjugations(conjugations);
      }
    } catch (error) {
      console.error("Error checking verb conjugations:", error);
      // Don't show error for this passive check
    }
  };
  // Generate word suggestions with AI
  const handleGenerateWordSuggestions = async (partialWord) => {
    // Clear any pending suggestion request
    if (suggestionTimeout) {
      clearTimeout(suggestionTimeout);
    } // Generate suggestions if the word is 2+ characters
    if (partialWord?.trim().length >= 2) {
      // Set a small delay to avoid too many API calls while typing
      const timeoutId = setTimeout(async () => {
        try {
          setIsGeneratingSuggestions(true);
          setShowSuggestions(true);

          let suggestions = [];

          // Try AI suggestions first if available
          if (bedrockService.isReady()) {
            try {
              suggestions = await bedrockService.generateWordSuggestions(
                partialWord.trim(),
                formData.language
              );
            } catch (error) {
              console.error("Error generating AI word suggestions:", error);
            }
          }

          // If no AI suggestions or AI not available, use fallback
          if (!suggestions || suggestions.length === 0) {
            suggestions = bedrockService.generateFallbackSuggestions(
              partialWord.trim(),
              formData.language
            );
          }

          if (suggestions && suggestions.length > 0) {
            setWordSuggestions(suggestions);

            // Auto-hide suggestions after 10 seconds if no interaction
            setTimeout(() => {
              setShowSuggestions(false);
            }, 10000);
          } else {
            setShowSuggestions(false);
          }
        } catch (error) {
          console.error("Error generating word suggestions:", error);
          setShowSuggestions(false);
        } finally {
          setIsGeneratingSuggestions(false);
        }
      }, 500); // 500ms delay for faster response

      setSuggestionTimeout(timeoutId);
    } else {
      // Hide suggestions if word is too short
      setShowSuggestions(false);
      setWordSuggestions([]);
    }  }; 
  
  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion) => {
    // Extract just the word part (before the parentheses) and convert to lowercase
    const wordPart = suggestion.split("(")[0].trim().toLowerCase();
    setFormData((prev) => ({ ...prev, word: wordPart }));
    setShowSuggestions(false);
    setWordSuggestions([]);

    // Clear any pending suggestion timeout
    if (suggestionTimeout) {
      clearTimeout(suggestionTimeout);
      setSuggestionTimeout(null);
    }

    // Use comprehensive auto-fill for selected suggestions to include verb conjugations
    if (!editingWord) {
      handleComprehensiveAutoFill(wordPart);
    }
  };

  // Use a selected example
  const useExample = (example) => {
    setFormData((prev) => ({ ...prev, example }));
    setShowExamples(false);
    autoTranslateExample(example, formData.language);
  };

  // Handle word audio pronunciation
  const handleWordAudio = async () => {
    if (!formData.word || isPlayingAudio) return;

    try {
      setIsPlayingAudio(true);
      await audioService.playAudio(formData.word, formData.language, {
        onStart: () => {
          setIsPlayingAudio(true);
        },
        onEnd: () => {
          setIsPlayingAudio(false);
        },
        onError: (error) => {
          console.error("Error playing word audio:", error);
          setIsPlayingAudio(false);
          toast.error("Failed to play pronunciation");
        },
      });
    } catch (error) {
      console.error("Error with word audio service:", error);
      setIsPlayingAudio(false);
      toast.error("Audio pronunciation unavailable");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.word.trim() || !formData.translation.trim()) {
      toast.error("Please fill in at least the word and translation fields");
      return;
    }
    try {
      // Order conjugations before saving
      let orderedConjugations = null;
      if (verbConjugations && Object.keys(verbConjugations).length > 0) {
        orderedConjugations = {};
        Object.entries(verbConjugations).forEach(([tense, conjugations]) => {
          orderedConjugations[tense] = orderConjugations(conjugations);
        });
      }

      const wordData = {
        ...formData,
        conjugations: orderedConjugations, // Include ordered verb conjugations in saved data
        createdAt: new Date(),
        lastReviewDate: null,
        nextReviewDate: new Date(),
        difficulty: 0,
        interval: 1,
        repetitions: 0,
        easeFactor: 2.5,
        isMatured: false,
        correctCount: 0,
        incorrectCount: 0,
      };

      console.log("Saving word data:", wordData);
      console.log("Ordered conjugations to save:", orderedConjugations);

      // If onSubmit callback is provided, use it
      if (onSubmit) {
        await onSubmit(wordData, editingWord);
        return;
      }
      // Otherwise handle submission directly
      if (userId) {
        // Create user object for Firebase utils (they expect user object with uid)
        const userObj = { uid: userId };

        if (editingWord) {
          await updateUserData(userObj, "vocabulary", editingWord.id, wordData);
          toast.success("Word updated successfully!");
        } else {
          await addUserData(userObj, "vocabulary", wordData);
          toast.success("Word added successfully!");
        }

        // Close modal
        onClose();
      } else {
        // If no userId, redirect to vocabulary page
        router.push("/vocabulary");
      }
    } catch (error) {
      console.error("Error saving word:", error);
      toast.error("Failed to save word. Please try again.");
    }
  };

  // Comprehensive auto-fill functionality - generates all fields in a single AI request
  const handleComprehensiveAutoFill = (wordValue) => {
    // Clear any pending auto-fill request
    if (autoFillTimeout) {
      clearTimeout(autoFillTimeout);
    }

    // Only auto-fill if the word is valid and AI service is available
    if (wordValue?.trim() && bedrockService.isReady()) {
      // Set a delay to avoid too many API calls while typing
      const timeoutId = setTimeout(async () => {
        try {
          setIsAutoFilling(true);

          // Get user's native language preference
          const userNativeLanguage =
            typeof window !== "undefined" && window.__userNativeLanguage
              ? window.__userNativeLanguage
              : "english";

          console.log(
            `Auto-filling comprehensive data for "${wordValue}" from ${formData.language} to ${userNativeLanguage}`
          );

          const comprehensiveData =
            await bedrockService.generateComprehensiveWordData(
              wordValue,
              formData.language,
              userNativeLanguage
            );
          if (comprehensiveData) {
            console.log("Comprehensive data received:", comprehensiveData);
            console.log("Part of speech:", comprehensiveData.partOfSpeech);
            console.log("Conjugations:", comprehensiveData.conjugations);
            // Update all form fields with the comprehensive data
            setFormData((prev) => ({
              ...prev,
              translation: comprehensiveData.translation || prev.translation,
              pronunciation:
                comprehensiveData.pronunciation || prev.pronunciation,
              example: comprehensiveData.example || prev.example,
              partOfSpeech: comprehensiveData.partOfSpeech || prev.partOfSpeech,
              translatedExample:
                comprehensiveData.translatedExample || prev.translatedExample,
            }));

            // Set verb conjugations if available
            if (comprehensiveData.conjugations) {
              console.log(
                "Setting verb conjugations:",
                comprehensiveData.conjugations
              );
              setVerbConjugations(comprehensiveData.conjugations);
            } else {
              console.log("No conjugations found in comprehensive data");
            }

            // Store additional examples for manual selection
            if (
              comprehensiveData.additionalExamples &&
              comprehensiveData.additionalExamples.length > 0
            ) {
              const allExamples = [
                comprehensiveData.example,
                ...comprehensiveData.additionalExamples,
              ].filter(Boolean);
              setGeneratedExamples(allExamples);
            }
          }
        } catch (error) {
          console.error("Comprehensive auto-fill failed:", error);
          // Fallback to old method if comprehensive fails
          handleAutoTranslate(wordValue);
        } finally {
          setIsAutoFilling(false);
        }
      }, 800); // 800ms delay to allow user to finish typing

      setAutoFillTimeout(timeoutId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingWord ? "Edit Word" : "Add New Word"}
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                {editingWord
                  ? "Update your vocabulary entry"
                  : "Add a new word to your vocabulary collection"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Main Word Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {" "}
            <div className="space-y-1">
              {" "}
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Word *
                {isGeneratingSuggestions && (
                  <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">
                    (Getting suggestions...)
                  </span>
                )}
              </label>{" "}
              <div className="relative">
                <input
                  type="text"
                  name="word"
                  value={formData.word}
                  onChange={handleInputChange}
                  onFocus={handleWordFieldFocus}
                  onBlur={handleWordFieldBlur}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all placeholder-gray-500 text-sm"
                  placeholder="Enter the word (AI suggestions will appear)"
                  required
                />
                {formData.word && (
                  <button
                    type="button"
                    onClick={handleWordAudio}
                    disabled={isPlayingAudio}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full transition-all ${
                      isPlayingAudio
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 scale-110"
                        : "text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    }`}
                    title="Play pronunciation"
                  >
                    {isPlayingAudio ? (
                      <svg
                        className="w-4 h-4 animate-pulse"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                      </svg>
                    )}
                  </button>
                )}
                {/* Word Suggestions Dropdown */}
                <AnimatePresence>
                  {showSuggestions && wordSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="suggestions-dropdown absolute top-full left-0 right-0 z-10 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                    >
                      <div className="p-2">
                        <div className="flex items-center gap-2 px-2 py-1 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700 mb-1">
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
                          AI Suggestions
                          {isGeneratingSuggestions && (
                            <div className="ml-auto">
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
                            </div>
                          )}
                        </div>
                        {wordSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleSelectSuggestion(suggestion)}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors duration-150 flex items-center justify-between group"
                          >
                            <span className="font-medium">{suggestion}</span>
                            <svg
                              className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>{" "}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                {" "}
                Translation *
                {isAutoFilling && (
                  <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                    (Auto-filling all fields...)
                  </span>
                )}
                {isTranslating && !isAutoFilling && (
                  <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">
                    (Auto-translating...)
                  </span>
                )}
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="translation"
                  value={formData.translation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all placeholder-gray-500 text-sm"
                  placeholder="Enter translation (auto-translates when typing word)"
                  required
                />
                {(isTranslating || isAutoFilling) && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div
                      className={`animate-spin rounded-full h-4 w-4 border-b-2 ${
                        isAutoFilling ? "border-green-500" : "border-blue-500"
                      }`}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pronunciation */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              {" "}
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Pronunciation
                {isAutoFilling && (
                  <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                    (Auto-filling...)
                  </span>
                )}
                {isGeneratingPronunciation && !isAutoFilling && (
                  <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">
                    (Auto-generating...)
                  </span>
                )}
              </label>
              <button
                type="button"
                onClick={() => handleGeneratePronunciation(true)}
                disabled={isGeneratingPronunciation || !formData.word}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-md transition-all duration-200 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
              >
                {isGeneratingPronunciation ? (
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
                        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 9v6l4-3-4-3z"
                      />
                    </svg>
                    Generate IPA
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                name="pronunciation"
                value={formData.pronunciation}
                onChange={handleInputChange}
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all placeholder-gray-500 text-sm"
                placeholder="Phonetic pronunciation (e.g., sah-loo) - auto-generates when typing word"
              />
              {(isGeneratingPronunciation || isAutoFilling) && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div
                    className={`animate-spin rounded-full h-4 w-4 border-b-2 ${
                      isAutoFilling ? "border-green-500" : "border-blue-500"
                    }`}
                  ></div>
                </div>
              )}{" "}
            </div>
          </div>

          {/* Verb Conjugation Display */}
          <div className="space-y-1">
            {verbConjugations && (
              <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <h4 className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-2 flex items-center gap-1.5">
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Verb Conjugations
                </h4>{" "}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(verbConjugations).map(
                    ([tense, conjugations]) => (
                      <div
                        key={tense}
                        className="bg-white dark:bg-gray-700 rounded-md p-2 border border-emerald-200 dark:border-emerald-700"
                      >
                        <h5 className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide mb-1">
                          {tense === "passe"
                            ? "Passé Composé"
                            : tense.charAt(0).toUpperCase() + tense.slice(1)}
                        </h5>{" "}
                        <div className="space-y-0.5">
                          {Object.entries(orderConjugations(conjugations)).map(
                            ([pronoun, form]) => {
                              // Handle French contractions (je + vowel = j')
                              let fullPhrase;
                              if (
                                formData.language === "fr" &&
                                pronoun.toLowerCase() === "je" &&
                                /^[aeiouéèàh]/.test(form)
                              ) {
                                fullPhrase = `J'${form}`;
                              } else {
                                fullPhrase = `${
                                  pronoun.charAt(0).toUpperCase() +
                                  pronoun.slice(1)
                                } ${form}`;
                              }

                              return (
                                <div
                                  key={pronoun}
                                  className="flex items-center text-xs"
                                >
                                  <button
                                    type="button"
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      try {
                                        await audioService.playAudio(
                                          fullPhrase,
                                          formData.language
                                        );
                                      } catch (error) {
                                        console.error(
                                          "Error playing conjugation audio:",
                                          error
                                        );
                                      }
                                    }}
                                    className="font-medium text-gray-800 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer underline-offset-2 hover:underline w-full text-left"
                                    title={`Click to pronounce ${fullPhrase}`}
                                  >
                                    {fullPhrase}
                                  </button>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Example */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Example Sentence
              </label>
              <button
                type="button"
                onClick={handleGenerateExamples}
                disabled={
                  isGeneratingExamples ||
                  !formData.word ||
                  !formData.translation
                }
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-md transition-all duration-200 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
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
                    AI Examples
                  </>
                )}
              </button>
            </div>
            <textarea
              name="example"
              rows="2"
              value={formData.example}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all resize-none placeholder-gray-500 text-sm"
              placeholder="Example sentence using this word (or generate with AI)"
            />
          </div>
          {/* Category, Part of Speech, and Language */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all text-sm"
              >
                <option value="">Select Category</option>
                <option value="vocabulary">Vocabulary</option>
                <option value="food">Driving</option>
                <option value="phrases">Phrases</option>
                <option value="grammar">Grammar</option>
                <option value="idioms">Idioms</option>
                <option value="slang">Slang</option>
                <option value="academic">Academic</option>
                <option value="business">Business</option>
                <option value="travel">Travel</option>
                <option value="food">Food</option>
                <option value="technology">Technology</option>
              </select>
            </div>

<div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Language
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm">
                {formData.language
                  ? formData.language.charAt(0).toUpperCase() +
                    formData.language.slice(1)
                  : "English"}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
            >
              {editingWord ? "Update Word" : "Add Word"}
            </button>
          </div>
        </form>

        {/* AI Generated Examples Modal */}
        {showExamples && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 rounded-2xl">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  AI Generated Examples
                </h3>
                <button
                  onClick={() => setShowExamples(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
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
                  onClick={() => setShowExamples(false)}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default WordModal;
