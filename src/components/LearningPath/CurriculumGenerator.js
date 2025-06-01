'use client';

import {bedrockService} from '@/services/bedrockService';

class CurriculumGenerator {
  static async generateCurriculum({ language, level, nativeLanguage, dailyGoal, customizations }) {
    try {
      const prompt = this.buildCurriculumPrompt({
        language,
        level,
        nativeLanguage,
        dailyGoal,
        customizations
      });

      const response = await bedrockService.generateText(prompt);
      const curriculum = this.parseCurriculumResponse(response);
      
      return {
        ...curriculum,
        generatedAt: new Date().toISOString(),
        language,
        level,
        preferences: { language, level, nativeLanguage, dailyGoal },
        customizations
      };
    } catch (error) {
      console.error('Error generating curriculum:', error);
      // Return a fallback curriculum structure
      return this.getFallbackCurriculum({ language, level, dailyGoal });
    }
  }
  static buildCurriculumPrompt({ language, level, nativeLanguage, dailyGoal, customizations }) {
    const focusAreasText = customizations.focusAreas.length > 0 
      ? `with special focus on: ${customizations.focusAreas.join(', ')}` 
      : '';

    const levelCode = this.getLevelCode(level);
    const languageFlag = this.getLanguageFlag(language);    return `Create a comprehensive, detailed CEFR-compliant language learning syllabus for ${language} at ${level} level.

Student Profile:
- Current Level: ${level}
- Native Language: ${nativeLanguage}
- Daily Goal: ${dailyGoal} words per day
- Learning Style: ${customizations.learningStyle}
- Pacing: ${customizations.pacing}
- Difficulty Preference: ${customizations.difficulty}
${focusAreasText}

Create a detailed syllabus following this exact structure with emojis and comprehensive breakdowns:

${languageFlag} ${language} ${level} Full Syllabus (CEFR Level ${level})

🗣️ SPEAKING (Expression Orale)
Functions:
- [List 8-10 specific speaking functions with example phrases]
- Include: greetings, personal information, likes/dislikes, simple questions, daily routine, requests, etc.

👂 LISTENING (Compréhension Orale)
Can understand:
- [List 6-8 specific listening skills]
- Include: slow clear speech, basic conversations, numbers/dates/prices, announcements, etc.

Practice includes:
- [List 4-6 practical listening activities]

📖 READING (Compréhension Écrite)
Can understand:
- [List 6-8 reading comprehension skills]
- Include: notices, signs, simple texts, forms, schedules, etc.

Text types:
- [List 6-8 specific text types]

✍️ WRITING (Expression Écrite)
Tasks:
- [List 6-8 writing tasks]
- Include: forms, emails, descriptions, messages, etc.

Focus on:
- [List 4-6 writing focus areas]

📚 VOCABULARY (Lexique)
Themes:
- [List 12-15 vocabulary themes with 10-15 words each]
- Include: personal identity, family, numbers, time, colors, food, daily routine, places, shopping, home, body, countries, etc.

🧠 GRAMMAR (Grammaire)
Break down into sections with emojis:
🔤 Nouns & Articles:
- [Detailed grammar points for nouns and articles]

👤 Pronouns:
- [Detailed pronoun rules and examples]

🧾 Verbs:
- [Comprehensive verb conjugation and usage]

🚫 Negation:
- [Negation rules and examples]

❓ Questions:
- [Question formation rules and examples]

📌 Adjectives:
- [Adjective agreement and position rules]

📍 Prepositions:
- [Common prepositions of place and time]

🔗 Connectors:
- [Basic connecting words]

🗺️ CULTURE (Culture et Société)
Topics:
- [List 6-8 cultural topics relevant to the language and level]

Format this as a comprehensive JSON object with the following structure:
{
  "title": "${languageFlag} ${language} ${level} Full Syllabus (CEFR Level ${level})",
  "description": "Comprehensive CEFR-compliant curriculum",
  "estimatedWeeks": [number],
  "skills": {
    "speaking": {
      "emoji": "🗣️",
      "title": "SPEAKING (Expression Orale)",
      "functions": [array of specific functions with examples],
      "communicativeTasks": [array of tasks]
    },
    "listening": {
      "emoji": "👂",
      "title": "LISTENING (Compréhension Orale)",
      "canUnderstand": [array of listening skills],
      "practiceActivities": [array of practice types]
    },
    "reading": {
      "emoji": "📖", 
      "title": "READING (Compréhension Écrite)",
      "canUnderstand": [array of reading skills],
      "textTypes": [array of text types]
    },
    "writing": {
      "emoji": "✍️",
      "title": "WRITING (Expression Écrite)", 
      "tasks": [array of writing tasks],
      "focusAreas": [array of focus areas]
    }
  },
  "vocabulary": {
    "emoji": "📚",
    "title": "VOCABULARY (Lexique)",
    "themes": [
      {
        "theme": "theme name",
        "words": [array of 10-15 words],
        "examples": [optional example phrases]
      }
    ]
  },
  "grammar": {
    "emoji": "🧠",
    "title": "GRAMMAR (Grammaire)",
    "sections": [
      {
        "emoji": "🔤",
        "title": "Nouns & Articles",
        "points": [array of grammar points]
      },
      {
        "emoji": "👤", 
        "title": "Pronouns",
        "points": [array of grammar points]
      },
      {
        "emoji": "🧾",
        "title": "Verbs", 
        "points": [array of grammar points]
      },
      {
        "emoji": "🚫",
        "title": "Negation",
        "points": [array of grammar points]
      },
      {
        "emoji": "❓",
        "title": "Questions",
        "points": [array of grammar points]
      },
      {
        "emoji": "📌",
        "title": "Adjectives",
        "points": [array of grammar points]
      },
      {
        "emoji": "📍",
        "title": "Prepositions", 
        "points": [array of grammar points]
      },
      {
        "emoji": "🔗",
        "title": "Connectors",
        "points": [array of grammar points]
      }
    ]
  },
  "culture": {
    "emoji": "🗺️",
    "title": "CULTURE (Culture et Société)",
    "topics": [array of cultural topics]
  },
  "modules": [
    {
      "id": "module_1",
      "title": "Module Title",
      "description": "Module description",
      "objectives": [learning objectives],
      "vocabularyThemes": [themes covered],
      "grammarPoints": [grammar covered],
      "activities": [practice activities],
      "estimatedTime": "time estimate",
      "difficulty": "level",
      "skillsFocus": ["speaking", "listening", "reading", "writing"]
    }
  ],
  "milestones": [achievement milestones],
  "dailyRecommendations": {daily study plan},
  "assessmentMethods": [assessment types]
}

Make this specific to ${language} ${level} level with authentic, practical content. Include proper ${language} phrases and examples throughout.

JSON Response:`;
  }

  static parseCurriculumResponse(response) {
    try {
      // Try to parse the JSON response from the AI
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error parsing AI response:', error);
    }

    // If parsing fails, extract information manually and structure it
    return this.extractCurriculumFromText(response);
  }

  static extractCurriculumFromText(text) {
    // Fallback parsing logic to extract curriculum information from unstructured text
    const modules = [];
    const lines = text.split('\n');
    
    let currentModule = null;
    let moduleCount = 0;

    for (const line of lines) {
      const cleanLine = line.trim();
      
      // Look for module headers
      if (cleanLine.match(/^(Module|Unit|Chapter|Lesson)\s*\d+/i) || 
          cleanLine.match(/^\d+\.\s*[A-Z]/)) {
        if (currentModule) {
          modules.push(currentModule);
        }
        
        moduleCount++;
        currentModule = {
          id: `module_${moduleCount}`,
          title: cleanLine.replace(/^(Module|Unit|Chapter|Lesson)\s*\d+:?\s*/i, ''),
          description: '',
          objectives: [],
          vocabulary: [],
          grammar: [],
          activities: [],
          estimatedTime: '1-2 weeks',
          difficulty: 'intermediate',
          prerequisites: []
        };
      }
      
      // Extract content for current module
      if (currentModule) {
        if (cleanLine.match(/^(objective|goal)/i)) {
          currentModule.objectives.push(cleanLine.replace(/^(objective|goal):?\s*/i, ''));
        } else if (cleanLine.match(/^(vocabulary|words)/i)) {
          const vocabMatch = cleanLine.match(/:\s*(.+)$/);
          if (vocabMatch) {
            currentModule.vocabulary = vocabMatch[1].split(',').map(w => w.trim());
          }
        } else if (cleanLine.match(/^(grammar|structure)/i)) {
          currentModule.grammar.push(cleanLine.replace(/^(grammar|structure):?\s*/i, ''));
        }
      }
    }

    if (currentModule) {
      modules.push(currentModule);
    }

    return {
      title: `Structured ${modules.length}-Module Learning Path`,
      description: 'AI-generated personalized curriculum',
      estimatedWeeks: modules.length * 2,
      modules: modules.length > 0 ? modules : this.getDefaultModules(),
      milestones: this.generateMilestones(modules.length),
      dailyRecommendations: this.getDailyRecommendations(),
      assessmentMethods: ['Weekly quizzes', 'Module completion tests', 'Speaking practice sessions']
    };
  }
  static getDefaultModules() {
    return [
      {
        id: 'module_1',
        title: '🤝 First Contact',
        description: 'Essential greetings, introductions, and basic politeness',
        objectives: [
          'Master basic greetings and farewells',
          'Introduce yourself and others',
          'Use basic politeness expressions',
          'Exchange personal information'
        ],
        vocabularyThemes: ['Personal Identity', 'Numbers and Time', 'Family and Relationships'],
        grammarPoints: ['Subject pronouns', 'Present tense of "to be"', 'Basic question formation'],
        activities: [
          'Greeting role-plays',
          'Personal introduction practice',
          'Number recognition games',
          'Family tree creation'
        ],
        estimatedTime: '1-2 weeks',
        difficulty: 'beginner',
        skillsFocus: ['speaking', 'listening'],
        culturalTopics: ['Basic etiquette and social norms', 'Greeting customs']
      },
      {
        id: 'module_2',
        title: '👤 Personal World',
        description: 'Describing yourself, family, and personal preferences',
        objectives: [
          'Describe physical appearance and personality',
          'Talk about family members and relationships',
          'Express likes and dislikes',
          'Share personal information confidently'
        ],
        vocabularyThemes: ['Family and Relationships', 'Colors and Shapes', 'Personal Identity'],
        grammarPoints: ['Adjectives and agreement', 'Possessive adjectives', 'Present tense verbs'],
        activities: [
          'Family description exercises',
          'Personality trait matching',
          'Preference surveys',
          'Personal profile creation'
        ],
        estimatedTime: '2 weeks',
        difficulty: 'beginner',
        skillsFocus: ['speaking', 'writing', 'reading'],
        culturalTopics: ['Family structure and values', 'Personal space and relationships']
      },
      {
        id: 'module_3',
        title: '🏠 Daily Life',
        description: 'Everyday routines, activities, and time expressions',
        objectives: [
          'Describe daily routines and schedules',
          'Tell time and talk about dates',
          'Express frequency and duration',
          'Plan and discuss activities'
        ],
        vocabularyThemes: ['Daily Routine', 'Numbers and Time', 'Food and Beverages'],
        grammarPoints: ['Time expressions', 'Frequency adverbs', 'Present tense routine verbs'],
        activities: [
          'Daily schedule creation',
          'Time-telling practice',
          'Routine comparison activities',
          'Weekly planner exercises'
        ],
        estimatedTime: '2 weeks',
        difficulty: 'beginner',
        skillsFocus: ['speaking', 'listening', 'writing'],
        culturalTopics: ['Daily schedules and work culture', 'Meal times and customs']
      },
      {
        id: 'module_4',
        title: '🏙️ Around Town',
        description: 'Places, directions, and getting around the city',
        objectives: [
          'Name places and locations in a city',
          'Ask for and give directions',
          'Use transportation vocabulary',
          'Navigate public spaces'
        ],
        vocabularyThemes: ['Places and Locations', 'Transportation', 'Directions'],
        grammarPoints: ['Prepositions of place', 'Direction expressions', 'Modal verbs (can, need)'],
        activities: [
          'Map navigation exercises',
          'Direction-giving role-plays',
          'City vocabulary games',
          'Transportation planning activities'
        ],
        estimatedTime: '2 weeks',
        difficulty: 'beginner',
        skillsFocus: ['listening', 'speaking', 'reading'],
        culturalTopics: ['City layout and public transport', 'Navigation customs']
      },
      {
        id: 'module_5',
        title: '🍽️ Food and Dining',
        description: 'Food vocabulary, ordering, and dining experiences',
        objectives: [
          'Name common foods and beverages',
          'Order food in restaurants',
          'Express food preferences and dietary needs',
          'Understand menus and prices'
        ],
        vocabularyThemes: ['Food and Beverages', 'Numbers and Time', 'Colors and Shapes'],
        grammarPoints: ['Quantifiers (some, any, much, many)', 'Food-related verbs', 'Polite requests'],
        activities: [
          'Restaurant role-plays',
          'Menu reading exercises',
          'Recipe following activities',
          'Food preference surveys'
        ],
        estimatedTime: '2 weeks',
        difficulty: 'beginner',
        skillsFocus: ['speaking', 'listening', 'reading'],
        culturalTopics: ['Dining etiquette and customs', 'Traditional foods and meals']
      },
      {
        id: 'module_6',
        title: '🎨 Leisure and Hobbies',
        description: 'Free time activities, sports, and entertainment',
        objectives: [
          'Talk about hobbies and interests',
          'Discuss sports and leisure activities',
          'Make plans and invitations',
          'Express preferences for entertainment'
        ],
        vocabularyThemes: ['Sports and Activities', 'Entertainment', 'Time Expressions'],
        grammarPoints: ['Future expressions (going to)', 'Like/dislike expressions', 'Invitation language'],
        activities: [
          'Hobby sharing circles',
          'Sports vocabulary games',
          'Event planning exercises',
          'Entertainment preference discussions'
        ],
        estimatedTime: '2 weeks',
        difficulty: 'beginner',
        skillsFocus: ['speaking', 'writing', 'listening'],
        culturalTopics: ['Popular sports and activities', 'Entertainment culture']
      },
      {
        id: 'module_7',
        title: '✈️ Travel and Movement',
        description: 'Travel vocabulary, transportation, and movement',
        objectives: [
          'Use travel-related vocabulary',
          'Book transportation and accommodation',
          'Ask about schedules and prices',
          'Describe past and future travel'
        ],
        vocabularyThemes: ['Transportation', 'Countries and Places', 'Time and Schedules'],
        grammarPoints: ['Past tense introduction', 'Future plans', 'Travel-specific expressions'],
        activities: [
          'Travel planning projects',
          'Transportation booking role-plays',
          'Country and culture research',
          'Travel experience sharing'
        ],
        estimatedTime: '2 weeks',
        difficulty: 'beginner',
        skillsFocus: ['reading', 'writing', 'speaking'],
        culturalTopics: ['Travel customs and etiquette', 'Geography and tourism']
      },
      {
        id: 'module_8',
        title: '📱 Communication',
        description: 'Technology, communication, and staying connected',
        objectives: [
          'Use technology vocabulary',
          'Communicate via phone and digital media',
          'Write emails and messages',
          'Express problems and solutions'
        ],
        vocabularyThemes: ['Technology', 'Communication', 'Problem-solving'],
        grammarPoints: ['Review and consolidation', 'Communication expressions', 'Problem description'],
        activities: [
          'Email writing practice',
          'Phone conversation simulations',
          'Technology troubleshooting scenarios',
          'Digital communication etiquette'
        ],
        estimatedTime: '1-2 weeks',
        difficulty: 'beginner',
        skillsFocus: ['writing', 'speaking', 'reading', 'listening'],
        culturalTopics: ['Communication styles', 'Technology use and etiquette']
      }
    ];
  }

  static generateMilestones(moduleCount) {
    const milestones = [];
    for (let i = 1; i <= moduleCount; i++) {
      milestones.push({
        id: `milestone_${i}`,
        title: `Module ${i} Completion`,
        description: `Successfully complete all activities in Module ${i}`,
        reward: `${i * 100} XP`,
        type: 'module_completion'
      });
    }
    
    milestones.push({
      id: 'curriculum_complete',
      title: 'Curriculum Master',
      description: 'Complete the entire learning path',
      reward: 'Certificate of Achievement',
      type: 'curriculum_completion'
    });

    return milestones;
  }

  static getDailyRecommendations() {
    return {
      warmup: 'Review 5-10 previous words',
      newContent: 'Learn 10-15 new vocabulary words',
      practice: 'Complete interactive exercises',
      review: 'Test yourself with flashcards',
      cooldown: 'Listen to audio pronunciation'
    };
  }
  static getFallbackCurriculum({ language, level, dailyGoal }) {
    const languageFlag = this.getLanguageFlag(language);
    const levelCode = this.getLevelCode(level);
    
    return {
      title: `${languageFlag} ${language} ${levelCode} Full Syllabus (CEFR Level ${levelCode})`,
      description: `Comprehensive CEFR-compliant curriculum for ${language} learners at ${levelCode} level`,
      estimatedWeeks: 12,
      skills: this.getDefaultSkills(),
      vocabulary: this.getDefaultVocabulary(language),
      grammar: this.getDefaultGrammar(),
      culture: this.getDefaultCulture(language),
      modules: this.getDefaultModules(),
      milestones: this.generateMilestones(2),
      dailyRecommendations: this.getDailyRecommendations(),
      assessmentMethods: ['Weekly vocabulary quizzes', 'Module completion tests', 'Speaking assessments', 'Writing portfolio evaluation'],
      generatedAt: new Date().toISOString(),
      language,
      level,
      preferences: { language, level, dailyGoal },
      customizations: {
        focusAreas: [],
        difficulty: 'adaptive',
        pacing: 'normal',
        learningStyle: 'mixed'
      }
    };
  }

  static getDefaultSkills() {
    return {
      speaking: {
        emoji: "🗣️",
        title: "SPEAKING (Expression Orale)",
        functions: [
          "Greetings and basic politeness expressions",
          "Personal information exchange (name, age, nationality)",
          "Expressing likes and dislikes about familiar topics",
          "Simple questions about daily routine and activities",
          "Making basic requests and asking for help",
          "Shopping and ordering in restaurants",
          "Describing people, places, and objects simply",
          "Talking about time, dates, and schedules"
        ],
        communicativeTasks: [
          "Role-playing everyday situations",
          "Simple conversations with familiar topics",
          "Information gap activities",
          "Basic presentations about self and family"
        ]
      },
      listening: {
        emoji: "👂",
        title: "LISTENING (Compréhension Orale)",
        canUnderstand: [
          "Slow, clear speech about familiar topics",
          "Basic conversations between native speakers",
          "Numbers, dates, prices, and time expressions",
          "Simple announcements and instructions",
          "Essential information in short dialogues",
          "Weather forecasts and basic news headlines"
        ],
        practiceActivities: [
          "Audio dialogues with visual support",
          "Number and date recognition exercises",
          "Simple story listening with pictures",
          "Basic song lyrics comprehension",
          "Short video clips with subtitles"
        ]
      },
      reading: {
        emoji: "📖",
        title: "READING (Compréhension Écrite)",
        canUnderstand: [
          "Simple notices and signs in public places",
          "Basic personal information forms",
          "Short, simple texts about familiar topics",
          "Simple schedules and timetables",
          "Basic menus and price lists",
          "Simple personal letters and emails"
        ],
        textTypes: [
          "Personal identification documents",
          "Simple postcards and greeting cards",
          "Basic travel information",
          "Simple news headlines",
          "Elementary children's stories",
          "Basic weather reports",
          "Simple recipe instructions"
        ]
      },
      writing: {
        emoji: "✍️",
        title: "WRITING (Expression Écrite)",
        tasks: [
          "Filling out personal information forms",
          "Writing simple personal emails",
          "Composing short descriptive texts",
          "Creating basic messages and notes",
          "Writing simple postcards",
          "Completing basic questionnaires"
        ],
        focusAreas: [
          "Basic sentence structure",
          "Correct spelling of common words",
          "Appropriate punctuation usage",
          "Logical text organization"
        ]
      }
    };
  }

  static getDefaultVocabulary(language) {
    return {
      emoji: "📚",
      title: "VOCABULARY (Lexique)",
      themes: [
        {
          theme: "Personal Identity",
          words: ["name", "age", "nationality", "profession", "address", "phone", "email", "birthday", "family", "single", "married", "student", "teacher", "doctor", "engineer"],
          examples: [`My name is...`, `I am ... years old`, `I am from...`]
        },
        {
          theme: "Family and Relationships",
          words: ["mother", "father", "sister", "brother", "grandmother", "grandfather", "aunt", "uncle", "cousin", "wife", "husband", "children", "son", "daughter", "friend"],
          examples: [`This is my family`, `I have two sisters`, `My mother is a teacher`]
        },
        {
          theme: "Numbers and Time",
          words: ["one", "two", "three", "ten", "twenty", "hundred", "today", "yesterday", "tomorrow", "morning", "afternoon", "evening", "hour", "minute", "week"],
          examples: [`It is 3 o'clock`, `Today is Monday`, `I wake up at 7 AM`]
        },
        {
          theme: "Colors and Shapes",
          words: ["red", "blue", "green", "yellow", "black", "white", "brown", "pink", "orange", "purple", "circle", "square", "triangle", "big", "small"],
          examples: [`The car is red`, `I like blue`, `It's a big circle`]
        },
        {
          theme: "Food and Beverages",
          words: ["bread", "milk", "water", "coffee", "tea", "apple", "banana", "meat", "fish", "rice", "pasta", "cheese", "breakfast", "lunch", "dinner"],
          examples: [`I eat breakfast at 8`, `I like coffee`, `The apple is red`]
        },
        {
          theme: "Daily Routine",
          words: ["wake up", "get up", "shower", "breakfast", "work", "study", "lunch", "home", "dinner", "sleep", "watch TV", "read", "exercise", "clean", "cook"],
          examples: [`I wake up at 7`, `I go to work`, `I watch TV at night`]
        }
      ]
    };
  }

  static getDefaultGrammar() {
    return {
      emoji: "🧠",
      title: "GRAMMAR (Grammaire)",
      sections: [
        {
          emoji: "🔤",
          title: "Nouns & Articles",
          points: [
            "Masculine and feminine nouns",
            "Definite articles (the)",
            "Indefinite articles (a/an)",
            "Plural formation rules",
            "Basic noun agreement patterns"
          ]
        },
        {
          emoji: "👤",
          title: "Pronouns",
          points: [
            "Subject pronouns (I, you, he, she, we, they)",
            "Object pronouns (me, you, him, her, us, them)",
            "Possessive pronouns (my, your, his, her, our, their)",
            "Demonstrative pronouns (this, that, these, those)"
          ]
        },
        {
          emoji: "🧾",
          title: "Verbs",
          points: [
            "Present tense of 'to be' and 'to have'",
            "Regular verb conjugations in present tense",
            "Common irregular verbs (go, come, do, make)",
            "Basic modal verbs (can, want, need)",
            "Simple future expressions"
          ]
        },
        {
          emoji: "🚫",
          title: "Negation",
          points: [
            "Basic negation with 'not'",
            "Negative contractions (don't, doesn't, isn't)",
            "Common negative expressions",
            "Position of negation in sentences"
          ]
        },
        {
          emoji: "❓",
          title: "Questions",
          points: [
            "Yes/no questions with rising intonation",
            "Questions with question words (who, what, where, when, how, why)",
            "Question word order",
            "Basic question formation rules"
          ]
        },
        {
          emoji: "📌",
          title: "Adjectives",
          points: [
            "Basic descriptive adjectives",
            "Position of adjectives",
            "Agreement rules",
            "Possessive adjectives",
            "Colors and physical descriptions"
          ]
        },
        {
          emoji: "📍",
          title: "Prepositions",
          points: [
            "Prepositions of place (in, on, at, under, over)",
            "Prepositions of time (at, in, on, during)",
            "Common prepositional phrases",
            "Direction prepositions (to, from, into)"
          ]
        },
        {
          emoji: "🔗",
          title: "Connectors",
          points: [
            "Basic coordinating conjunctions (and, or, but)",
            "Sequence connectors (first, then, next, finally)",
            "Simple causal connectors (because)",
            "Time connectors (when, while)"
          ]
        }
      ]
    };
  }

  static getDefaultCulture(language) {
    const cultureTopics = {
      'French': [
        "French-speaking countries and regions",
        "Basic French etiquette and social norms",
        "French cuisine and dining culture",
        "French holidays and celebrations",
        "French daily life and customs",
        "French education system basics",
        "French geography and famous landmarks",
        "French arts and cultural traditions"
      ],
      'Spanish': [
        "Spanish-speaking countries and cultures",
        "Hispanic traditions and celebrations",
        "Spanish and Latin American cuisine",
        "Family values in Hispanic cultures",
        "Spanish daily routines and customs",
        "Hispanic music and arts",
        "Geography of Spanish-speaking regions",
        "Business etiquette in Spanish culture"
      ],
      'German': [
        "German-speaking countries (Germany, Austria, Switzerland)",
        "German business culture and punctuality",
        "German festivals and traditions (Oktoberfest, Christmas markets)",
        "German cuisine and meal traditions",
        "German education and work culture",
        "Environmental consciousness in Germany",
        "German history and cultural heritage",
        "Regional differences within Germany"
      ]
    };

    return {
      emoji: "🗺️",
      title: "CULTURE (Culture et Société)",
      topics: cultureTopics[language] || [
        "Countries where the language is spoken",
        "Basic cultural norms and etiquette",
        "Traditional foods and dining customs",
        "Holidays and celebrations",
        "Daily life and social customs",
        "Educational and work culture",
        "Geography and famous landmarks",
        "Arts, music, and cultural traditions"
      ]
    };
  }

  static async regenerateCurriculum(existingCurriculum, newCustomizations) {
    const updatedPreferences = {
      ...existingCurriculum.preferences,
      ...newCustomizations
    };

    return this.generateCurriculum(updatedPreferences);
  }
  static validateCurriculum(curriculum) {
    const required = ['title', 'description', 'modules', 'milestones'];
    return required.every(field => curriculum && curriculum[field]);
  }

  static getLanguageFlag(language) {
    const flags = {
      'French': '🇫🇷',
      'Spanish': '🇪🇸',
      'German': '🇩🇪',
      'Italian': '🇮🇹',
      'Portuguese': '🇵🇹',
      'Russian': '🇷🇺',
      'Chinese': '🇨🇳',
      'Japanese': '🇯🇵',
      'Korean': '🇰🇷',
      'Arabic': '🇸🇦',
      'Hindi': '🇮🇳',
      'Dutch': '🇳🇱',
      'Polish': '🇵🇱',
      'Turkish': '🇹🇷',
      'Swedish': '🇸🇪',
      'Norwegian': '🇳🇴',
      'Danish': '🇩🇰',
      'Finnish': '🇫🇮',
      'Greek': '🇬🇷',
      'Hebrew': '🇮🇱',
      'Thai': '🇹🇭',
      'Vietnamese': '🇻🇳',
      'Czech': '🇨🇿',
      'Hungarian': '🇭🇺',
      'Romanian': '🇷🇴',
      'Bulgarian': '🇧🇬',
      'Croatian': '🇭🇷',
      'Serbian': '🇷🇸',
      'Slovak': '🇸🇰',
      'Slovenian': '🇸🇮',
      'Estonian': '🇪🇪',
      'Latvian': '🇱🇻',
      'Lithuanian': '🇱🇹',
      'Catalan': '🇪🇸',
      'Basque': '🇪🇸',
      'Galician': '🇪🇸',
      'Welsh': '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
      'Irish': '🇮🇪',
      'Scottish Gaelic': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
      'Icelandic': '🇮🇸',
      'Faroese': '🇫🇴',
      'Maltese': '🇲🇹',
      'Albanian': '🇦🇱',
      'Macedonian': '🇲🇰',
      'Bosnian': '🇧🇦',
      'Montenegrin': '🇲🇪',
      'Ukrainian': '🇺🇦',
      'Belarusian': '🇧🇾',
      'Georgian': '🇬🇪',
      'Armenian': '🇦🇲',
      'Azerbaijani': '🇦🇿',
      'Kazakh': '🇰🇿',
      'Kyrgyz': '🇰🇬',
      'Tajik': '🇹🇯',
      'Turkmen': '🇹🇲',
      'Uzbek': '🇺🇿',
      'Mongolian': '🇲🇳',
      'Tibetan': '🏳️',
      'Urdu': '🇵🇰',
      'Bengali': '🇧🇩',
      'Punjabi': '🇮🇳',
      'Tamil': '🇮🇳',
      'Telugu': '🇮🇳',
      'Malayalam': '🇮🇳',
      'Kannada': '🇮🇳',
      'Marathi': '🇮🇳',
      'Gujarati': '🇮🇳',
      'Odia': '🇮🇳',
      'Assamese': '🇮🇳',
      'Nepali': '🇳🇵',
      'Sinhala': '🇱🇰',
      'Burmese': '🇲🇲',
      'Khmer': '🇰🇭',
      'Lao': '🇱🇦',
      'Malay': '🇲🇾',
      'Indonesian': '🇮🇩',
      'Filipino': '🇵🇭',
      'Tagalog': '🇵🇭',
      'Swahili': '🇹🇿',
      'Amharic': '🇪🇹',
      'Hausa': '🇳🇬',
      'Yoruba': '🇳🇬',
      'Igbo': '🇳🇬',
      'Zulu': '🇿🇦',
      'Xhosa': '🇿🇦',
      'Afrikaans': '🇿🇦'
    };
    return flags[language] || '🌍';
  }

  static getLevelCode(level) {
    const levelMap = {
      'Beginner': 'A1',
      'Elementary': 'A1',
      'Pre-Intermediate': 'A2',
      'Intermediate': 'B1',
      'Upper-Intermediate': 'B2',
      'Advanced': 'C1',
      'Proficient': 'C2',
      'A1': 'A1',
      'A2': 'A2',
      'B1': 'B1',
      'B2': 'B2',
      'C1': 'C1',
      'C2': 'C2'
    };
    return levelMap[level] || level;
  }
}

export default CurriculumGenerator;
