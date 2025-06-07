# Lingento User Guide

Welcome to Lingento, your AI-powered language learning companion! This guide covers all implemented features and helps you maximize your learning experience.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Flashcards System](#flashcards-system)
4. [AI-Powered Quizzes](#ai-powered-quizzes)
5. [Reading Practice](#reading-practice)
6. [Vocabulary Manager](#vocabulary-manager)
7. [Pronunciation Features](#pronunciation-features)
8. [Progress Tracking](#progress-tracking)
9. [Settings & Customization](#settings--customization)
10. [Mobile Features](#mobile-features)
11. [Tips for Effective Learning](#tips-for-effective-learning)
12. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Authentication
Lingento uses Firebase Authentication for secure user management:
- **Sign Up**: Create a new account with email and password
- **Sign In**: Access your existing account
- **Password Reset**: Recover your account via email

### First-Time Setup
After signing in, you'll go through an interactive tutorial:
1. **Welcome Tour**: Learn about the main features
2. **Dashboard Introduction**: Understand your progress tracking
3. **Quick Start**: Begin with your first flashcard session

### Navigation
The app features a clean, intuitive interface with:
- **Dashboard**: Your learning hub with analytics and quick actions
- **Flashcards**: Spaced repetition vocabulary learning
- **Quiz**: AI-powered vocabulary quizzes
- **Reading**: AI-generated texts with click-to-translate
- **Vocabulary**: Complete word management system
- **Settings**: Theme, preferences, and account management

---

## Dashboard Overview

Your dashboard is the central hub powered by comprehensive analytics and progress tracking.

### Key Components

#### Study Analytics
- **Study Streak**: Track consecutive days of learning with streak goals
- **Weekly Summary**: Performance overview with achievements and recommendations
- **Words Learned**: Total vocabulary count with recent additions
- **Quiz Performance**: Average scores and accuracy trends
- **Study Time**: Total and average session duration tracking

#### Progress Visualization
- **Activity Chart**: Interactive chart showing daily study patterns
- **Performance Trends**: Line graphs tracking improvement over time
- **Achievement Badges**: Visual rewards for milestones and consistency
- **Goal Progress**: Visual indicators for daily and weekly targets

#### Quick Actions
- **Continue Learning**: Resume your last study session
- **Start Quiz**: Jump into AI-powered vocabulary practice
- **Review Flashcards**: Practice words due for spaced repetition
- **Add New Words**: Quickly expand your vocabulary

#### Smart Recommendations
The dashboard provides personalized suggestions:
- **Focus Areas**: Topics needing attention based on performance
- **Review Reminders**: Words scheduled for spaced repetition
- **Achievement Goals**: Next badges and milestones to unlock
- **Study Tips**: Contextual advice based on your learning patterns

---

## Flashcards System

Lingento implements the proven SM-2 (SuperMemo 2) spaced repetition algorithm for optimal vocabulary retention.

### SM-2 Spaced Repetition Algorithm

The system intelligently schedules reviews based on your performance using a sophisticated algorithm:

#### Quality Ratings (0-5 scale)
- **5 - Perfect**: Instant and confident recall → Next review in ~13 days
- **4 - Good**: Correct response with hesitation → Next review in ~6 days  
- **3 - Fair**: Correct but difficult recall → Next review in ~6 days
- **2 - Poor**: Incorrect but familiar → Next review in ~1 day
- **1 - Very Poor**: Completely incorrect → Review immediately
- **0 - Complete Blackout**: No recall whatsoever → Review immediately

#### Learning Stages
- **New**: Never studied before
- **Learning**: Recently introduced, frequent reviews
- **Review**: Established in memory, scheduled reviews
- **Matured**: Well-learned, infrequent reviews

### Using Flashcards

#### Card Interface
- **Word Display**: Target language word prominently shown
- **Audio Pronunciation**: AWS Polly-powered pronunciation (click to play)
- **Flip to Reveal**: Shows definition, translation, and examples
- **Quality Rating**: Rate your recall accuracy (0-5 scale)
- **Additional Info**: Etymology, conjugations, and usage notes

#### Session Management
- **Smart Scheduling**: System presents due cards automatically
- **Session Stats**: Track cards studied, accuracy, and time spent
- **Progress Indicators**: See how many cards remain in session
- **Flexible Stopping**: End session anytime with progress saved

#### Advanced Features
- **Conjugation Tables**: Complete verb conjugation with pronunciation
- **Example Sentences**: Real-world usage examples with translations
- **Related Words**: Synonyms, antonyms, and word families
- **Personal Notes**: Add custom memory aids and context

---

## AI-Powered Quizzes

Lingento's quiz system leverages AWS Bedrock AI to create dynamic, personalized vocabulary assessments that adapt to your learning level.

### AI-Generated Content

#### Dynamic Question Creation
- **Contextual Questions**: AI generates questions based on your vocabulary
- **Multiple Formats**: Multiple choice, fill-in-the-blank, and definition matching
- **Adaptive Difficulty**: Questions adjust based on your performance history
- **Real-time Generation**: Fresh questions created for each quiz session

#### Smart Question Types
- **Translation Challenges**: Convert between languages with context
- **Definition Matching**: Match words with AI-generated definitions
- **Contextual Usage**: Use vocabulary in appropriate sentence contexts
- **Pronunciation Guides**: Questions include audio hints and phonetic guides

### Quiz Features

#### Interactive Interface
- **Clean Design**: Distraction-free quiz environment
- **Progress Tracking**: Real-time feedback on quiz progression
- **Immediate Feedback**: Instant results with explanations
- **Audio Integration**: Pronunciation support for all vocabulary

#### Performance Analytics
- **Accuracy Tracking**: Monitor correct answer percentages
- **Time Analysis**: Track response speed improvements
- **Weak Area Identification**: Highlight vocabulary needing focus
- **Progress Trends**: Visualize improvement over time

#### Adaptive Learning
- **Difficulty Adjustment**: AI modifies question complexity based on performance
- **Focus Areas**: Emphasizes challenging vocabulary in future quizzes
- **Spaced Integration**: Quiz results influence flashcard scheduling
- **Personalized Hints**: AI provides contextual clues based on your learning style

---

## Reading Practice

The reading module provides AI-generated texts with interactive translation and vocabulary extraction features.

### AI-Generated Content

#### Dynamic Text Generation
- **AWS Bedrock Integration**: AI creates engaging reading materials
- **Difficulty Adaptation**: Texts match your current proficiency level
- **Topic Variety**: Stories, articles, and conversations across different themes
- **Cultural Context**: Content includes cultural references and authentic language use

#### Interactive Reading Experience
- **Click-to-Translate**: Instant translation of any word or phrase
- **Hover Definitions**: Quick meaning display without disrupting reading flow
- **Audio Support**: Listen to pronunciation while reading
- **Vocabulary Extraction**: Save new words directly to your collection

### Reading Interface

#### Text Display Features
- **Clean Typography**: Optimized for comfortable reading
- **Adjustable Settings**: Font size and line spacing customization
- **Highlighting System**: Mark unfamiliar words for later review
- **Progress Indicators**: Track reading completion and comprehension

#### Vocabulary Integration
- **Seamless Word Addition**: Click words to add to your vocabulary manager
- **Context Preservation**: Saves the sentence context with new words
- **Automatic Categorization**: AI suggests appropriate categories for new vocabulary
- **Spaced Repetition Integration**: New words automatically enter flashcard system

### Learning Benefits
- **Contextual Learning**: See vocabulary used in natural contexts
- **Reading Comprehension**: Develop understanding of sentence structure
- **Cultural Awareness**: Learn about culture through authentic content
- **Vocabulary Expansion**: Discover new words in meaningful contexts

## Vocabulary Manager

Organize and manage your growing vocabulary collection with comprehensive tools and AI-powered features.

### Word Management

#### Adding New Words
- **Manual Entry**: Add words with custom definitions and notes
- **From Reading**: Save words encountered during reading practice with context
- **From Quizzes**: Add missed quiz questions to review collection
- **AI-Powered Suggestions**: Get word recommendations based on your learning level

#### Comprehensive Word Data
Each vocabulary entry includes:
- **Multiple Definitions**: Context-specific meanings and usage
- **Pronunciations**: AWS Polly audio with phonetic transcriptions
- **Example Sentences**: Real-world usage examples in context
- **Related Words**: Synonyms, antonyms, and word families
- **Conjugation Tables**: Complete verb conjugations with audio
- **Personal Notes**: Custom memory aids and learning tips

### Organization and Search

#### Advanced Filtering
- **Category-Based**: Organize by themes (travel, business, daily life)
- **Difficulty Levels**: Filter by learning complexity
- **Learning Status**: New, learning, reviewing, or mastered words
- **Search Functionality**: Find words instantly with smart search

#### Smart Categories
- **Auto-Categorization**: AI suggests appropriate categories
- **Custom Tags**: Create personalized organizational systems
- **Progress-Based Grouping**: Organize by mastery level
- **Context-Based Sorting**: Group by original source (reading, quiz, manual)

### Verb Conjugation System

#### Complete Conjugation Tables
- **All Tenses**: Present, past, future, and complex tenses
- **Person Variations**: First, second, and third person forms
- **Audio for Each Form**: Pronunciation guide for every conjugation
- **Usage Examples**: See conjugations used in context
- **Irregular Highlighting**: Special marking for irregular patterns

#### Practice Integration
- **Conjugation Quizzes**: Test your knowledge of verb forms
- **Flashcard Integration**: Conjugations included in spaced repetition
- **Contextual Practice**: Use conjugations in sentence building
- **Progress Tracking**: Monitor conjugation mastery separately

### Data Management
- **Cloud Sync**: Automatic backup with Firebase integration
- **Export Options**: Download vocabulary for external use
- **Import Capability**: Add vocabulary from external sources
- **Cross-Device Access**: Seamless synchronization across devices

---

## Pronunciation Features

Master pronunciation with AWS Polly-powered speech technology integrated throughout the application.

### Audio Technology
Lingento uses **Amazon Polly** for high-quality, natural-sounding pronunciations:
- **Neural Voices**: Advanced AI voices that sound natural and clear
- **Multiple Languages**: Native speaker voices for supported languages
- **Consistent Quality**: Reliable pronunciation across all vocabulary
- **Fast Loading**: Optimized audio delivery for smooth learning experience

### Integration Points

#### Flashcard Audio
- **Every Word**: All flashcards include pronunciation audio
- **One-Click Playback**: Simple tap/click to hear pronunciation
- **Repeat Function**: Listen multiple times for practice
- **Context Integration**: Audio matches the word in context

#### Vocabulary Manager Audio
- **Comprehensive Coverage**: Audio for all saved vocabulary
- **Conjugation Audio**: Pronunciation for every verb form
- **Example Sentences**: Audio for complete usage examples
- **Related Words**: Pronunciation for synonyms and related terms

#### Reading Support
- **Click-to-Hear**: Any word in reading texts can be pronounced
- **Seamless Integration**: Audio playback doesn't interrupt reading flow
- **Context-Aware**: Pronunciation matches word usage in context
- **Learning Reinforcement**: Hear correct pronunciation while reading

#### Quiz Audio Support
- **Question Audio**: Hear vocabulary during quiz sessions
- **Answer Reinforcement**: Audio feedback for correct answers
- **Pronunciation Hints**: Audio clues to help with difficult questions
- **Comprehensive Review**: Audio playback during quiz review

### Learning Benefits
- **Accurate Pronunciation**: Learn correct pronunciation from native-quality voices
- **Auditory Learning**: Reinforce visual learning with audio
- **Confidence Building**: Practice pronunciation without embarrassment
- **Retention Enhancement**: Audio-visual combination improves memory

---

## Progress Tracking

Monitor your learning journey with comprehensive analytics powered by detailed data collection and visualization.

### Dashboard Analytics

#### Core Metrics
- **Study Streaks**: Track consecutive days of learning with visual streak counters
- **Words Learned**: Total vocabulary count with daily additions tracking
- **Quiz Performance**: Average scores, accuracy rates, and improvement trends
- **Study Time**: Session duration tracking and total time invested
- **Achievement Progress**: Badge system with milestone celebrations

#### Visual Analytics
- **Activity Charts**: Interactive graphs showing daily study patterns
- **Performance Trends**: Line charts tracking accuracy improvements
- **Progress Bars**: Visual indicators for goals and achievements
- **Heat Maps**: Study consistency patterns over time
- **Weekly Summaries**: Comprehensive progress reports with insights

### Spaced Repetition Analytics

#### Card Performance Tracking
- **Individual Word Progress**: Detailed statistics for each vocabulary item
- **Retention Rates**: Success rates for different review intervals
- **Difficulty Analysis**: Identification of challenging vocabulary
- **Learning Stages**: Distribution of words across learning phases (new, learning, review, matured)

#### Algorithm Insights
- **Review Scheduling**: See when cards are due for optimal review
- **Quality Rating Patterns**: Track your self-assessment accuracy
- **Interval Progression**: Monitor how review intervals increase with mastery
- **Reset Tracking**: Identify words that frequently need relearning

### Achievement System

#### Badge Categories
- **Consistency Badges**: Rewards for maintaining study streaks
- **Milestone Badges**: Achievements for vocabulary count milestones
- **Performance Badges**: Recognition for quiz accuracy achievements
- **Special Challenges**: Limited-time achievement opportunities

#### Goal Setting and Tracking
- **Daily Goals**: Set and monitor daily study targets
- **Weekly Objectives**: Plan and track weekly learning goals
- **Custom Milestones**: Create personalized achievement targets
- **Progress Visualization**: Clear indicators of goal completion status

### Data Insights
- **Learning Patterns**: Identify your most productive study times
- **Weak Areas**: Pinpoint vocabulary categories needing focus
- **Improvement Trends**: Track skill development over time
- **Efficiency Metrics**: Monitor learning speed and retention effectiveness

---

## Settings & Customization

Personalize your Lingento experience with comprehensive customization options.

### Theme and Display

#### Theme Options
- **Light Mode**: Clean, bright interface optimized for daytime study
- **Dark Mode**: Reduced eye strain for evening learning sessions
- **System Theme**: Automatically match your device's theme preference
- **Smooth Transitions**: Animated theme switching powered by Framer Motion

#### Visual Customization
- **Modern Design**: Clean, minimalist interface focused on learning
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Accessibility Features**: High contrast and readable typography options
- **Animation Preferences**: Control motion and transition effects

### User Preferences

#### Account Management
- **Profile Settings**: Manage your account information and preferences
- **Authentication**: Secure login with Firebase Authentication
- **Data Privacy**: Control your learning data and privacy settings
- **Account Security**: Password management and security options

#### Learning Preferences
- **Study Goals**: Set daily and weekly learning targets
- **Notification Settings**: Configure study reminders and achievements
- **Language Preferences**: Interface language and target language settings
- **Tutorial Controls**: Reset onboarding tutorials and help guides

### Data and Storage

#### Cloud Synchronization
- **Firebase Integration**: Automatic cloud backup of all progress
- **Cross-Device Sync**: Access your progress from any device
- **Real-time Updates**: Instant synchronization of study sessions
- **Data Security**: Encrypted storage and secure data transmission

#### Privacy Controls
- **Data Management**: View and control your stored learning data
- **Export Options**: Download your progress for backup purposes
- **Account Deletion**: Remove your account and data if needed
- **Analytics Opt-out**: Control usage data collection preferences

---

## Mobile Features

Lingento is fully optimized for mobile learning with responsive design and touch-friendly interactions.

### Responsive Design

#### Mobile-First Architecture
- **Next.js 14 Optimization**: Built with modern web technologies for optimal mobile performance
- **Tailwind CSS**: Responsive design system ensuring consistent experience across devices
- **Touch-Optimized Interface**: All interactions designed for touchscreen devices
- **Fast Loading**: Optimized bundle sizes and efficient loading strategies

#### Cross-Device Compatibility
- **Progressive Web App**: Install on mobile devices for app-like experience
- **Offline Capabilities**: Core features work without internet connection
- **Cross-Device Sync**: Seamless progress synchronization via Firebase
- **Adaptive Layout**: Interface adjusts automatically to screen size

### Touch Interactions

#### Flashcard Navigation
- **Tap to Flip**: Simple tap to reveal flashcard answers
- **Swipe Gestures**: Intuitive swiping for card navigation
- **Touch-Friendly Buttons**: Large, accessible buttons for rating performance
- **Smooth Animations**: Framer Motion animations enhance mobile experience

#### Mobile-Specific Features
- **Responsive Quiz Interface**: Touch-optimized question answering
- **Mobile Reading Mode**: Optimized text display for smaller screens
- **Gesture-Based Navigation**: Natural mobile navigation patterns
- **Quick Access Buttons**: Easy-to-reach action buttons

### Performance Optimization
- **Fast Rendering**: Optimized React components for smooth mobile performance
- **Efficient Data Loading**: Smart data fetching to minimize mobile data usage
- **Battery Optimization**: Efficient code that doesn't drain device battery
- **Smooth Scrolling**: Native mobile scrolling experience

---

## Tips for Effective Learning

Maximize your language learning success with these evidence-based strategies that work with Lingento's features.

### Spaced Repetition Best Practices

#### Honest Self-Assessment
- **Rate Accurately**: Use the 0-5 scale honestly to optimize the SM-2 algorithm
- **Consider Context**: Rate based on real-world recall ability, not just recognition
- **Don't Rush**: Take time to properly assess your knowledge before rating
- **Track Patterns**: Notice which words consistently challenge you

#### Consistent Study Habits
- **Daily Practice**: Even 10-15 minutes daily is more effective than long weekly sessions
- **Regular Schedule**: Study at the same time each day to build a habit
- **Honor Reviews**: Don't skip cards that are due for review
- **Quality Focus**: Better to study fewer cards thoroughly than many superficially

### Maximizing AI Features

#### Quiz Strategy
- **Embrace Difficulty**: Use challenging quizzes to identify knowledge gaps
- **Learn from Mistakes**: Review incorrect answers and add challenging words to vocabulary
- **Contextual Practice**: Pay attention to how words are used in different contexts
- **Regular Assessment**: Use quizzes to gauge progress and adjust study focus

#### Reading Optimization
- **Active Reading**: Use click-to-translate feature to explore new vocabulary
- **Context Learning**: Notice how familiar words are used in new contexts
- **Vocabulary Integration**: Add interesting words from texts to your collection
- **Cultural Awareness**: Pay attention to cultural references and authentic language use

### Memory Enhancement Techniques

#### Cognitive Strategies
- **Elaborative Processing**: Think deeply about word meanings and connections
- **Visual Associations**: Create mental images for new vocabulary
- **Personal Connections**: Relate new words to your own experiences
- **Story Creation**: Build narratives using new vocabulary

#### Using Lingento's Features
- **Conjugation Practice**: Study complete verb tables, not just infinitives
- **Audio Reinforcement**: Always listen to pronunciations while studying
- **Context Examples**: Read example sentences to understand natural usage
- **Related Words**: Explore synonyms and antonyms to build word networks

### Building Long-Term Success

#### Goal Setting
- **Realistic Targets**: Set achievable daily and weekly goals
- **Progress Celebration**: Use the achievement system to stay motivated
- **Streak Building**: Maintain study streaks for habit formation
- **Regular Review**: Check dashboard analytics to monitor improvement

#### Learning Community
- **Progress Sharing**: Share achievements to maintain accountability
- **Consistent Engagement**: Regular interaction with the app builds learning momentum
- **Feature Exploration**: Try all features to find what works best for your learning style
- **Patience and Persistence**: Language learning is gradual - trust the process

---

## Troubleshooting

Common issues and their solutions to ensure smooth learning experience.

### Technical Issues

#### Authentication Problems
**Issue**: Cannot sign in or create account
- **Check**: Internet connection and Firebase service status
- **Solution**: Clear browser cache and cookies
- **Alternative**: Try incognito/private browsing mode
- **Contact**: Support if problem persists

#### Audio Issues
**Issue**: Pronunciation audio not playing
- **Check**: Device volume and browser audio permissions
- **Solution**: Refresh page or clear browser cache
- **Alternative**: AWS Polly service may be temporarily unavailable
- **Fallback**: Use phonetic transcriptions when available

#### Sync Problems
**Issue**: Progress not saving across devices
- **Check**: Internet connection and Firebase sync status
- **Solution**: Force refresh or re-login to trigger sync
- **Backup**: Export vocabulary as precaution
- **Resolution**: Contact support for persistent sync issues

#### Performance Issues
**Issue**: App running slowly or freezing
- **Solution**: Clear browser cache and restart browser
- **Check**: Available device memory and close other tabs
- **Update**: Ensure you're using a supported, updated browser
- **Alternative**: Try different browser if issues persist

### Learning Issues

#### Spaced Repetition Problems
**Issue**: Too many cards accumulating in review queue
- **Strategy**: Focus on quality ratings over speed
- **Solution**: Study consistently to prevent backlog buildup
- **Management**: Break large review sessions into smaller chunks
- **Algorithm**: Trust the system - it will balance over time

**Issue**: Cards appearing too frequently or infrequently
- **Check**: Your rating accuracy and honesty
- **Adjustment**: The SM-2 algorithm adapts based on your performance patterns
- **Reset**: Individual problematic cards can be reset if needed
- **Patience**: Algorithm needs time to learn your retention patterns

#### AI Feature Issues
**Issue**: Quiz questions seem inappropriate or incorrect
- **Report**: Note specific issues for improvement
- **Context**: AI generates content based on your vocabulary level
- **Feedback**: System improves with usage data
- **Alternative**: Focus on flashcard review if quiz issues persist

**Issue**: Reading texts too difficult or easy
- **Adaptation**: AI adjusts difficulty based on your interactions
- **Engagement**: Click-to-translate words to signal difficulty level
- **Time**: System learns your level through continued use
- **Manual**: Add vocabulary manually to influence content generation

### Data and Account Issues

#### Vocabulary Management
**Issue**: Lost vocabulary or progress
- **Prevention**: Regular use ensures automatic cloud backup
- **Recovery**: Check if signed into correct account
- **Sync**: Force sync from settings if recently added words are missing
- **Support**: Contact for data recovery assistance

#### Browser Compatibility
**Issue**: Features not working properly
- **Requirements**: Use modern browsers (Chrome, Firefox, Safari, Edge)
- **JavaScript**: Ensure JavaScript is enabled
- **Updates**: Keep browser updated to latest version
- **Extensions**: Disable ad blockers or extensions that might interfere

#### Mobile Issues
**Issue**: Touch interactions not responsive
- **Refresh**: Reload the page or restart the browser app
- **Zoom**: Ensure page isn't zoomed in/out inappropriately
- **Orientation**: Some features work better in portrait mode
- **Browser**: Try different mobile browser if issues persist

### Getting Additional Help
- **Documentation**: Review this user guide for detailed feature explanations
- **Updates**: Check for app updates or announcements
- **Community**: Connect with other users for tips and solutions
- **Support**: Contact technical support for persistent issues that aren't resolved by these troubleshooting steps

---

## Technical Architecture

Lingento is built with modern web technologies for optimal performance and reliability.

### Core Technologies
- **Next.js 14**: React framework with App Router for optimal performance
- **Firebase**: Authentication, database, and cloud storage
- **AWS Bedrock**: AI-powered content generation and language processing
- **AWS Polly**: High-quality text-to-speech for pronunciation
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Framer Motion**: Smooth animations and transitions

### AI Integration
- **Smart Content Generation**: AI creates personalized quizzes and reading materials
- **Adaptive Learning**: System adjusts difficulty based on your performance
- **Natural Language Processing**: Advanced text analysis for vocabulary extraction
- **Pronunciation Support**: Neural voice synthesis for accurate pronunciation

### Data Security
- **Encrypted Storage**: All user data is securely encrypted
- **Firebase Security**: Industry-standard authentication and data protection
- **Privacy First**: No personal data sharing with third parties
- **GDPR Compliant**: Full compliance with data protection regulations

---

## Getting Help and Support

### In-App Resources
- **Tutorial System**: Interactive onboarding and feature tutorials
- **Contextual Help**: Feature-specific guidance throughout the app
- **Progress Analytics**: Built-in tools to monitor your learning journey
- **Achievement System**: Motivation through badges and milestones

### Community and Updates
- **Regular Updates**: Continuous improvement based on user feedback
- **Feature Announcements**: Stay informed about new capabilities
- **Learning Community**: Connect with other language learners
- **Best Practices**: Shared tips and strategies for effective learning

---

*Happy Learning with Lingento! 🎉*

> **Remember**: Consistency is key to language learning success. Even 10-15 minutes of daily practice with Lingento's spaced repetition system will yield better results than occasional long study sessions. Trust the algorithm, be honest in your self-assessments, and celebrate your progress along the way.

### Quick Start Checklist
✅ **Sign up** and complete the tutorial  
✅ **Add your first words** to the vocabulary manager  
✅ **Study flashcards** for 10-15 minutes daily  
✅ **Take quizzes** to test your knowledge  
✅ **Read AI-generated texts** and click unknown words  
✅ **Check your dashboard** to track progress  
✅ **Maintain your study streak** for consistent learning  

Start your language learning journey today with Lingento's AI-powered tools and scientifically-proven spaced repetition system!
