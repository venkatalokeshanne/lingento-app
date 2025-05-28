# Translation Service - Free Tier Optimization

This document outlines the optimization features implemented to help you make the most of DeepL's free tier in your Lingento vocabulary app.

## 🎯 Key Optimizations

### 1. **Smart Text Validation**
- Filters out spaces, numbers, and special characters
- Only translates meaningful text with actual letters
- Minimum 2-character requirement for translation

### 2. **Enhanced Caching System**
- Persistent cache storage in localStorage
- Automatic cache saving every minute
- Cache hit rate tracking
- Prevents duplicate API calls for same text

### 3. **Expanded Common Word Mappings**
- Pre-defined translations for 25+ common words per language
- Covers French, Spanish, German, Italian, and Portuguese
- Includes greetings, colors, basic nouns, and everyday words
- Zero API calls for mapped words

### 4. **Intelligent Debouncing**
- Increased to 1.5 seconds to reduce rapid API calls
- Only triggers after user stops typing
- Cancels pending requests if user continues typing

### 5. **Usage Monitoring**
- Real-time API call tracking
- Daily usage statistics
- Cache hit rate monitoring
- Visual usage warnings

## 📊 Usage Monitor Features

The Translation Usage Monitor (bottom-left corner) shows:
- **API Calls Today**: Number of actual DeepL API requests
- **Cache Hits**: Translations served from cache/common words
- **Cache Hit Rate**: Percentage of requests avoiding API calls
- **Usage Bar**: Visual indication of daily progress

### Color Coding:
- 🟢 **Green (0-50%)**: Safe usage level
- 🟡 **Yellow (50-80%)**: Moderate usage
- 🔴 **Red (80-100%)**: High usage - consider optimization

## 💡 Tips for Free Tier Management

### 1. **Use Common Words First**
Start with basic vocabulary that's likely in the common word mappings:
- Greetings: bonjour, hola, ciao
- Colors: rouge, azul, verde  
- Numbers: un, dos, tre
- Basic nouns: chat, casa, haus

### 2. **Build Your Vocabulary Gradually**
- Add 10-20 words per day instead of bulk importing
- Focus on high-frequency words you'll actually use
- Check the usage monitor regularly

### 3. **Leverage the Cache**
- Previously translated words use zero API calls
- Cache persists between browser sessions
- Common variations are automatically cached

### 4. **Optimize Your Workflow**
- Type complete words instead of experimenting character by character
- Use the pronunciation field for complex words
- Edit existing words instead of creating duplicates

## 🛠 Technical Implementation

### Cache Strategy
```javascript
// Automatic persistence
- Cache saved to localStorage every 60 seconds
- Cache loaded on service initialization
- LRU eviction after 200 entries

// Cache key format
sourceLanguage-targetLanguage-normalizedText
```

### Validation Rules
```javascript
// Text must pass these checks:
1. Minimum 2 characters
2. Contains actual letters (not just numbers/symbols)
3. Not purely whitespace or punctuation
4. Valid Unicode letter characters
```

### Common Word Mappings
```javascript
// Example French mappings:
'salut' → 'hi'          (0 API calls)
'bonjour' → 'hello'     (0 API calls)  
'maison' → 'house'      (0 API calls)
```

## 📈 Monitoring Your Usage

### Daily Limits (Estimated)
- **DeepL Free**: 500,000 characters/month (~16,666/day)
- **Conservative target**: 500-750 translations/day
- **Alert thresholds**: 500, 750, 1000+ translations

### Console Warnings
The service automatically logs warnings:
```
⚠️ DeepL API: 500 translations today
⚠️ DeepL API: 750 translations today  
🚨 DeepL API: 1000+ translations today!
```

## 🔧 Advanced Features

### Export/Import Cache
```javascript
// Export translations for backup
const cacheData = translateService.exportCacheData();

// Import from backup
translateService.importCacheData(cacheData);
```

### Batch Word Checking
```javascript
// Check multiple words without API calls
const words = ['bonjour', 'chat', 'newword'];
const status = translateService.checkWordsExist(words, 'french');
// Shows which words need translation vs. are cached/common
```

## 📱 User Interface

### Usage Monitor Location
- **Position**: Bottom-left corner
- **Toggle**: Click "API: X" button to expand
- **Updates**: Every 30 seconds

### Indicators
- **Green dot**: Low usage, safe to continue
- **Yellow dot**: Moderate usage, be mindful
- **Red dot**: High usage, consider optimizing

---

**Remember**: The free tier gives you 500,000 characters per month. With these optimizations, you can efficiently build a comprehensive vocabulary while staying well within limits!
