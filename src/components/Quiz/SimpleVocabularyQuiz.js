'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchWords } from '@/utils/firebaseUtils';
import toast from 'react-hot-toast';

// Import audio service for pronunciation
let AudioService;
if (typeof window !== 'undefined') {
  import('@/services/audioService').then(module => {
    AudioService = module.default;
  });
}

export default function SimpleVocabularyQuiz() {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const { language } = useUserPreferences();
  
  // Debug auth context
  console.log("@auth-debug: useAuth() returned currentUser:", currentUser);
  
  // Quiz state
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResult, setShowResult] = useState(false);
    // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [vocabularyWords, setVocabularyWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
    // AI-enhanced features
  const [showHint, setShowHint] = useState(false);
  const [hint, setHint] = useState('');
  const [loadingHint, setLoadingHint] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [streakCount, setStreakCount] = useState(0);
  
  // Audio pronunciation features
  const [audioService, setAudioService] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioError, setAudioError] = useState(null);  // Load user's vocabulary words
  useEffect(() => {
    console.log("@saibaba - useEffect triggered, currentUser:", currentUser);
    
    if (!currentUser) {
      console.log("No user found, skipping vocabulary load");
      return;
    }
    
    console.log("Loading vocabulary for user:", currentUser.uid);
    setIsLoading(true);
    
    // Use fetchWords with state setters as it expects
    fetchWords(currentUser, setVocabularyWords, setIsLoading);
  }, [currentUser]);  // Initialize audio service
  useEffect(() => {
    const initAudio = async () => {
      try {
        if (typeof window !== 'undefined') {
          const audioModule = await import('@/services/audioService');
          const audioServiceInstance = audioModule.default; // Use the singleton instance, don't call new
          setAudioService(audioServiceInstance);
          console.log("Audio service initialized for pronunciation");
          
          // Wait a bit for the service to fully initialize
          setTimeout(() => {
            console.log("Audio service state:", {
              isInitialized: audioServiceInstance.isInitialized,
              hasPolly: !!audioServiceInstance.pollyClient,
              userInteractionRequired: audioServiceInstance.isUserInteractionRequired
            });
          }, 1000);
        }
      } catch (error) {
        console.error("Failed to initialize audio service:", error);
        setAudioError("Audio not available");
      }
    };
    
    initAudio();
  }, []);

  // Add user interaction handler to enable audio
  useEffect(() => {
    if (!audioService) return;

    const handleUserInteraction = () => {
      if (audioService && audioService.isUserInteractionRequired) {
        console.log("User interaction detected - audio should now be enabled");
        // Force a re-render by updating a state that doesn't affect the audio service
        setTimeout(() => {
          setAudioError(null);
        }, 100);
      }
    };

    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true });
    document.addEventListener('keydown', handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [audioService]);
  // Debug vocabulary words changes
  useEffect(() => {
    console.log("Vocabulary words updated:", vocabularyWords);
    console.log("Number of words:", vocabularyWords.length);
  }, [vocabularyWords]);

  // Filter vocabulary words by user's selected language
  useEffect(() => {
    if (vocabularyWords.length > 0 && language) {
      const filtered = vocabularyWords.filter(word => {
        const matchesLanguage = word.language === language; // Filter by user's language preference
        console.log(`Word "${word.word}" - Language: ${word.language}, User preference: ${language}, Match: ${matchesLanguage}`);
        return matchesLanguage;
      });
      
      console.log(`Filtered words: ${filtered.length} out of ${vocabularyWords.length} words for language: ${language}`);
      setFilteredWords(filtered);
    } else {
      setFilteredWords([]);
    }
  }, [vocabularyWords, language]);

  // AI-powered hint generation
  const generateHint = async (word) => {
    setLoadingHint(true);
    try {
      const response = await fetch('/api/bedrock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate',
          prompt: `Generate a helpful hint for learning the ${language} word "${word.word}" which means "${word.translation}" in English. The hint should be creative, memorable, and help with memorization. Make it concise (1-2 sentences). Focus on etymology, mnemonics, or word associations.`
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setHint(data.result.trim());
      } else {
        setHint(`Think about: This ${language} word sounds similar to "${word.word.substring(0, 3)}..." and relates to ${word.translation.toLowerCase()}.`);
      }
    } catch (error) {
      console.error('Error generating hint:', error);
      setHint(`💡 Think about the context where you might use "${word.translation}"`);
    }
    setLoadingHint(false);
  };

  // AI-powered explanation for wrong answers
  const generateExplanation = async (word, userAnswer, isCorrect) => {
    if (isCorrect) return;
    
    setLoadingExplanation(true);
    try {
      const response = await fetch('/api/bedrock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate',
          prompt: `Explain why "${word.word}" in ${language} means "${word.translation}" and not the user's answer. Be encouraging and educational. Provide memory techniques or word origins if helpful. Keep it brief (2-3 sentences).`
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setExplanation(data.result.trim());
      } else {
        setExplanation(`"${word.word}" comes from ${language} and specifically means "${word.translation}". Try to remember this connection for next time!`);
      }
    } catch (error) {
      console.error('Error generating explanation:', error);
      setExplanation(`Remember: "${word.word}" = "${word.translation}". Keep practicing to strengthen this memory!`);
    }
    setLoadingExplanation(false);
  };
  // Smart difficulty adjustment based on performance
  const adjustDifficulty = (isCorrect) => {
    if (isCorrect) {
      setStreakCount(prev => prev + 1);
      if (streakCount >= 3 && difficulty === 'easy') {
        setDifficulty('medium');
        toast.success('🔥 Difficulty increased! You\'re doing great!');
      } else if (streakCount >= 5 && difficulty === 'medium') {
        setDifficulty('hard');
        toast.success('🚀 Expert mode activated!');
      }
    } else {
      setStreakCount(0);
      if (difficulty === 'hard') {
        setDifficulty('medium');
        toast.info('📚 Difficulty adjusted to help you learn');
      } else if (difficulty === 'medium') {
        setDifficulty('easy');
        toast.info('🎯 Taking it step by step');
      }
    }
  };  // Audio pronunciation function
  const playPronunciation = async (word, wordLanguage) => {
    if (!audioService) {
      console.log("Audio service not available");
      toast.error("Audio pronunciation not available");
      return;
    }

    // Wait for audio service to be initialized if needed
    if (!audioService.isInitialized) {
      console.log("Waiting for audio service to initialize...");
      toast.info("Audio service is loading...");
      
      // Wait up to 3 seconds for initialization
      let attempts = 0;
      while (!audioService.isInitialized && attempts < 30) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      if (!audioService.isInitialized) {
        console.log("Audio service failed to initialize");
        toast.error("Audio service initialization failed");
        setAudioError("Audio initialization failed");
        return;
      }
    }

    setIsPlayingAudio(true);
    setAudioError(null);

    try {
      console.log(`Playing pronunciation for "${word}" in ${wordLanguage}`);
      console.log("Audio service state:", {
        isInitialized: audioService.isInitialized,
        hasPolly: !!audioService.pollyClient,
        userInteractionRequired: audioService.isUserInteractionRequired
      });
      
      await audioService.playAudio(word, wordLanguage, {
        speed: 0.8, // Slightly slower for learning
        onError: (error) => {
          console.error("Audio playback error:", error);
          setAudioError("Audio playback failed");
          toast.error("Could not play pronunciation");
        }
      });
      
      console.log("Audio playback completed successfully");
    } catch (error) {
      console.error("Error playing pronunciation:", error);
      setAudioError("Pronunciation unavailable");
      
      // Show helpful error message based on error type
      if (error.code === 'USER_INTERACTION_REQUIRED') {
        toast.error("Click anywhere on the page first, then try pronunciation");
      } else if (error.message && error.message.includes('User interaction required')) {
        toast.error("Please click anywhere on the page first");
      } else {
        toast.error("Pronunciation not available for this word");
      }
    } finally {
      setIsPlayingAudio(false);
    }
  };// Generate AI-powered quiz questions
  const generateAIQuestions = async (words, count = 5) => {
    console.log("Generating AI questions for", words.length, "words at", difficulty, "difficulty");
    
    try {
      const wordList = words.slice(0, count).map(w => `${w.word} (${w.translation})`).join(', ');
      
      const response = await fetch('/api/bedrock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate',
          prompt: `Create ${count} diverse quiz questions for ${language} vocabulary learning. Use these words: ${wordList}

Generate questions with these types (mix them):
1. Multiple choice: "${language} word" → English meaning
2. Fill in the blank: "The ${language} word for [English word] is ___"
3. Context questions: "Which word fits: [sentence with blank]"
4. Definition matching: "Which word means [definition]"

Difficulty level: ${difficulty}
- Easy: straightforward translation questions
- Medium: context-based questions
- Hard: nuanced definitions and tricky contexts

For each question, provide:
- question: the question text
- correctAnswer: the correct answer
- type: question type (multiple_choice, fill_blank, context, definition)
- options: array of 4 options for multiple choice (include correct answer)

Return as JSON array with this exact format:
[
  {
    "question": "What does 'palabra' mean in English?",
    "correctAnswer": "word",
    "type": "multiple_choice",
    "options": ["word", "sentence", "letter", "book"]
  }
]`
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("AI response:", data.result);
        
        // Try to parse the JSON response
        try {
          const questions = JSON.parse(data.result.trim());
          return questions.map((q, index) => ({
            id: index,
            word: words[index % words.length], // Associate with a word
            type: q.type || 'ai_generated',
            question: q.question,
            correctAnswer: q.correctAnswer.toLowerCase().trim(),
            options: q.options || [],
            userAnswer: null,
            isCorrect: null,
            difficulty: difficulty,
            isAIGenerated: true
          }));
        } catch (parseError) {
          console.error('Error parsing AI response:', parseError);
          // Fallback to traditional questions
          return generateTraditionalQuestions(words, count);
        }
      } else {
        console.error('AI question generation failed, using traditional questions');
        return generateTraditionalQuestions(words, count);
      }
    } catch (error) {
      console.error('Error generating AI questions:', error);
      return generateTraditionalQuestions(words, count);
    }
  };

  // Traditional quiz question generation (fallback)
  const generateTraditionalQuestions = (words, count) => {
    const shuffledWords = [...words].sort(() => 0.5 - Math.random());
    const questionCount = Math.min(count, shuffledWords.length);
    
    return shuffledWords.slice(0, questionCount).map((word, index) => {
      // For single word, create translation questions
      if (words.length === 1) {
        return {
          id: index,
          word: word,
          type: 'translation',
          question: `What does "${word.word}" mean in English?`,
          correctAnswer: word.translation.toLowerCase().trim(),
          userAnswer: null,
          isCorrect: null,
          difficulty: difficulty
        };
      }
      
      // For multiple words, create multiple choice questions with difficulty-based distractors
      let wrongOptions = words
        .filter(w => w.id !== word.id)
        .sort(() => 0.5 - Math.random());

      // Adjust difficulty by selecting more similar/confusing options
      if (difficulty === 'hard') {
        // For hard mode, select words that are more similar or confusing
        wrongOptions = wrongOptions
          .filter(w => w.translation.length <= word.translation.length + 3 && w.translation.length >= word.translation.length - 3)
          .slice(0, 3);
        
        // If not enough similar words, fill with random ones
        if (wrongOptions.length < 3) {
          const remaining = words
            .filter(w => w.id !== word.id && !wrongOptions.includes(w))
            .sort(() => 0.5 - Math.random())
            .slice(0, 3 - wrongOptions.length);
          wrongOptions = [...wrongOptions, ...remaining];
        }      } else {
        // For easy/medium, use random distractors
        wrongOptions = wrongOptions.slice(0, 3);
      }

      const options = [word.translation, ...wrongOptions.map(w => w.translation)].sort(() => 0.5 - Math.random());
      const correctAnswer = options.indexOf(word.translation);

      return {
        id: index,
        word: word,
        type: 'multiple_choice',
        question: `What does "${word.word}" mean?`,
        options: options,
        correctAnswer: correctAnswer,
        userAnswer: null,
        isCorrect: null,
        difficulty: difficulty
      };
    });
  };

  // Main question generation function - AI-enhanced
  const generateQuestions = async () => {
    console.log("Generating questions with", filteredWords.length, "filtered words at", difficulty, "difficulty");
    
    if (filteredWords.length === 0) {
      toast.error(`No ${language} vocabulary words found. Please add some ${language} words first.`);
      return [];
    }

    // Try AI generation first (for 3+ words)
    if (filteredWords.length >= 3) {
      try {
        const aiQuestions = await generateAIQuestions(filteredWords, Math.min(10, filteredWords.length));
        if (aiQuestions && aiQuestions.length > 0) {
          console.log("Successfully generated", aiQuestions.length, "AI questions");
          return aiQuestions;
        }
      } catch (error) {
        console.error("AI question generation failed, falling back to traditional:", error);
      }
    }

    // Fallback to traditional questions
    console.log("Using traditional question generation");
    return generateTraditionalQuestions(filteredWords, Math.min(10, filteredWords.length));
  };
  // Start quiz - now handles AI question generation
  const startQuiz = async () => {
    try {
      const generatedQuestions = await generateQuestions();
      if (generatedQuestions.length === 0) return;

      setQuestions(generatedQuestions);
      setCurrentQuestion(0);
      setScore(0);
      setIsStarted(true);
      setIsCompleted(false);
      setShowResult(false);
      
      // Reset AI states
      setShowHint(false);
      setHint('');
      setExplanation('');
      setStreakCount(0);
      
      toast.success(`🚀 AI-Enhanced Quiz Started! ${generatedQuestions.length} questions generated`);
    } catch (error) {
      console.error('Error starting quiz:', error);
      toast.error('Failed to start quiz. Please try again.');
    }
  };  // Handle answer selection with AI enhancements
  const handleAnswer = async (answer) => {
    const question = questions[currentQuestion];
    let isCorrect = false;

    // Handle different question types
    if (question.type === 'translation' || question.type === 'fill_blank' || question.type === 'definition' || question.type === 'context') {
      // For text-based answers, compare lowercase trimmed strings
      const userAnswer = typeof answer === 'string' ? answer.toLowerCase().trim() : '';
      const correctAnswer = question.correctAnswer.toLowerCase().trim();
      isCorrect = userAnswer === correctAnswer;
    } else if (question.type === 'multiple_choice' && question.options) {
      // For multiple choice, handle both index-based and value-based answers
      if (typeof answer === 'number') {
        // Traditional multiple choice with index
        isCorrect = answer === question.correctAnswer;
      } else {
        // AI-generated multiple choice with text values
        const userAnswer = answer.toLowerCase().trim();
        const correctAnswer = question.correctAnswer.toLowerCase().trim();
        isCorrect = userAnswer === correctAnswer;
      }
    } else if (question.isAIGenerated) {
      // General AI-generated question handling
      const userAnswer = typeof answer === 'string' ? answer.toLowerCase().trim() : String(answer).toLowerCase().trim();
      const correctAnswer = question.correctAnswer.toLowerCase().trim();
      isCorrect = userAnswer === correctAnswer;
    } else {
      // Fallback for traditional questions
      isCorrect = answer === question.correctAnswer;
    }

    // Update question with user answer
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion] = {
      ...question,
      userAnswer: answer,
      isCorrect: isCorrect
    };
    setQuestions(updatedQuestions);

    if (isCorrect) {
      setScore(score + 1);
      setStreakCount(prev => prev + 1);
      toast.success('✅ Correct!');
    } else {
      setStreakCount(0);
      toast.error('❌ Incorrect');
      
      // Generate AI explanation for wrong answers
      generateExplanation(question.word, answer, isCorrect);
    }

    // Adjust difficulty based on performance
    adjustDifficulty(isCorrect);

    // Reset AI states
    setShowHint(false);
    setHint('');
    setExplanation('');

    setShowResult(true);

    // Move to next question or complete quiz after showing result
    setTimeout(() => {
      setShowResult(false);
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setIsCompleted(true);
        setIsStarted(false);
      }
    }, 3000); // Increased time to read AI explanations
  };
  // Reset quiz with AI state cleanup
  const resetQuiz = () => {
    setIsStarted(false);
    setIsCompleted(false);
    setCurrentQuestion(0);
    setQuestions([]);
    setScore(0);
    setShowResult(false);
    
    // Reset AI states
    setShowHint(false);
    setHint('');
    setExplanation('');
    setLoadingHint(false);
    setLoadingExplanation(false);
    setStreakCount(0);
    setDifficulty('medium');
  };
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">Loading your vocabulary...</p>
        </div>
      </div>
    );
  }  // No vocabulary words for selected language
  if (!isLoading && filteredWords.length === 0 && vocabularyWords.length > 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="text-6xl mb-6">🌐</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">No {language} Vocabulary Found</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            You have {vocabularyWords.length} vocabulary words, but none match your selected language ({language}). 
            Add some {language} words or change your language preference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/vocabulary'}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Add {language} Vocabulary Words
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/preferences'}
              className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Change Language Preference
            </motion.button>
          </div>
        </div>
      </div>
    );
  }
  
  // No vocabulary words at all
  if (!isLoading && vocabularyWords.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="text-6xl mb-6">📚</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">No Vocabulary Found</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            You need to add some vocabulary words before you can take a quiz.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/vocabulary'}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Add Vocabulary Words
          </motion.button>
        </div>
      </div>
    );
  }
  // Quiz setup screen
  if (!isStarted && !isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              🧠 Vocabulary Quiz
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Test your {language} vocabulary knowledge
            </p>
          </motion.div>          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Words Available Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500"
            >              <div className="flex justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{language} Words Available</p>
                  <h3 className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{filteredWords.length}</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {filteredWords.length === 1 ? 'Ready to practice' : 'Ready to practice'}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 flex-shrink-0">
                  <span className="text-2xl text-blue-600 dark:text-blue-400">📚</span>
                </div>
              </div>
            </motion.div>

            {/* Difficulty Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-orange-500"
            >
              <div className="flex justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">AI Difficulty</p>
                  <h3 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white capitalize">
                    {difficulty}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Adapts to performance
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900 flex-shrink-0">
                  <span className="text-2xl text-orange-600 dark:text-orange-400">
                    {difficulty === 'easy' ? '🟢' : difficulty === 'medium' ? '🟡' : '🔴'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Quiz Type Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-green-500"
            >
              <div className="flex justify-between">                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Quiz Type</p>
                  <h3 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                    {filteredWords.length === 1 ? 'Translation' : 'Multiple Choice'}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {filteredWords.length === 1 ? 'Type the answer' : 'Choose the best answer'}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900 flex-shrink-0">
                  <span className="text-2xl text-green-600 dark:text-green-400">✍️</span>
                </div>
              </div>
            </motion.div>

            {/* Questions Count Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-purple-500"
            >
              <div className="flex justify-between">                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Questions</p>
                  <h3 className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{Math.min(10, filteredWords.length)}</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Quick practice session
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900 flex-shrink-0">
                  <span className="text-2xl text-purple-600 dark:text-purple-400">❓</span>
                </div>
              </div>
            </motion.div>
          </div>          {/* Start Quiz Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Ready to Start?</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Test your knowledge with AI-powered hints and adaptive difficulty
              </p>
                {/* AI Features List */}              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 text-sm">
                <div className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400">
                  <span>🤖</span>
                  <span>AI Questions</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-indigo-600 dark:text-indigo-400">
                  <span>💡</span>
                  <span>Smart Hints</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
                  <span>🎯</span>
                  <span>Adaptive Difficulty</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-purple-600 dark:text-purple-400">
                  <span>🧠</span>
                  <span>AI Explanations</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-amber-600 dark:text-amber-400">
                  <span>🔊</span>
                  <span>Audio Pronunciation</span>
                </div>              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startQuiz}
                className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
              >
                🚀 Start AI-Powered Quiz
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }
  // Quiz in progress
  if (isStarted && !isCompleted) {
    const question = questions[currentQuestion];
    if (!question) return null;

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-3xl mx-auto">
          {/* Progress Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Question {currentQuestion + 1} of {questions.length}
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Score: {score}/{questions.length}
                </div>
                <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
                  {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
            >              {/* Question */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {question.type === 'translation' ? 'Translate this word:' : 'What does this mean?'}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      difficulty === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {difficulty.toUpperCase()}
                    </div>
                    {!showResult && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (!showHint) {
                            setShowHint(true);
                            generateHint(question.word);
                          } else {
                            setShowHint(false);
                            setHint('');
                          }
                        }}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                      >
                        💡 {showHint ? 'Hide' : 'Hint'}
                      </motion.button>
                    )}
                  </div>
                </div>                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {question.isAIGenerated ? (
                    <div className="flex items-center space-x-2">
                      <span>🤖 AI Question</span>
                      <span className="text-sm bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 px-2 py-1 rounded-full">
                        {question.type.replace('_', ' ')}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-4">
                      <span>{question.word.word}</span>                      {/* Audio Pronunciation Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => playPronunciation(question.word.word, question.word.language)}
                        disabled={isPlayingAudio || !audioService}
                        className={`p-2 rounded-full transition-all duration-200 ${
                          isPlayingAudio 
                            ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' 
                            : !audioService
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            : audioService.isUserInteractionRequired
                            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-800'
                            : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800'
                        }`}
                        title={
                          !audioService ? 'Audio service loading...' :
                          isPlayingAudio ? 'Playing...' :
                          audioService.isUserInteractionRequired ? 'Click anywhere first to enable audio' :
                          'Listen to pronunciation'
                        }
                      >
                        {isPlayingAudio ? (
                          <div className="flex items-center space-x-1">
                            <div className="w-1 h-3 bg-current animate-pulse"></div>
                            <div className="w-1 h-3 bg-current animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-1 h-3 bg-current animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        ) : !audioService ? (
                          <span className="text-lg">⏳</span>
                        ) : audioService.isUserInteractionRequired ? (
                          <span className="text-lg">👆</span>
                        ) : (
                          <span className="text-lg">🔊</span>
                        )}
                      </motion.button>
                    </div>
                  )}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {question.question}
                </p>
                
                {/* AI Hint Display */}
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700"
                  >
                    {loadingHint ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                        <span className="text-sm text-blue-600 dark:text-blue-400">Generating hint...</span>
                      </div>
                    ) : (
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        💡 {hint}
                      </p>
                    )}
                  </motion.div>
                )}
              </div>              {/* Multiple Choice Options */}
              {question.type === 'multiple_choice' && !showResult && (
                <div className="space-y-4">
                  {question.options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        // For AI-generated questions, use the option text; for traditional, use index
                        const answer = question.isAIGenerated ? option : index;
                        handleAnswer(answer);
                      }}
                      className="w-full p-4 text-left border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4 text-sm font-bold text-blue-600 dark:text-blue-400">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-lg text-gray-900 dark:text-white">{option}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Translation/Fill-in-blank/Context Input */}
              {(question.type === 'translation' || question.type === 'fill_blank' || question.type === 'context' || question.type === 'definition') && !showResult && (
                <div className="max-w-md mx-auto">
                  <input
                    type="text"
                    placeholder={
                      question.type === 'fill_blank' ? "Fill in the blank..." :
                      question.type === 'context' ? "Type the correct word..." :
                      question.type === 'definition' ? "Type the word that matches..." :
                      "Type your answer in English..."
                    }
                    className="w-full p-4 text-lg border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAnswer(e.target.value);
                      }
                    }}
                    autoFocus
                  />
                  <div className="mt-4 text-center">
                    <button
                      onClick={(e) => {
                        const input = e.target.parentElement.previousElementSibling;
                        handleAnswer(input.value);
                      }}
                      className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium"
                    >
                      Submit Answer
                    </button>
                  </div>
                </div>
              )}              {/* Show Result */}
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-700 space-y-4"
                >
                  {question.isCorrect ? (
                    <div>
                      <div className="text-green-600 dark:text-green-400 font-bold text-2xl mb-2">
                        🎉 Correct!
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Great job! {streakCount > 1 && `${streakCount} in a row! 🔥`}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-red-600 dark:text-red-400 font-bold text-2xl mb-2">
                        ❌ Incorrect
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 mb-2">
                        The correct answer is:
                      </div>                      <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        {question.isAIGenerated 
                          ? question.correctAnswer
                          : question.type === 'translation' 
                            ? question.word.translation
                            : question.options[question.correctAnswer]
                        }
                      </div>
                      
                      {/* AI Explanation */}
                      {loadingExplanation ? (
                        <div className="flex items-center justify-center space-x-2 p-4">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                          <span className="text-sm text-blue-600 dark:text-blue-400">Generating explanation...</span>
                        </div>
                      ) : explanation && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700"
                        >
                          <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                            🧠 AI Explanation:
                          </div>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            {explanation}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                    Moving to next question in {3 - Math.floor((Date.now() % 3000) / 1000)} seconds...
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }
  // Quiz completed
  if (isCompleted) {
    const finalScore = Math.round((score / questions.length) * 100);

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="text-8xl mb-6"
            >
              {finalScore >= 90 ? '🏆' : finalScore >= 70 ? '🎉' : finalScore >= 50 ? '👍' : '📚'}
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Quiz Completed!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              You answered {score} out of {questions.length} questions correctly
            </p>
          </motion.div>

          {/* Score Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Final Score Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg border-l-4 border-blue-500 text-center"
            >
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {finalScore}%
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Final Score</div>
              <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                {finalScore >= 90 ? 'Excellent!' : 
                 finalScore >= 70 ? 'Great job!' : 
                 finalScore >= 50 ? 'Good effort!' : 'Keep practicing!'}
              </div>
            </motion.div>

            {/* Correct Answers Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg border-l-4 border-green-500 text-center"
            >
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                {score}
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Correct</div>
              <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Out of {questions.length} questions
              </div>
            </motion.div>

            {/* Incorrect Answers Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg border-l-4 border-red-500 text-center"
            >
              <div className="text-4xl font-bold text-red-600 dark:text-red-400 mb-2">
                {questions.length - score}
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">Incorrect</div>
              <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                {questions.length - score === 0 ? 'Perfect score!' : 'Review needed'}
              </div>
            </motion.div>
          </div>

          {/* Performance Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8 text-center"
          >
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {finalScore >= 90 ? '🌟 Outstanding Performance!' : 
               finalScore >= 70 ? '🎯 Great Work!' : 
               finalScore >= 50 ? '📈 Good Progress!' : '💪 Keep Practicing!'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {finalScore >= 90 ? 'You have excellent mastery of these vocabulary words!' : 
               finalScore >= 70 ? 'You have a solid understanding of the vocabulary!' : 
               finalScore >= 50 ? 'You\'re making good progress with your vocabulary!' : 'Practice makes perfect! Keep studying to improve your vocabulary.'}
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetQuiz}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              🔄 Take Another Quiz
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/vocabulary'}
              className="px-8 py-4 bg-white dark:bg-gray-700 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-semibold rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
            >
              📚 Study More Words
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/dashboard'}
              className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              📊 View Dashboard
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
}
