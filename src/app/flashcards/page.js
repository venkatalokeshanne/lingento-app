"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Flashcard from "@/components/Flashcard/Flashcard";
import AddButton from "@/components/AddButton";
import WordModal from "@/components/WordModal/WordModal";
import { useAuth } from "@/context/AuthContext";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import toast, { Toaster } from "react-hot-toast";
import {
  fetchVocabularyAsFlashcards,
  updateVocabularyMastered,
  updateVocabularySpacedRepetition,
  addUserData,
  updateUserData,
} from "@/utils/firebaseUtils";
import { spacedRepetitionService } from "@/services/spacedRepetitionService";
import "@/components/Flashcard/flashcard.css";
import SEOHead from "@/components/SEOHead";

export default function FlashcardsPage() {
  const { currentUser, logout } = useAuth();
  const {
    language,
    level,
    loading: preferencesLoading,
    error: preferencesError,
  } = useUserPreferences();
  const router = useRouter();

  // WordModal state
  const [showModal, setShowModal] = useState(false);
  const [editingWord, setEditingWord] = useState(null);  const [formData, setFormData] = useState({
    word: "",
    translation: "",
    pronunciation: "",
    definition: "",
    example: "",
    category: "vocabulary",
    language: language || "english",
  });

  // Handler for adding new flashcard
  const handleAddFlashcard = () => {
    setEditingWord(null);
    setFormData({
      word: "",
      translation: "",
      pronunciation: "",
      definition: "",
      example: "",
      category: "vocabulary",
      language: language || "english",
    });
    setShowModal(true);
  };

  // State management
  const [allFlashcards, setAllFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [studyMode, setStudyMode] = useState("review"); // 'review', 'new', 'all'
  const [studySession, setStudySession] = useState([]);
  const [sessionStats, setSessionStats] = useState(null);
  const [isProcessingRating, setIsProcessingRating] = useState(false); // Prevent double rating calls
  const [autoAdvanceTimeoutId, setAutoAdvanceTimeoutId] = useState(null); // Store timeout ID
  // Extract unique categories
  const categories = [
    "All",
    ...new Set(allFlashcards.map((card) => card.category)),
  ];  // Filter flashcards based on selected category and study mode
  const getFilteredFlashcards = () => {
    let filtered =
      selectedCategory === "All"
        ? allFlashcards
        : allFlashcards.filter((card) => card.category === selectedCategory);

    // Filter by user's language preference
    filtered = filtered.filter((card) => card.language === language);

    // Apply spaced repetition filtering
    if (studyMode === "review") {
      // For review mode: exclude mastered words and get only due cards
      filtered = filtered.filter((card) => !card.mastered);
      const dueCards = spacedRepetitionService.getDueCards(filtered);
      return dueCards;
    } else if (studyMode === "new") {
      // For new mode: exclude mastered words and get only new cards
      filtered = filtered.filter((card) => !card.mastered);
      return filtered.filter((card) => card.isNew !== false);
    }

    // For 'all' mode: include everything (including mastered words)
    return filtered;
  };
  const filteredFlashcards = getFilteredFlashcards();
  
  // Reset active index when filters change or when filtered cards change
  useEffect(() => {
    setActiveIndex(0);
  }, [selectedCategory, studyMode]);

  // Additional effect to handle case where filtered cards array changes due to ratings
  useEffect(() => {
    if (filteredFlashcards.length > 0 && activeIndex >= filteredFlashcards.length) {
      console.log("🔧 Adjusting activeIndex due to filtered cards change - was:", activeIndex, "setting to 0");
      setActiveIndex(0);
    }
  }, [filteredFlashcards.length, activeIndex]);

  // Update session stats when flashcards change
  useEffect(() => {
    if (allFlashcards.length > 0) {
      const stats = spacedRepetitionService.getStatistics(allFlashcards);
      setSessionStats(stats);

      // Initialize study session
      const session = spacedRepetitionService.getStudySession(
        allFlashcards,
        20,
        studyMode !== "new",
        studyMode !== "review"
      );
      setStudySession(session);
    }
  }, [allFlashcards, studyMode]); // Fetch flashcards from vocabulary when user is available
  useEffect(() => {
    if (currentUser) {
      fetchFlashcards();
    }
  }, [currentUser]);

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimeoutId) {
        clearTimeout(autoAdvanceTimeoutId);
      }
    };
  }, [autoAdvanceTimeoutId]); // Fetch vocabulary and convert to flashcards using utility function
  const fetchFlashcards = async () => {
    try {
      const flashcardsData = await fetchVocabularyAsFlashcards(
        currentUser,
        setAllFlashcards,
        setLoading,
        setError
      );
    } catch (error) {
      console.error("Error in fetchFlashcards:", error);
      setError(error.message);
    }
  };
  const handleMarkLearned = async (cardId, mastered) => {
    // Handler for marking cards as learned/not learned (using utility function)
    try {
      await updateVocabularyMastered(currentUser, cardId, mastered);

      // Update local state immediately (both mastered and mastered properties)
      setAllFlashcards((prev) =>
        prev.map((card) =>
          card.id === cardId ? { ...card, mastered, mastered: mastered } : card
        )
      );

      // Trigger animation if card was marked as learned
      if (mastered) {
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 1500); // Match animation duration
        
        // Auto-advance to next card when mastered (with a slight delay for animation)
        setTimeout(() => {
          console.log("🔄 Auto-advancing after marking as mastered...");
          handleNext();
        }, 800); // Small delay to allow animation to show
      }
    } catch (error) {
      console.error("Error updating vocabulary word:", error);
    }
  };// Handle spaced repetition quality rating
  const handleQualityRating = async (cardId, quality) => {
    console.log(
      "⭐ handleQualityRating called - cardId:",
      cardId,
      "quality:",
      quality,
      "isProcessingRating:",
      isProcessingRating
    );

    // Prevent multiple rapid calls
    if (isProcessingRating) {
      console.log("❌ Rating already being processed, ignoring...");
      return;
    }

    setIsProcessingRating(true);
    console.log("✅ Starting quality rating process...");

    try {
      const cardIndex = allFlashcards.findIndex((card) => card.id === cardId);
      if (cardIndex === -1) {
        console.log("❌ Card not found");
        setIsProcessingRating(false);
        return;
      }

      const currentCard = allFlashcards[cardIndex];
      const updatedCard = spacedRepetitionService.calculateNextReview(
        currentCard,
        quality
      );

      // Store current filtered cards count and current index before state update
      const currentFilteredLength = filteredFlashcards.length;
      const currentActiveIndex = activeIndex;
      console.log("📊 Before update - activeIndex:", currentActiveIndex, "filteredLength:", currentFilteredLength);

      // Update local state with spaced repetition data
      setAllFlashcards((prev) =>
        prev.map((card) => (card.id === cardId ? updatedCard : card))
      ); // Save complete spaced repetition data to Firebase
      await updateVocabularySpacedRepetition(currentUser, cardId, updatedCard);
      console.log("💾 Firebase updated successfully");

      // Clear any existing timeout to prevent multiple auto-advances
      if (autoAdvanceTimeoutId) {
        console.log("🔄 Clearing existing auto-advance timeout");
        clearTimeout(autoAdvanceTimeoutId);
      }

      // Auto-advance to next card with a longer delay to prevent double triggers
      console.log("⏰ Setting timeout to advance to next card...");
      const timeoutId = setTimeout(() => {
        console.log("⏰ Timeout triggered, advancing cards...");
        
        // Get fresh filtered cards after the state update has propagated
        const newFilteredCards = getFilteredFlashcards();
        console.log("📊 After update - newFilteredLength:", newFilteredCards.length);
        
        // Handle advancement more carefully
        if (newFilteredCards.length > 0) {
          // If the filtered array length changed, the current card might have been removed
          if (newFilteredCards.length !== currentFilteredLength) {
            console.log("🔄 Filtered cards length changed, adjusting index...");
            // Stay at the same index (which now shows the next card) or wrap to 0
            const newIndex = currentActiveIndex >= newFilteredCards.length ? 0 : currentActiveIndex;
            console.log("🔄 Setting adjusted activeIndex:", newIndex);
            setActiveIndex(newIndex);
          } else {
            // Normal advancement to next card
            const newIndex = (currentActiveIndex + 1) % newFilteredCards.length;
            console.log("🔄 Normal advancement to activeIndex:", newIndex);
            setActiveIndex(newIndex);
          }
        }
        
        setIsProcessingRating(false); // Reset after advancing
        setAutoAdvanceTimeoutId(null); // Clear timeout ID
        console.log("✅ Quality rating process complete");
      }, 800);

      setAutoAdvanceTimeoutId(timeoutId);
    } catch (error) {
      console.error("Error updating spaced repetition data:", error);
      setIsProcessingRating(false); // Reset on error
      setAutoAdvanceTimeoutId(null); // Clear timeout ID on error
    }
  };
  // Handle example update from Flashcard component
  const handleExampleUpdate = async (cardId, example, translatedExample) => {
    try {
      // Update the vocabulary word with the new example and translated example
      await updateUserData(currentUser, "vocabulary", cardId, {
        example: example,
        translatedExample: translatedExample,
      });

      // Update local state immediately to reflect the change
      setAllFlashcards((prev) =>
        prev.map((card) =>
          card.id === cardId
            ? {
                ...card,
                example: example,
                translatedExample: translatedExample,
              }
            : card
        )
      );
    } catch (error) {
      console.error("Error updating vocabulary example:", error);
    }
  };

  // Handle form submission for WordModal
  const handleSubmit = async (wordData, editingWordToUpdate = null) => {
    if (!wordData.word || !wordData.translation) {
      toast.error("Word and translation are required");
      return;
    }

    try {
      // Prepare the data to save from the WordModal component
      const saveData = { ...wordData };
      const currentEditingWord = editingWordToUpdate || editingWord;

      // If we have verb conjugations, add them
      if (
        wordData.verbConjugations &&
        Object.keys(wordData.verbConjugations).length > 0
      ) {
        saveData.conjugations = wordData.verbConjugations;
        // Mark as verb type for easier identification
        if (!saveData.category || saveData.category === "vocabulary") {
          saveData.category = "verbs";
        }
      }

      if (currentEditingWord) {
        // Update existing word
        await updateUserData(
          currentUser,
          "vocabulary",
          currentEditingWord.id,
          saveData
        );
        toast.success("Word updated successfully!");
      } else {
        // Add new word
        await addUserData(currentUser, "vocabulary", saveData);
        toast.success("Word added successfully!");
      }

      // Close modal and refresh words
      setShowModal(false);
      setEditingWord(null);
      // Refresh flashcards to include the new word
      fetchFlashcards();
    } catch (error) {
      console.error("Error saving word:", error);
      toast.error("Error saving word. Please try again.");
    }
  };
  const handleNext = () => {
    console.log(
      "🔄 handleNext called - activeIndex:",
      activeIndex,
      "filteredFlashcards.length:",
      filteredFlashcards.length
    );
    if (filteredFlashcards.length > 0) {
      const newIndex = (activeIndex + 1) % filteredFlashcards.length;
      console.log("🔄 Setting new activeIndex:", newIndex);
      setActiveIndex(newIndex);
    }
  };

  const handlePrevious = () => {
    if (filteredFlashcards.length > 0) {
      setActiveIndex(
        (prev) =>
          (prev - 1 + filteredFlashcards.length) % filteredFlashcards.length
      );
    }
  };
  // Show loading if user is not authenticated yet
  if (!currentUser) {
    return (
      <div className="h-[90vh] bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }  return (
    <>
      <SEOHead        title="Language Flashcards | Interactive Vocabulary Learning with Spaced Repetition"
        description="Master vocabulary with our interactive flashcards featuring spaced repetition algorithm. Practice pronunciation, track progress, and learn efficiently with AI-powered language learning tools."
        keywords={[
          'language flashcards',
          'vocabulary flashcards',          'spaced repetition flashcards',
          'interactive language learning',
          'language pronunciation practice',
          'vocabulary builder',
          'language study cards'
        ]}
        canonical="https://lingentoo.com/flashcards"
        ogImage="https://lingentoo.com/og-flashcards.jpg"
        twitterImage="https://lingentoo.com/twitter-flashcards.jpg"
      />
      <div className="h-[91vh] bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-14 px-4 relative flashcard-section">
        <div className="max-w-screen-md mx-auto">
        {/* Header with user info and logout */}
        <div className="flex items-center justify-center mb-8">
          {/* <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium text-gray-900 dark:text-gray-200">
                {currentUser?.displayName || currentUser?.email || 'User'}
              </span>
            </div>
            
            <button 
              onClick={handleLogout}
              className="text-sm px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              Log out
            </button>
          </div> */}{" "}
        </div>
        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading flashcards...
            </p>
          </div>
        )}
        {/* Error state */}
        {error && !loading && (
          <div className="text-center py-16">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-red-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              Unable to load flashcards
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing sample data instead
            </p>
          </div>
        )}
        {/* Content - only show when not loading */}
        {!loading && (
          <>
            {/* Stylish Filter Modal/Popup */}
            <AnimatePresence>
              {isFilterOpen && (
                <>
                  {/* Backdrop overlay */}
                  <motion.div
                    className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsFilterOpen(false)}
                  />                  {/* Filter Modal */}
                  <motion.div
                    className="fixed bottom-40 right-6 z-50 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
                    initial={{ y: 50, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 50, opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  >
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Filter Cards
                      </h3>
                      <button
                        onClick={() => setIsFilterOpen(false)}
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L13.732 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="p-4">
                      {/* Study Mode Selection */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                          Study Mode
                        </p>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {[
                            {
                              value: "review",
                              label: "Review",
                              desc: "Due cards",
                            },
                            { value: "new", label: "New", desc: "Learn new" },
                            { value: "all", label: "All", desc: "Everything" },
                          ].map((mode) => (
                            <button
                              key={mode.value}
                              onClick={() => setStudyMode(mode.value)}
                              className={`px-2 py-2 text-xs font-medium rounded-lg transition ${
                                studyMode === mode.value
                                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-2 border-purple-500"
                                  : "bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                              }`}
                            >
                              <div className="font-bold">{mode.label}</div>
                              <div className="text-xs opacity-75">
                                {mode.desc}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Category Selection */}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        Select category
                      </p>

                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((category, index) => (
                          <motion.button
                            key={category}
                            onClick={() => {
                              setSelectedCategory(category);
                              setIsFilterOpen(false);
                            }}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition ${
                              selectedCategory === category
                                ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-2 border-indigo-500"
                                : "bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                            }`}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.03 * index }}
                          >
                            {category}
                          </motion.button>
                        ))}
                      </div>

                      {/* Stats Row */}
                      <div className="mt-4 bg-gray-50 dark:bg-gray-700/30 px-3 py-2 rounded-lg space-y-2">
                        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                          <span>Total: {allFlashcards.length}</span>
                          <span>
                            Learned:{" "}
                            {
                              allFlashcards.filter((card) => card.mastered)
                                .length
                            }
                          </span>
                          <span>Current: {filteredFlashcards.length}</span>
                        </div>
                        {sessionStats && (
                          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                            <span>Due: {sessionStats.dueToday}</span>
                            <span>New: {sessionStats.new}</span>
                            <span>Review: {sessionStats.review}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>{" "}
            {/* We removed the floating progress bar since we integrated it into the button */}{" "}            {/* Circular Progress Filter Button */}
            <div className="fixed bottom-24 md:right-8.5 z-50 right-6">
              <motion.button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-lg flex items-center justify-center overflow-hidden"
                style={{
                  animation: isPulsing
                    ? "pulsateProgress 1.5s ease-out"
                    : "none",
                }}
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.6)",
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 100, opacity: 0 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  boxShadow:
                    selectedCategory !== "All"
                      ? [
                          "0 4px 12px rgba(79, 70, 229, 0.5)",
                          "0 8px 20px rgba(79, 70, 229, 0.7)",
                          "0 4px 12px rgba(79, 70, 229, 0.5)",
                        ]
                      : "0 4px 12px rgba(79, 70, 229, 0.5)",
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  boxShadow: {
                    repeat: selectedCategory !== "All" ? Infinity : 0,
                    duration: 2,
                  },
                }}
                key={`button-${
                  allFlashcards.filter((card) => card.mastered).length
                }`}
              >
                {/* Circular progress indicator */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="28"
                    cy="28"
                    r="22"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="4"
                    fill="none"
                  />
                  <motion.circle
                    cx="28"
                    cy="28"
                    r="22"
                    stroke="rgba(255,255,255,0.9)"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={139}
                    initial={{ strokeDashoffset: 139 }}
                    animate={{
                      strokeDashoffset:
                        allFlashcards.length > 0
                          ? 139 *
                            (1 -
                              allFlashcards.filter((card) => card.mastered)
                                .length /
                                allFlashcards.length)
                          : 139,
                    }}
                    transition={{ duration: 0.8, type: "spring" }}
                    key={`circle-progress-${
                      allFlashcards.filter((card) => card.mastered).length
                    }`}
                  />
                </svg>
                {/* Percentage text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="text-xs font-bold animate-fadeIn"
                    key={`progress-${
                      allFlashcards.filter((card) => card.mastered).length
                    }`}
                  >
                    {allFlashcards.length > 0
                      ? Math.round(
                          (allFlashcards.filter((card) => card.mastered)
                            .length /
                            allFlashcards.length) *
                            100
                        )
                      : 0}
                    %
                  </div>
                </div>
                {/* Hover tooltip removed as requested */}
                {selectedCategory !== "All" && (
                  <motion.span
                    className="absolute -top-1 -right-1 flex h-3 w-3 z-20"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                  </motion.span>
                )}{" "}
              </motion.button>
            </div>{" "}
            {/* Filter indicator pill */}
            <AnimatePresence>              {selectedCategory !== "All" && (
                <motion.div
                  className="fixed bottom-[10.5rem] right-6 z-40 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 text-xs font-medium px-3 py-1 rounded-full shadow-md border border-indigo-100 dark:border-indigo-800/30"
                  initial={{ y: 20, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 10, opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", damping: 20 }}
                >
                  {selectedCategory}
                </motion.div>
              )}
            </AnimatePresence>
            {filteredFlashcards.length === 0 ? (
              <div className="text-center py-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mt-4">
                  No flashcards match your filters
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Try changing your filter settings or category selection
                </p>
              </div>
            ) : filteredFlashcards[activeIndex] ? (
              <>
                {" "}
                {/* Progress indicator removed and replaced with floating one above filter button */}
                {/* Current flashcard with animation */}
                <motion.div
                  key={filteredFlashcards[activeIndex].id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                >
                  {" "}
                  <Flashcard
                    id={filteredFlashcards[activeIndex].id}
                    frontText={filteredFlashcards[activeIndex].frontText}
                    backText={filteredFlashcards[activeIndex].backText}
                    audioSrc={filteredFlashcards[activeIndex].audioSrc}
                    imageUrl={filteredFlashcards[activeIndex].imageUrl}
                    category={filteredFlashcards[activeIndex].category}
                    mastered={filteredFlashcards[activeIndex].mastered}
                    onMasterToggle={handleMarkLearned}
                    onQualityRating={handleQualityRating} // User language preference
                    language={language || "english"}
                    // Additional vocabulary data for examples
                    example={filteredFlashcards[activeIndex].example}
                    translatedExample={
                      filteredFlashcards[activeIndex].translatedExample
                    }
                    originalWord={filteredFlashcards[activeIndex].originalWord}
                    translation={filteredFlashcards[activeIndex].translation}
                    pronunciation={
                      filteredFlashcards[activeIndex].pronunciation
                    }
                    // Spaced repetition props
                    easinessFactor={
                      filteredFlashcards[activeIndex].easinessFactor
                    }
                    repetitionNumber={
                      filteredFlashcards[activeIndex].repetitionNumber
                    }
                    interval={filteredFlashcards[activeIndex].interval}
                    nextReviewDate={
                      filteredFlashcards[activeIndex].nextReviewDate
                    }
                    isNew={filteredFlashcards[activeIndex].isNew}
                    showQualityRating={
                      studyMode === "review" || studyMode === "all"
                    }
                    // Example update handler
                    onExampleUpdate={handleExampleUpdate}
                  />
                </motion.div>                {/* Modern Navigation buttons with Learned button in the middle - positioned at bottom */}
                <div className="fixed bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex justify-center items-center gap-3 sm:gap-4 z-20 p-2 flashcard-controls">
                  {/* Previous button */}{" "}
                  <motion.button
                    onClick={handlePrevious}
                    className="relative group w-12 h-12 sm:w-12 sm:h-12 flex items-center justify-center"
                    disabled={filteredFlashcards.length <= 1}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    onTapStart={() => {
                      // Create ripple effect
                      const ripple = document.createElement("div");
                      ripple.style.position = "absolute";
                      ripple.style.borderRadius = "50%";
                      ripple.style.transform = "scale(0)";
                      ripple.style.background = "rgba(99, 102, 241, 0.2)";
                      ripple.style.width = "100px";
                      ripple.style.height = "100px";
                      ripple.style.left = "-25px";
                      ripple.style.top = "-25px";
                      ripple.style.pointerEvents = "none";
                      ripple.style.zIndex = "0";
                      document
                        .querySelector(".prev-btn-container")
                        ?.appendChild(ripple);

                      // Animate and remove
                      ripple.animate(
                        [
                          { transform: "scale(0)", opacity: 1 },
                          { transform: "scale(4)", opacity: 0 },
                        ],
                        { duration: 600 }
                      );

                      setTimeout(() => ripple?.remove(), 600);
                    }}
                  >
                    {/* Button background with gradient border */}
                    <span className="prev-btn-container absolute inset-0 rounded-full bg-gradient-to-r from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 shadow-lg transform group-hover:-translate-y-1 group-hover:shadow-xl transition-all duration-200 overflow-hidden"></span>

                    {/* Icon container */}
                    <span className="relative z-10 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-indigo-600 dark:text-indigo-400 transform transition-transform duration-200 group-hover:-translate-x-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </span>
                  </motion.button>{" "}
                  {/* Learned button in the middle */}
                  <motion.button
                    onClick={() =>
                      filteredFlashcards[activeIndex] &&
                      handleMarkLearned(
                        filteredFlashcards[activeIndex].id,
                        !filteredFlashcards[activeIndex].mastered
                      )
                    }
                    className="relative group w-14 h-14 sm:w-14 sm:h-14 flex items-center justify-center z-10"
                    disabled={!filteredFlashcards[activeIndex]}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    <span
                      className={`absolute inset-0 rounded-full shadow-lg transform transition-all duration-200 ${
                        filteredFlashcards[activeIndex]?.mastered
                          ? "bg-gradient-to-r from-green-500 to-green-400"
                          : "bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-700"
                      }`}
                    ></span>

                    <span className="relative z-10 flex items-center justify-center">
                      {filteredFlashcards[activeIndex]?.mastered ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-7 w-7 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-7 w-7 text-gray-500 dark:text-gray-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                    </span>
                  </motion.button>{" "}
                  {/* Next button */}
                  <motion.button
                    onClick={handleNext}
                    className="relative group w-12 h-12 sm:w-12 sm:h-12 flex items-center justify-center"
                    disabled={filteredFlashcards.length <= 1}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    onTapStart={() => {
                      // Create ripple effect
                      const ripple = document.createElement("div");
                      ripple.style.position = "absolute";
                      ripple.style.borderRadius = "50%";
                      ripple.style.transform = "scale(0)";
                      ripple.style.background = "rgba(255, 255, 255, 0.3)";
                      ripple.style.width = "100px";
                      ripple.style.height = "100px";
                      ripple.style.left = "-25px";
                      ripple.style.top = "-25px";
                      ripple.style.pointerEvents = "none";
                      ripple.style.zIndex = "0";
                      document
                        .querySelector(".next-btn-container")
                        ?.appendChild(ripple);

                      // Animate and remove
                      ripple.animate(
                        [
                          { transform: "scale(0)", opacity: 1 },
                          { transform: "scale(4)", opacity: 0 },
                        ],
                        { duration: 600 }
                      );

                      setTimeout(() => ripple?.remove(), 600);
                    }}
                  >
                    {/* Button background with gradient */}
                    <span className="next-btn-container absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-lg transform group-hover:-translate-y-1 group-hover:shadow-xl transition-all duration-200 overflow-hidden"></span>
                    {/* Icon container */}
                    <span className="relative z-10 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white transform transition-transform duration-200 group-hover:translate-x-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>{" "}
                  </motion.button>{" "}
                </div>
              </>
            ) : (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4 mx-auto"></div>
                <p className="text-gray-600 dark:text-gray-400">
                  Loading flashcards...
                </p>{" "}
              </div>
            )}
          </>        )}{" "}        {/* Add Button for creating new flashcards */}        <AddButton
          onClick={handleAddFlashcard}
          title="Add new flashcard"
          position="bottom-right"
          show={!loading}
          className="add-button"
        />
        {/* Add/Edit Word Modal */}
        <AnimatePresence>
          {showModal && (
            <WordModal
              isOpen={showModal}
              onClose={() => {
                setShowModal(false);
                setEditingWord(null);
              }}
              onSubmit={handleSubmit}
              editingWord={editingWord}
              initialWord={formData?.word || ""}
              language={formData?.language || language}
              userId={currentUser?.uid || null}
                    />
          )}
        </AnimatePresence>
        {/* Toast Notifications */}
        <Toaster position="top-right" />
      </div>
    </div>
    </>
  );
}
