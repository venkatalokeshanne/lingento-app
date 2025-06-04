// Shared constants for the Lingento app

export const LANGUAGES = [
  { value: 'french', label: 'French', flag: '🇫🇷' },
  { value: 'spanish', label: 'Spanish', flag: '🇪🇸' },
  { value: 'german', label: 'German', flag: '🇩🇪' },
  { value: 'italian', label: 'Italian', flag: '🇮🇹' },
  { value: 'portuguese', label: 'Portuguese', flag: '🇵🇹' },
  { value: 'russian', label: 'Russian', flag: '🇷🇺' },
  { value: 'chinese', label: 'Chinese', flag: '🇨🇳' },
  { value: 'japanese', label: 'Japanese', flag: '🇯🇵' },
  { value: 'korean', label: 'Korean', flag: '🇰🇷' },
  { value: 'arabic', label: 'Arabic', flag: '🇸🇦' },
  { value: 'hindi', label: 'Hindi', flag: '🇮🇳' },
  { value: 'dutch', label: 'Dutch', flag: '🇳🇱' },
  { value: 'polish', label: 'Polish', flag: '🇵🇱' },
  { value: 'turkish', label: 'Turkish', flag: '🇹🇷' },
  { value: 'swedish', label: 'Swedish', flag: '🇸🇪' },
  { value: 'norwegian', label: 'Norwegian', flag: '🇳🇴' },
  { value: 'danish', label: 'Danish', flag: '🇩🇰' },
  { value: 'finnish', label: 'Finnish', flag: '🇫🇮' },
  { value: 'greek', label: 'Greek', flag: '🇬🇷' },
  { value: 'hebrew', label: 'Hebrew', flag: '🇮🇱' },
  { value: 'thai', label: 'Thai', flag: '🇹🇭' },
  { value: 'vietnamese', label: 'Vietnamese', flag: '🇻🇳' },
];

export const NATIVE_LANGUAGES = [
  { value: 'english', label: 'English', flag: '🇺🇸' },
  { value: 'spanish', label: 'Spanish', flag: '🇪🇸' },
  { value: 'french', label: 'French', flag: '🇫🇷' },
  { value: 'german', label: 'German', flag: '🇩🇪' },
  { value: 'italian', label: 'Italian', flag: '🇮🇹' },
  { value: 'portuguese', label: 'Portuguese', flag: '🇵🇹' },
  { value: 'chinese', label: 'Chinese', flag: '🇨🇳' },
  { value: 'japanese', label: 'Japanese', flag: '🇯🇵' },
  { value: 'korean', label: 'Korean', flag: '🇰🇷' },
  { value: 'arabic', label: 'Arabic', flag: '🇸🇦' },
  { value: 'hindi', label: 'Hindi', flag: '🇮🇳' },
  { value: 'dutch', label: 'Dutch', flag: '🇳🇱' },
  { value: 'russian', label: 'Russian', flag: '🇷🇺' },
  { value: 'polish', label: 'Polish', flag: '🇵🇱' },
  { value: 'turkish', label: 'Turkish', flag: '🇹🇷' },
];

export const LEVELS = [
  { value: 'beginner', label: 'Beginner', description: 'Just starting out', emoji: '🌱' },
  { value: 'elementary', label: 'Elementary', description: 'Basic words and phrases', emoji: '📚' },
  { value: 'intermediate', label: 'Intermediate', description: 'Comfortable with basics', emoji: '🚀' },
  { value: 'upper-intermediate', label: 'Upper Intermediate', description: 'Complex conversations', emoji: '⭐' },
  { value: 'advanced', label: 'Advanced', description: 'Near fluent', emoji: '🏆' },
  { value: 'proficient', label: 'Proficient', description: 'Native-like fluency', emoji: '👑' },
];

// Helper function to get language by value
export const getLanguageByValue = (value) => {
  return LANGUAGES.find(lang => lang.value === value) || null;
};

// Helper function to get native language by value
export const getNativeLanguageByValue = (value) => {
  return NATIVE_LANGUAGES.find(lang => lang.value === value) || null;
};

// Helper function to get level by value
export const getLevelByValue = (value) => {
  return LEVELS.find(level => level.value === value) || null;
};

// Function to check if a language is supported
export const isLanguageSupported = (language) => {
  return LANGUAGES.some(lang => lang.value === language);
};

// Default language fallback when no language is selected
export const DEFAULT_FALLBACK_LANGUAGE = 'english';
