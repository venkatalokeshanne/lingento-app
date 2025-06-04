// SpacedRepetitionService - Implementation of SM-2 Algorithm for optimal flashcard scheduling
'use client';

class SpacedRepetitionService {
  constructor() {
    // SM-2 algorithm constants
    this.INITIAL_EASINESS_FACTOR = 2.5;
    this.MIN_EASINESS_FACTOR = 1.3;
    this.INITIAL_INTERVAL = 1;
    this.SECOND_INTERVAL = 6;
    
    // Quality rating thresholds
    this.QUALITY_RATINGS = {
      AGAIN: 0,      // Complete blackout, incorrect response
      HARD: 1,       // Incorrect response, but upon seeing the correct answer it felt familiar
      GOOD: 2,       // Incorrect response, but upon seeing the correct answer it seemed easy to remember
      EASY: 3,       // Correct response, but required significant effort to recall
      PERFECT: 4,    // Correct response with perfect recall
      TRIVIAL: 5     // Correct response that felt too easy
    };
  }

  /**
   * Helper function to convert Firestore Timestamp to JavaScript Date
   * @param {Object|Date|string|null} timestamp - Firestore timestamp, Date object, date string, or null
   * @returns {Date|null} - JavaScript Date object or null
   */
  convertTimestampToDate(timestamp) {
    if (!timestamp) return null;
    
    if (timestamp.seconds) {
      // Firestore Timestamp object
      return new Date(timestamp.seconds * 1000);
    }
    
    // Regular Date object or string
    return new Date(timestamp);
  }

  /**
   * Initialize spaced repetition data for a new flashcard
   * @param {Object} flashcard - The flashcard object
   * @returns {Object} - Flashcard with spaced repetition data
   */  initializeCard(flashcard) {
    const now = new Date();
    
    return {
      ...flashcard,
      // SM-2 Algorithm fields
      easinessFactor: this.INITIAL_EASINESS_FACTOR,
      repetitionNumber: 0,
      interval: this.INITIAL_INTERVAL,
      nextReviewDate: null, // Keep null for new cards to appear in review mode
      lastReviewDate: null,
      
      // Performance tracking
      totalReviews: 0,
      correctStreak: 0,
      incorrectCount: 0,
      averageQuality: 0,
      qualityHistory: [],
      
      // Learning stages
      isNew: true,
      isLearning: false,
      isReview: false,
      isMatured: false,
      
      // Additional metadata
      createdAt: flashcard.createdAt || now,
      updatedAt: now
    };
  }

  /**
   * Calculate next review date and interval based on SM-2 algorithm
   * @param {Object} card - Current card data
   * @param {number} quality - Quality rating (0-5)
   * @returns {Object} - Updated card with new scheduling data
   */
  calculateNextReview(card, quality) {
    const now = new Date();
    let newCard = { ...card };
    
    // Update review statistics
    newCard.lastReviewDate = now;
    newCard.totalReviews += 1;
    newCard.qualityHistory = [...(card.qualityHistory || []), { quality, date: now }];
    
    // Calculate average quality
    const totalQuality = newCard.qualityHistory.reduce((sum, q) => sum + q.quality, 0);
    newCard.averageQuality = totalQuality / newCard.qualityHistory.length;
    
    // Update streaks
    if (quality >= 3) {
      newCard.correctStreak += 1;
    } else {
      newCard.correctStreak = 0;
      newCard.incorrectCount += 1;
    }
    
    // SM-2 Algorithm Implementation
    if (quality >= 3) {
      // Correct response
      if (newCard.repetitionNumber === 0) {
        newCard.interval = this.INITIAL_INTERVAL;
      } else if (newCard.repetitionNumber === 1) {
        newCard.interval = this.SECOND_INTERVAL;
      } else {
        newCard.interval = Math.round(newCard.interval * newCard.easinessFactor);
      }
      newCard.repetitionNumber += 1;
    } else {
      // Incorrect response - reset to beginning
      newCard.repetitionNumber = 0;
      newCard.interval = this.INITIAL_INTERVAL;
    }
    
    // Update easiness factor
    const newEF = newCard.easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    newCard.easinessFactor = Math.max(newEF, this.MIN_EASINESS_FACTOR);
    
    // Calculate next review date
    const nextReview = new Date(now);
    nextReview.setDate(nextReview.getDate() + newCard.interval);
    newCard.nextReviewDate = nextReview;
    
    // Update learning stages
    newCard.isNew = false;
    newCard.isLearning = newCard.repetitionNumber < 2;
    newCard.isReview = newCard.repetitionNumber >= 2 && !newCard.isMatured;
    newCard.isMatured = newCard.repetitionNumber >= 5 && newCard.averageQuality >= 4;
    
    newCard.updatedAt = now;
    
    return newCard;
  }

  /**
   * Get cards that are due for review
   * @param {Array} cards - Array of flashcards
   * @returns {Array} - Cards due for review, sorted by priority
   */  getDueCards(cards) {
    const now = new Date();
    
    const dueCards = cards.filter(card => {
      // Exclude mastered cards from due cards
      if (card.mastered === true) {
        return false;
      }
      
      if (!card.nextReviewDate) {
        return true; // New cards - always include in review mode
      }
      
      // Use helper function to convert timestamps
      const reviewDate = this.convertTimestampToDate(card.nextReviewDate);
      return reviewDate <= now;
    });// Sort by priority: new cards first, then by next review date
    return dueCards.sort((a, b) => {
      // New cards have highest priority
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;
      
      // Learning cards have higher priority than review cards
      if (a.isLearning && !b.isLearning) return -1;
      if (!a.isLearning && b.isLearning) return 1;
      
      // Sort by next review date (overdue cards first)
      const aDate = this.convertTimestampToDate(a.nextReviewDate) || new Date(0);
      const bDate = this.convertTimestampToDate(b.nextReviewDate) || new Date(0);
      
      return aDate - bDate;
    });
  }

  /**
   * Get recommended study session cards
   * @param {Array} cards - Array of flashcards
   * @param {number} maxCards - Maximum number of cards for session
   * @param {boolean} includeReview - Include review cards
   * @param {boolean} includeNew - Include new cards
   * @returns {Array} - Recommended cards for study session
   */
  getStudySession(cards, maxCards = 20, includeReview = true, includeNew = true) {
    let studyCards = [];
    
    // Get due cards first
    const dueCards = this.getDueCards(cards);
    
    // Filter by preferences
    const filteredDue = dueCards.filter(card => {
      if (card.isNew && !includeNew) return false;
      if (!card.isNew && !includeReview) return false;
      return true;
    });
    
    // Add due cards up to the limit
    studyCards = filteredDue.slice(0, maxCards);
      // If we have space and want new cards, add some new cards
    if (studyCards.length < maxCards && includeNew) {
      const newCards = cards
        .filter(card => card.isNew && !studyCards.includes(card) && card.mastered !== true)
        .slice(0, maxCards - studyCards.length);
      
      studyCards = [...studyCards, ...newCards];
    }
    
    return studyCards;
  }
  /**
   * Get statistics for the spaced repetition system
   * @param {Array} cards - Array of flashcards
   * @returns {Object} - Statistics object
   */
  getStatistics(cards) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
      // Debug log to check mastered cards (using correct property)
    const masteredCards = cards.filter(c => c.mastered === true);
    console.log('Mastered cards found:', masteredCards.length, masteredCards);    const stats = {
      total: cards.length,
      new: cards.filter(c => c.isNew && c.mastered !== true).length,
      learning: cards.filter(c => c.isLearning && c.mastered !== true).length,
      review: cards.filter(c => c.isReview && c.mastered !== true).length,
      matured: cards.filter(c => c.mastered === true).length,
        dueToday: cards.filter(c => {
        // Exclude mastered cards from due today count
        if (c.mastered === true) return false;
        
        if (!c.nextReviewDate) return c.isNew;
        const reviewDate = this.convertTimestampToDate(c.nextReviewDate);
        return reviewDate <= tomorrow;
      }).length,
        overdue: cards.filter(c => {
        // Exclude mastered cards from overdue count
        if (c.mastered === true) return false;
        
        if (!c.nextReviewDate) return false;
        const reviewDate = this.convertTimestampToDate(c.nextReviewDate);
        return reviewDate < today;
      }).length,
      
      averageEasiness: cards.length > 0 
        ? cards.reduce((sum, c) => sum + (c.easinessFactor || 2.5), 0) / cards.length 
        : 2.5,
      
      averageInterval: cards.length > 0 
        ? cards.reduce((sum, c) => sum + (c.interval || 1), 0) / cards.length 
        : 1,
      
      retentionRate: cards.length > 0 
        ? cards.filter(c => c.averageQuality >= 3).length / cards.length * 100
        : 0,
      
      studyStreak: this.calculateStudyStreak(cards)
    };
    
    return stats;
  }
  /**
   * Calculate study streak (days in a row of reviews)
   * @param {Array} cards - Array of flashcards
   * @returns {number} - Study streak in days
   */
  calculateStudyStreak(cards) {
    // This is a simplified implementation
    // In a real app, you'd track daily study sessions
    const reviewDates = cards
      .filter(c => c.lastReviewDate)
      .map(c => this.convertTimestampToDate(c.lastReviewDate))
      .sort((a, b) => b - a);
    
    if (reviewDates.length === 0) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = new Date(today);
    
    for (let i = 0; i < 30; i++) { // Check last 30 days max
      const hasReview = reviewDates.some(date => {
        const reviewDay = new Date(date);
        reviewDay.setHours(0, 0, 0, 0);
        return reviewDay.getTime() === currentDate.getTime();
      });
      
      if (hasReview) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  }
  /**
   * Export user's learning progress
   * @param {Array} cards - Array of flashcards
   * @returns {Object} - Progress data for export
   */
  exportProgress(cards) {
    return {
      exportDate: new Date(),
      totalCards: cards.length,
      statistics: this.getStatistics(cards),
      cardProgress: cards.map(card => ({
        id: card.id,
        frontText: card.frontText,
        backText: card.backText,
        easinessFactor: card.easinessFactor,
        repetitionNumber: card.repetitionNumber,
        interval: card.interval,
        nextReviewDate: card.nextReviewDate,
        averageQuality: card.averageQuality,
        totalReviews: card.totalReviews,
        isMatured: card.isMatured
      }))
    };
  }

  /**
   * Get quality rating suggestions for UI
   * @returns {Array} - Array of quality rating options
   */
  getQualityRatingOptions() {
    return [
      {
        value: this.QUALITY_RATINGS.AGAIN,
        label: 'Again',
        description: 'Complete blackout',
        color: 'bg-red-500',
        interval: '< 1 day'
      },
      {
        value: this.QUALITY_RATINGS.HARD,
        label: 'Hard',
        description: 'Difficult to remember',
        color: 'bg-orange-500',
        interval: '1-3 days'
      },
      {
        value: this.QUALITY_RATINGS.GOOD,
        label: 'Good',
        description: 'Some effort required',
        color: 'bg-yellow-500',
        interval: '3-7 days'
      },
      {
        value: this.QUALITY_RATINGS.EASY,
        label: 'Easy',
        description: 'Perfect recall',
        color: 'bg-green-500',
        interval: '1-2 weeks'
      }
    ];
  }
}

// Create a singleton instance
const spacedRepetitionService = new SpacedRepetitionService();

export default spacedRepetitionService;
export { spacedRepetitionService };
