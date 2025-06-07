"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import { useTutorial } from "@/context/TutorialContext";
import { AnimatePresence, motion } from "framer-motion";
import {
  fetchWords,
  addUserData,
  updateUserData,
  deleteUserData,
} from "@/utils/firebaseUtils";
import { audioService } from "@/services/audioService";
import { translateService } from "@/services/translateService";
import { bedrockService } from "@/services/bedrockService";
import TranslationUsageMonitor from "@/components/TranslationUsageMonitor";
import toast, { Toaster } from "react-hot-toast";
import WordModal from "@/components/WordModal/WordModal";
import AddButton from "@/components/AddButton";

// Helper function to convert part of speech to abbreviations
const getPartOfSpeechAbbreviation = (partOfSpeech) => {
  const abbreviations = {
    noun: 'n',
    verb: 'v', 
    adjective: 'adj',
    adverb: 'adv',
    pronoun: 'pron',
    preposition: 'prep',
    conjunction: 'conj',
    interjection: 'interj',
    article: 'art',
    determiner: 'det'
  };
  return abbreviations[partOfSpeech] || partOfSpeech;
};

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

// Enhanced WordCard Component with modern design
function WordCard({ word, onEdit, onDelete, onShowConjugations }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);

  // Handle keyboard navigation and auto-play audio on focus
  const handleKeyDown = (e) => {
    if (e.key === "Tab" || e.key === "Enter" || e.key === " ") {
      // Play audio when card receives focus via tab or is activated
      handleAudioPlay(e);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      vocabulary:
        "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
      phrases:
        "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
      grammar:
        "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      idioms:
        "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z",
      business:
        "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      travel: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945",
      food: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01",
      technology:
        "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    };
    return icons[category] || icons.vocabulary;
  };

  const handleAudioPlay = async (e) => {
    e.stopPropagation();

    if (isPlaying) {
      audioService.stop();
      setIsPlaying(false);
      return;
    }

    setAudioError(false);

    // Check if user interaction is needed (mainly for mobile)
    if (audioService.requiresUserInteraction()) {
      toast.error("Tap anywhere on screen to enable audio on mobile", {
        duration: 3000,
        icon: "🔊",
      });
      setAudioError(true);
      return;
    }

    try {
      await audioService.playAudio(word.word, word.language, {
        onStart: () => {
          setIsPlaying(true);
        },
        onEnd: () => {
          setIsPlaying(false);
        },
        onError: (error) => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
          setAudioError(true);

          // Show user-friendly error for mobile audio issues
          if (error.code === "USER_INTERACTION_REQUIRED") {
            toast.error("Tap anywhere on screen to enable audio on mobile", {
              duration: 3000,
              icon: "🔊",
            });
          } else {
            toast.error("Couldn't play audio. Try again later.", {
              duration: 3000,
            });
          }
        },
      });
    } catch (error) {
      console.error("Error with audio service:", error);
      setIsPlaying(false);
      setAudioError(true);

      toast.error("Audio playback failed. Please try again.", {
        duration: 3000,
      });
    }
  };
  const handleWordClick = () => {
    console.log("Word clicked:", word.word);
    console.log("Word data:", word);
    console.log("Conjugations:", word.conjugations);
    console.log(
      "Conjugations keys:",
      word.conjugations ? Object.keys(word.conjugations) : "null"
    );

    // Check if the word is a verb and has conjugations
    if (word.conjugations && Object.keys(word.conjugations).length > 0) {
      console.log("Opening conjugation modal for:", word.word);
      onShowConjugations(word);
    } else {
      console.log("No conjugations found for:", word.word);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onFocus={handleAudioPlay}
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 overflow-hidden flex flex-col h-full transform hover:-translate-y-1 cursor-pointer"
    >
      {/* Card Header */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Header with word, audio, and action buttons */}
        <div className="flex items-start justify-between gap-2 mb-3">
          {/* Left side: Word, Pronunciation and Audio */}
          <div className="flex-1 border-l-3 border-blue-500 pl-3">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className={`font-bold text-xl text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${
                  word.conjugations && Object.keys(word.conjugations).length > 0
                    ? "cursor-pointer hover:underline"
                    : ""
                }`}
                onClick={handleWordClick}
                title={
                  word.conjugations && Object.keys(word.conjugations).length > 0
                    ? "Click to view conjugations"
                    : ""                }
              >
                {word.word}
                {word.partOfSpeech && (
                  <span className="ml-2 text-sm font-normal text-purple-600 dark:text-purple-400">
                    ({getPartOfSpeechAbbreviation(word.partOfSpeech)})
                  </span>
                )}
              </h3>
              <button
                onClick={handleAudioPlay}
                className={`p-1.5 rounded-full transition-all ${
                  isPlaying
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 scale-110"
                    : "text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                }`}
                title="Play pronunciation"
              >
                {isPlaying ? (
                  <motion.svg
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </motion.svg>
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
            </div>
            {/* Pronunciation display */}
            {word.pronunciation && (
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium italic bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md border border-blue-200 dark:border-blue-800 mb-2">
                /{word.pronunciation}/
              </div>
            )}
          </div>

          {/* Right side: Action buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(word)}
              className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
              title="Edit"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={() => onDelete(word.id)}
              className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Delete"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>{" "}
        {/* Translation Section */}
        <div className="mb-3">
          <p className="text-gray-700 dark:text-gray-200 text-base leading-relaxed font-medium bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border-l-3 border-emerald-500">
            {word.translation}
          </p>
        </div>
        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Example */}
          {word.example && (
            <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              "{word.example}"
            </p>
          )}
        </div>
      </div>

      {/* Card Footer - Tags positioned at bottom */}
      <div className="px-4 pb-4 mt-auto">
        {" "}        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium">
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
                d={getCategoryIcon(word.category)}
              />
            </svg>
            {word.category}          </span>
          {/* Show verb indicator if has conjugations */}
          {word.conjugations && Object.keys(word.conjugations).length > 0 && (
            <span
              className="inline-flex items-center px-2.5 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs rounded-full cursor-pointer hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors font-medium"
              onClick={handleWordClick}
              title="Click to view conjugations"
            >
              Verb ✏️
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Conjugation Modal Component
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
            {" "}
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-full font-medium">
                {word.category}
              </span>
              {word.pronunciation && (
                <span className="text-gray-500 dark:text-gray-400 italic">
                  /{word.pronunciation}/
                </span>
              )}            </div>
            {word.example && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Example:
                </p>
                <p className="text-gray-600 dark:text-gray-400 italic">
                  "{word.example}"
                </p>
              </div>
            )}
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
                      </h4>{" "}                      <div className="space-y-2">
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
                            >                              <button
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

          {/* AI Generated Examples */}
          {word.generatedExamples && word.generatedExamples.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-purple-700 dark:text-purple-300 mb-3 flex items-center gap-2">
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
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                AI Generated Examples
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {word.generatedExamples.map((example, index) => (
                  <div
                    key={index}
                    className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-3"
                  >
                    <p className="text-gray-700 dark:text-gray-300 italic">
                      "{example}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function VocabularyManager() {
  const { currentUser } = useAuth();
  const { language } = useUserPreferences();  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("cards"); // 'cards' or 'table'
  const [sortBy, setSortBy] = useState("dateAdded"); // 'dateAdded', 'alphabetical'
  const [filters, setFilters] = useState({
    category: "all",
    partOfSpeech: "all",
  });
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingWord, setEditingWord] = useState(null);

  // Conjugation modal state
  const [showConjugationModal, setShowConjugationModal] = useState(false);
  const [selectedWordForConjugation, setSelectedWordForConjugation] =
    useState(null);
  const [formData, setFormData] = useState({
    word: "",
    translation: "",
    pronunciation: "",
    definition: "",
    example: "",
    category: "vocabulary",
    language: language || "english",
  });

  // State for AI generation functionality
  const [isGeneratingPronunciation, setIsGeneratingPronunciation] =
    useState(false);  // Extract unique filter values
  const categories = [
    "all",
    ...new Set(words.map((word) => word.category)),
  ].filter(Boolean);

  // Extract unique parts of speech from words
  const partsOfSpeech = [
    "all",
    ...new Set(words.map((word) => word.partOfSpeech)),
  ].filter(Boolean);
  // Debug logging for categories and parts of speech
  console.log("Debug - Words:", words.length);
  console.log("Debug - Categories extracted:", categories);
  console.log("Debug - Parts of speech extracted:", partsOfSpeech);
  console.log(
    "Debug - Words with categories:",
    words.map((word) => ({ word: word.word, category: word.category }))
  );
  console.log(
    "Debug - Words with parts of speech:",
    words.map((word) => ({ word: word.word, partOfSpeech: word.partOfSpeech }))
  );// Fetch words on component mount
  useEffect(() => {
    if (currentUser) {
      fetchWords(currentUser, setWords, setLoading);
    }
  }, [currentUser]);

  // Update formData language when user preferences change
  useEffect(() => {
    if (language) {
      setFormData((prev) => ({
        ...prev,
        language: language,
      }));
    }
  }, [language]);

  // Handle form submission
  const { markWordAdded } = useTutorial();

  const handleSubmit = async (wordData, editingWordToUpdate = null) => {
    if (!wordData.word || !wordData.translation) {
      toast.error("Word and translation are required");
      return;
    }

    try {
      // Prepare the data to save from the new WordModal component
      const saveData = { ...wordData };
      const currentEditingWord = editingWordToUpdate || editingWord;      // If we have verb conjugations, add them with proper ordering
      if (
        wordData.verbConjugations &&
        Object.keys(wordData.verbConjugations).length > 0
      ) {
        // Order the conjugations properly before saving
        const orderedConjugations = {};
        Object.entries(wordData.verbConjugations).forEach(([tense, conjugations]) => {
          orderedConjugations[tense] = orderConjugations(conjugations);
        });
        saveData.conjugations = orderedConjugations;
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

        // Trigger tutorial flow when a new word is added
        console.log("Word added successfully, triggering tutorial");
        markWordAdded();
      }

      // Close modal and refresh words
      setShowModal(false);
      setEditingWord(null);
      fetchWords(currentUser, setWords, setLoading);
    } catch (error) {
      console.error("Error saving word:", error);
      toast.error("Error saving word. Please try again.");
    }
  };
  // Handle word deletion
  const handleDeleteWord = async (wordId) => {
    if (!confirm("Are you sure you want to delete this word?")) return;

    try {
      await deleteUserData(currentUser, "vocabulary", wordId);
      fetchWords(currentUser, setWords, setLoading);
    } catch (error) {
      console.error("Error deleting word:", error);
      alert("Error deleting word. Please try again.");
    }
  };
  // Handle word edit
  const handleEditWord = (word) => {
    setEditingWord(word);
    setFormData({
      word: word.word || "",
      translation: word.translation || "",
      pronunciation: word.pronunciation || "",
      definition: word.definition || "",
      example: word.example || "",
      category: word.category || "vocabulary",
      language: word.language || language || "english",
    });
    setShowModal(true);
  };
  // Handle add new word
  const handleAddWord = () => {
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

  // Handle show conjugations
  const handleShowConjugations = (word) => {
    setSelectedWordForConjugation(word);
    setShowConjugationModal(true);  }; // Filter and sort words
  const filteredAndSortedWords = words
    .filter((word) => {
      const matchesSearch =
        !searchTerm ||
        word.word?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.translation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.definition?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        filters.category === "all" || word.category === filters.category;
      const matchesPartOfSpeech =
        filters.partOfSpeech === "all" || word.partOfSpeech === filters.partOfSpeech;
      const matchesLanguage = word.language === language; // Filter by user's language preference

      return matchesSearch && matchesCategory && matchesPartOfSpeech && matchesLanguage;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "alphabetical":
          aValue = a.word?.toLowerCase() || "";
          bValue = b.word?.toLowerCase() || "";
          break;
        case "dateAdded":
        default:
          aValue = a.createdAt || 0;
          bValue = b.createdAt || 0;
          break;
      }

      // Always sort in descending order (newest first for dateAdded, Z-A for alphabetical)
      return aValue < bValue ? 1 : -1;
    });

  // Handle audio playback using centralized audio service
  const speakWord = async (word) => {
    try {
      await audioService.playAudio(word.word, word.language, {
        onStart: () => {
          // Optional: could add visual feedback here if needed
          console.log(`Playing pronunciation for: ${word.word}`);
        },
        onEnd: () => {
          // Optional: could add visual feedback here if needed
          console.log(`Finished playing: ${word.word}`);
        },
        onError: (error) => {
          console.error("Error playing audio:", error);
          // Fallback to browser's speech synthesis as backup
          if ("speechSynthesis" in window) {
            speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(word.word);
            const voices = speechSynthesis.getVoices();
            const languageVoice = voices.find((voice) =>
              voice.lang
                .toLowerCase()
                .includes(word.language?.toLowerCase() || "en")
            );
            if (languageVoice) {
              utterance.voice = languageVoice;
            }
            utterance.rate = 0.8;
            utterance.pitch = 1;
            speechSynthesis.speak(utterance);
          }
        },
      });
    } catch (error) {
      console.error("Error with audio service:", error);
    }
  };
  const getStats = () => {
    // Filter words by user's language preference for stats
    const filteredWords = words.filter((word) => word.language === language);
    const total = filteredWords.length;
    const byLanguage = words.reduce((acc, word) => {
      acc[word.language] = (acc[word.language] || 0) + 1;
      return acc;
    }, {});

    // Count mastered words (filtered by language)
    const mastered = filteredWords.filter(
      (word) => word.mastered === true
    ).length;
    return { total, byLanguage, mastered };
  };

  const stats = getStats();

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please sign in to access your vocabulary
          </h2>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
      {/* Ultra-minimal spacer for fixed navbar */}
      <div className="h-8"></div>
      {/* Compact Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 pb-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
          <div className="text-center lg:text-left">
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 bg-clip-text text-transparent mb-1">
              Vocabulary Manager
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filteredAndSortedWords.length} of {words.length} words in your
              collection
            </p>
          </div>
          {/* Compact Stats Cards */}
          <div className="flex flex-row justify-center lg:justify-end gap-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg px-3 py-2 shadow border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {stats.total}
                </div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Total Words
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg px-3 py-2 shadow border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform">
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {stats.mastered || 0}
                </div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Mastered
                </div>
              </div>
            </div>
          </div>{" "}
        </div>{" "}
        {/* Balanced Compact Search and Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          {/* Search Bar */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all placeholder-gray-400"
              placeholder="Search your vocabulary..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg
                  className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors"
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
            )}
          </div>{" "}
          {/* Filters and Controls Row */}
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-3">
            {/* Left side: Filters */}
            <div className="flex items-center gap-3">              {/* Category Filter */}
              <select
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all min-w-[120px]"
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all"
                      ? "All Categories"
                      : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>

              {/* Part of Speech Filter */}
              <select
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:text-white transition-all min-w-[130px]"
                value={filters.partOfSpeech}
                onChange={(e) =>
                  setFilters({ ...filters, partOfSpeech: e.target.value })
                }
              >
                {partsOfSpeech.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos === "all"
                      ? "All Parts of Speech"
                      : pos.charAt(0).toUpperCase() + pos.slice(1)}
                  </option>
                ))}
              </select>

              {/* Sort Filter */}
              <select
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all min-w-[110px]"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="dateAdded">Newest First</option>
                <option value="alphabetical">A-Z</option>
              </select>
            </div>

            {/* Right side: View Mode Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode("cards")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === "cards"
                    ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                Cards
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === "table"
                    ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
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
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
                Table
              </button>
            </div>
          </div>
        </div>
        {/* Content Area */}
        <div className="pb-20">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
                <div
                  className="absolute inset-0 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"
                  style={{ animationDelay: "0.15s", animationDuration: "1.5s" }}
                ></div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Loading your vocabulary...
              </p>
            </div>
          ) : filteredAndSortedWords.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto px-4">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {words.length === 0 ? "No words yet" : "No words found"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  {words.length === 0
                    ? "Start building your vocabulary by adding your first word"
                    : "Try adjusting your search or filters to find what you're looking for"}
                </p>
                <button
                  onClick={handleAddWord}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Your First Word
                </button>
              </div>
            </div>
          ) : (
            <>
              {" "}
              {/* Enhanced Cards View */}
              {viewMode === "cards" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                  <AnimatePresence>
                    {filteredAndSortedWords.map((word) => (
                      <WordCard
                        key={word.id}
                        word={word}
                        onEdit={handleEditWord}
                        onDelete={handleDeleteWord}
                        onShowConjugations={handleShowConjugations}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
              {/* Modern Table View */}
              {viewMode === "table" && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">                  {/* Enhanced Table Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                    <div className="grid grid-cols-8 sm:grid-cols-14 gap-3 sm:gap-4 items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <div className="col-span-3 sm:col-span-3">Word</div>
                      <div className="col-span-3 sm:col-span-4">
                        Translation
                      </div>
                      <div className="col-span-2 hidden sm:block">Example</div>
                      <div className="col-span-2 sm:col-span-3 text-right">
                        Actions
                      </div>
                    </div>
                  </div>{" "}
                  {/* Enhanced Table Body */}
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    <AnimatePresence>
                      {filteredAndSortedWords.map((word) => {
                        // Handle keyboard navigation for table rows
                        const handleRowKeyDown = (e) => {
                          if (
                            e.key === "Tab" ||
                            e.key === "Enter" ||
                            e.key === " "
                          ) {
                            // Play audio when row receives focus via tab or is activated
                            e.preventDefault(); // Prevent default space/enter behavior
                            speakWord(word);
                          }
                        };

                        const handleRowFocus = () => {
                          // Auto-play audio when row receives focus
                          speakWord(word);
                        };

                        return (
                          <motion.div
                            key={word.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            tabIndex={0}
                            onKeyDown={handleRowKeyDown}
                            onFocus={handleRowFocus}
                            className="group px-4 sm:px-6 py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/10 dark:hover:to-purple-900/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gradient-to-r focus:from-blue-50 focus:to-purple-50 dark:focus:from-blue-900/10 dark:focus:to-purple-900/10 transition-all duration-200 cursor-pointer"
                          >                            <div className="grid grid-cols-8 sm:grid-cols-14 gap-3 sm:gap-4 items-start text-sm">
                              {" "}
                              {/* Word Column */}
                              <div className="col-span-3 sm:col-span-3">
                                <div
                                  className={`font-semibold text-gray-900 dark:text-white text-sm sm:text-base leading-tight ${
                                    word.conjugations &&
                                    Object.keys(word.conjugations).length > 0
                                      ? "cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    if (
                                      word.conjugations &&
                                      Object.keys(word.conjugations).length > 0
                                    ) {
                                      handleShowConjugations(word);
                                    }
                                  }}
                                  title={
                                    word.conjugations &&
                                    Object.keys(word.conjugations).length > 0
                                      ? "Click to view conjugations"
                                      : ""
                                  }                                >
                                  {word.word}
                                  {word.partOfSpeech && (
                                    <span className="ml-2 text-sm font-normal text-purple-600 dark:text-purple-400">
                                      ({getPartOfSpeechAbbreviation(word.partOfSpeech)})
                                    </span>
                                  )}
                                </div>
                              </div>
                              {/* Translation Column - Fixed overflow */}
                              <div className="col-span-3 sm:col-span-4">
                                <div
                                  className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed line-clamp-2 break-words hover:line-clamp-none transition-all duration-200 cursor-pointer"
                                  title="Click to expand"
                                >
                                  {word.translation}
                                </div>
                              </div>
                              {/* Part of Speech Column - Hidden on mobile */}                              
                              {/* Language Column - Hidden on mobile */}
                              <div className="col-span-3 hidden sm:block">
                                <span className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                                  {word.example}
                                </span>
                              </div>
                              {/* Actions Column */}
                              <div className="col-span-2 sm:col-span-3 flex items-center justify-end gap-2">
                                {/* Audio Button */}
                                <button
                                  onClick={() => speakWord(word)}
                                  className="p-2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 group-hover:scale-110"
                                  title="Pronounce word"
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
                                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12a3 3 0 106 0v-1a3 3 0 00-6 0v1z"
                                    />
                                  </svg>
                                </button>
                                {/* Edit Button */}
                                <button
                                  onClick={() => handleEditWord(word)}
                                  className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 group-hover:scale-110"
                                  title="Edit word"
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
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </button>
                                {/* Delete Button */}
                                <button
                                  onClick={() => handleDeleteWord(word.id)}
                                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 group-hover:scale-110"
                                  title="Delete word"
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
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>{" "}
      {/* Enhanced Floating Action Button */}
      <AddButton onClick={handleAddWord} title="Add new word" />
      {/* Add/Edit Word Modal */}
      <AnimatePresence>
        {showModal && (
          <WordModal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setEditingWord(null);
            }}            onSubmit={handleSubmit}
            editingWord={editingWord}
            initialWord={formData?.word || ""}
            language={formData?.language || userLanguage}
            userId={currentUser?.uid || null}
          />
        )}{" "}
      </AnimatePresence>
      {/* Conjugation Modal */}
      <AnimatePresence>
        {showConjugationModal && (
          <ConjugationModal
            isOpen={showConjugationModal}
            onClose={() => {
              setShowConjugationModal(false);
              setSelectedWordForConjugation(null);
            }}
            word={selectedWordForConjugation}
          />
        )}
      </AnimatePresence>
      {/* Toast Notifications */}
      <Toaster position="top-right" />
    </div>
  );
}
