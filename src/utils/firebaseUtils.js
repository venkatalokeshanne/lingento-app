import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore';

// Clean pronunciation by extracting only the phonetic part in parentheses
const cleanPronunciation = (pronunciation) => {
  if (!pronunciation) return '';
  
  // Remove IPA notation (anything between forward slashes) and keep only phonetic pronunciation in parentheses
  // Example: "/sa-'ly/ (sah-LÜEE)" becomes "sah-LÜEE"
  const match = pronunciation.match(/\(([^)]+)\)/);
  if (match) {
    return match[1]; // Return just the content inside parentheses
  }
  
  // If no parentheses found, but has forward slashes, remove everything before the first space after closing slash
  if (pronunciation.includes('/')) {
    const afterSlash = pronunciation.replace(/^[^/]*\/[^/]*\/\s*/, '');
    if (afterSlash && afterSlash !== pronunciation) {
      return afterSlash.replace(/^\(|\)$/g, ''); // Remove wrapping parentheses if any
    }
  }
  
  // Fallback: return as-is if no pattern matches
  return pronunciation;
};

/**
 * Fetch documents from a user's subcollection
 */
export const fetchUserData = async (currentUser, subcollection, setData, setLoading, setError = null) => {
  if (!currentUser) return [];
  
  setLoading(true);
  if (setError) setError(null);
  
  try {
    const db = getFirestore();
    const dataRef = collection(db, `users/${currentUser.uid}/${subcollection}`);
    const q = query(dataRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
    }));
    
    setData(data);
    return data;
  } catch (error) {
    console.error(`Error fetching ${subcollection}:`, error);
    if (setError) setError(error.message);
    return [];
  } finally {
    setLoading(false);
  }
};

/**
 * Add a new document to a user's subcollection
 */
export const addUserData = async (currentUser, subcollection, data) => {
  if (!currentUser) throw new Error('User not authenticated');
  
  const db = getFirestore();
  const dataRef = collection(db, `users/${currentUser.uid}/${subcollection}`);
  
  // Initialize spaced repetition data for vocabulary words
  const initialData = {
    ...data,
    mastered: false, // Initialize mastered as false for new words
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  
  // Add spaced repetition fields for vocabulary words
  if (subcollection === 'vocabulary') {
    const now = new Date();
    initialData.easinessFactor = 2.5;
    initialData.repetitionNumber = 0;
    initialData.interval = 1;
    initialData.nextReviewDate = now;
    initialData.lastReviewDate = null;
    initialData.totalReviews = 0;
    initialData.correctStreak = 0;
    initialData.incorrectCount = 0;
    initialData.averageQuality = 0;
    initialData.qualityHistory = [];
    initialData.isNew = true;
    initialData.isLearning = false;
    initialData.isReview = false;
    initialData.isMatured = false;
  }
  
  const docRef = await addDoc(dataRef, initialData);
  return docRef.id;
};

/**
 * Update a document in a user's subcollection
 */
export const updateUserData = async (currentUser, subcollection, docId, data) => {
  if (!currentUser) throw new Error('User not authenticated');
  
  const db = getFirestore();
  const docRef = doc(db, `users/${currentUser.uid}/${subcollection}`, docId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Delete a document from a user's subcollection
 */
export const deleteUserData = async (currentUser, subcollection, docId) => {
  if (!currentUser) throw new Error('User not authenticated');
  
  const db = getFirestore();
  const docRef = doc(db, `users/${currentUser.uid}/${subcollection}`, docId);
  await deleteDoc(docRef);
};

/**
 * Fetch vocabulary words for a user
 */
export const fetchWords = async (currentUser, setWords, setLoading) => {
  return fetchUserData(currentUser, 'vocabulary', setWords, setLoading);
};

/**
 * Convert vocabulary words to flashcard format
 */
export const convertVocabularyToFlashcards = (vocabularyWords) => {
  return vocabularyWords.map(word => {    // Function to create a translated example sentence
    const createTranslatedExample = async (example, originalWord, translation, sourceLanguage = 'french') => {
      if (!example) return null;
      
      try {
        // Import the translation service
        const { translateService } = await import('@/services/translateService');
        
        // Use the translation service to translate the complete example sentence
        const result = await translateService.translateText(
          example, 
          sourceLanguage, 
          'english'
        );
        
        if (result && result.translatedText) {
          return result.translatedText;
        }
      } catch (error) {
        console.error('Error translating example sentence:', error);
      }
      
      // Fallback: simple word replacement if translation service fails
      let translatedExample = example.replace(
        new RegExp(`\\b${originalWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi'), 
        translation
      );
      
      // If the word wasn't found in the example, create a basic translated version
      if (translatedExample === example) {
        translatedExample = `[Translation needed] ${example}`;
      }
      
      return translatedExample;
    };return {
      id: word.id,
      // Always show the word on the front
      frontText: word.word,
      // Always show the translation on the back (we'll handle examples separately)
      backText: word.translation,
      audioSrc: null,      imageUrl: null,      category: word.language || 'General',
      mastered: word.mastered || false,
      pronunciation: cleanPronunciation(word.pronunciation),
      definition: word.definition,
      example: word.example,
      translatedExample: createTranslatedExample(word.example, word.word, word.translation),
      originalWord: word.word,
      translation: word.translation,
      originalCategory: word.category,createdAt: word.createdAt,
            updatedAt: word.updatedAt,

      // Spaced repetition fields
      easinessFactor: word.easinessFactor || 2.5,
      repetitionNumber: word.repetitionNumber || 0,
      interval: word.interval || 1,
      nextReviewDate: word.nextReviewDate || null, // Keep null for new cards
      lastReviewDate: word.lastReviewDate || null,
      totalReviews: word.totalReviews || 0,
      correctStreak: word.correctStreak || 0,
      incorrectCount: word.incorrectCount || 0,
      averageQuality: word.averageQuality || 0,
      qualityHistory: word.qualityHistory || [],

      isNew: word.isNew !== undefined ? word.isNew : true,
      isLearning: word.isLearning || false,
      isReview: word.isReview || false,
      isMatured: Boolean(word.isMatured)
    };
  });
};

/**
 * Fetch vocabulary words and convert them to flashcards
 */
export const fetchVocabularyAsFlashcards = async (currentUser, setFlashcards, setLoading, setError = null) => {
  if (!currentUser) return [];
  
  setLoading(true);
  if (setError) setError(null);
  
  try {
    const db = getFirestore();
    const vocabularyRef = collection(db, `users/${currentUser.uid}/vocabulary`);
    const q = query(vocabularyRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const vocabularyWords = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
    }));
    
    console.log('Raw vocabulary data from Firestore:', vocabularyWords);
    console.log('Words with isMatured=true in raw data:', vocabularyWords.filter(word => word.isMatured));
    
    // Convert vocabulary to flashcards with complete example translation
    const flashcards = await Promise.all(vocabularyWords.map(async (word) => {
      let translatedExample = null;
        // Translate complete example sentence if it exists
      if (word.example) {
        try {
          const { translateService } = await import('@/services/translateService');
          
          // Check if the text is valid for translation first
          if (!translateService.isValidTextForTranslation(word.example)) {
            console.log(`Example text not suitable for translation: "${word.example}"`);
            // Use fallback for invalid text
            translatedExample = `[Translation needed] ${word.example}`;
          } else {
            const result = await translateService.translateText(
              word.example, 
              word.language || 'french', 
              'english'
            );
            
            if (result && result.translatedText) {
              translatedExample = result.translatedText;
            }
          }
        } catch (error) {
          console.error('Error translating example sentence:', error);
          // Fallback: simple word replacement
          translatedExample = word.example.replace(
            new RegExp(`\\b${word.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi'), 
            word.translation
          );
          
          if (translatedExample === word.example) {
            translatedExample = `[Translation needed] ${word.example}`;
          }
        }
      }

      return {
        id: word.id,
        // Always show the word on the front
        frontText: word.word,
        // Always show the translation on the back
        backText: word.translation,
        audioSrc: null,        imageUrl: null,        category: word.category || 'vocabulary',
        mastered: word.mastered || false,
        pronunciation: cleanPronunciation(word.pronunciation),
        definition: word.definition,
        example: word.example,
        translatedExample: translatedExample,
        originalWord: word.word,
        translation: word.translation,
        originalCategory: word.category,
        language: word.language || 'french',
        createdAt: word.createdAt,
        updatedAt: word.updatedAt,

        // Spaced repetition fields
        easinessFactor: word.easinessFactor || 2.5,
        repetitionNumber: word.repetitionNumber || 0,
        interval: word.interval || 1,
        nextReviewDate: word.nextReviewDate || null,
        lastReviewDate: word.lastReviewDate || null,
        totalReviews: word.totalReviews || 0,
        correctStreak: word.correctStreak || 0,
        incorrectCount: word.incorrectCount || 0,
        averageQuality: word.averageQuality || 0,
        qualityHistory: word.qualityHistory || [],

        isNew: word.isNew !== undefined ? word.isNew : true,
        isLearning: word.isLearning || false,
        isReview: word.isReview || false,
        isMatured: Boolean(word.isMatured)
      };
    }));
    
    setFlashcards(flashcards);
    return flashcards;
  } catch (error) {
    console.error('Error fetching vocabulary for flashcards:', error);
    if (setError) setError(error.message);
    return [];
  } finally {
    setLoading(false);
  }
};

/**
 * Update the mastered status of a vocabulary word
 */
export const updateVocabularyMastered = async (currentUser, wordId, mastered) => {
  if (!currentUser) throw new Error('User not authenticated');
  
  const db = getFirestore();
  const wordRef = doc(db, `users/${currentUser.uid}/vocabulary`, wordId);
  await updateDoc(wordRef, {
    mastered: mastered,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Update the spaced repetition data for a vocabulary word
 */
export const updateVocabularySpacedRepetition = async (currentUser, wordId, spacedRepetitionData) => {
  if (!currentUser) throw new Error('User not authenticated');
  
  const db = getFirestore();
  const wordRef = doc(db, `users/${currentUser.uid}/vocabulary`, wordId);
  
  // Extract only the spaced repetition fields we want to save
  const {
    easinessFactor,
    repetitionNumber,
    interval,
    nextReviewDate,
    lastReviewDate,
    totalReviews,
    correctStreak,
    incorrectCount,
    averageQuality,
    qualityHistory,
    isNew,
    isLearning,
    isReview,
    isMatured,
    mastered
  } = spacedRepetitionData;
  
  await updateDoc(wordRef, {
    // Spaced repetition fields
    easinessFactor,
    repetitionNumber,
    interval,
    nextReviewDate,
    lastReviewDate,
    totalReviews,
    correctStreak,
    incorrectCount,
    averageQuality,
    qualityHistory,
    isNew,
    isLearning,
    isReview,
    isMatured,
    mastered,
    updatedAt: serverTimestamp(),
  });
};