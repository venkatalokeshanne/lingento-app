// Writing Module - AI-powered writing practice with correction
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { toast } from 'react-hot-toast';
import { bedrockService } from '@/services/bedrockService';

export default function WritingModule() {
  const { currentUser } = useAuth();
  const { userPreferences } = useUserPreferences();
  const [prompt, setPrompt] = useState('');
  const [userText, setUserText] = useState('');
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  // Get level and language from user preferences with fallbacks
  const level = userPreferences?.proficiencyLevel || 'beginner';
  const language = userPreferences?.learningLanguage || 'french';

  const levels = {
    beginner: 'Beginner (A1-A2)',
    intermediate: 'Intermediate (B1-B2)',
    advanced: 'Advanced (C1-C2)'
  };

  const languages = {
    french: 'French',
    spanish: 'Spanish',
    german: 'German',
    italian: 'Italian',
    portuguese: 'Portuguese'
  };

  // Update word count when user types
  useEffect(() => {
    const words = userText.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [userText]);  // Cost-optimized prompt generation with local content pools (95% local, 5% AI)
  const generatePrompt = async () => {
    if (!bedrockService.isReady()) {
      toast.error('AI service is not available');
      return;
    }

    setIsGeneratingPrompt(true);
    try {
      // Prioritize local prompts to reduce AI costs
      const useLocalPrompt = Math.random() < 0.95; // 95% chance to use local prompts
      
      if (useLocalPrompt) {
        const localPrompt = generateLocalPrompt();
        if (localPrompt) {
          setPrompt(localPrompt);
          setUserText(''); // Clear previous text
          setFeedback(null); // Clear previous feedback
          toast.success('Writing prompt generated (cost-optimized)!');
          setIsGeneratingPrompt(false);
          return;
        }
      }

      // Only use AI as absolute fallback with minimal prompt
      const timestamp = Date.now();
      const promptRequest = `${level} ${language} writing prompt. 1 sentence. Topic: daily life.`;

      const response = await bedrockService.generateText(promptRequest);
      setPrompt(response);
      setUserText(''); // Clear previous text
      setFeedback(null); // Clear previous feedback
      toast.success('New writing prompt generated!');
    } catch (error) {
      console.error('Error generating prompt:', error);
      // Fallback to local prompts
      const fallbackPrompt = generateLocalPrompt();
      if (fallbackPrompt) {
        setPrompt(fallbackPrompt);
        toast.success('Using local prompt due to AI service issue');
      } else {
        toast.error('Failed to generate writing prompt');
      }
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  // Comprehensive local prompt library to minimize AI dependency
  const generateLocalPrompt = () => {
    const promptLibrary = {
      beginner: {
        french: [
          "Décrivez votre routine du matin. Que faites-vous entre 7h00 et 9h00?",
          "Parlez de votre famille. Combien de personnes y a-t-il? Que font-elles?",
          "Décrivez votre chambre. Qu'est-ce qu'il y a dans votre chambre?",
          "Que mangez-vous au petit déjeuner? Décrivez un petit déjeuner typique.",
          "Parlez de votre animal de compagnie ou d'un animal que vous aimez.",
          "Décrivez une journée parfaite. Que feriez-vous?",
          "Parlez de vos vêtements préférés. Que portez-vous aujourd'hui?",
          "Décrivez le temps qu'il fait aujourd'hui et ce que vous portez.",
          "Parlez de votre meilleur ami. Comment est-il/elle?",
          "Décrivez votre maison ou appartement. Combien de pièces y a-t-il?",
          "Que faites-vous le weekend? Décrivez un weekend typique.",
          "Parlez de votre repas préféré. Qu'est-ce que vous aimez manger?",
          "Décrivez votre trajet pour aller à l'école ou au travail.",
          "Parlez de vos hobbies. Qu'est-ce que vous aimez faire?",
          "Décrivez une fête d'anniversaire. Que fait-on pour célébrer?"
        ],
        spanish: [
          "Describe tu rutina de la mañana. ¿Qué haces entre las 7:00 y las 9:00?",
          "Habla de tu familia. ¿Cuántas personas hay? ¿Qué hacen?",
          "Describe tu habitación. ¿Qué hay en tu habitación?",
          "¿Qué comes en el desayuno? Describe un desayuno típico.",
          "Habla de tu mascota o de un animal que te gusta.",
          "Describe un día perfecto. ¿Qué harías?",
          "Habla de tu ropa favorita. ¿Qué llevas hoy?",
          "Describe el tiempo que hace hoy y qué ropa llevas.",
          "Habla de tu mejor amigo/a. ¿Cómo es?",
          "Describe tu casa o apartamento. ¿Cuántas habitaciones hay?",
          "¿Qué haces los fines de semana? Describe un fin de semana típico.",
          "Habla de tu comida favorita. ¿Qué te gusta comer?",
          "Describe tu camino a la escuela o al trabajo.",
          "Habla de tus pasatiempos. ¿Qué te gusta hacer?",
          "Describe una fiesta de cumpleaños. ¿Qué se hace para celebrar?"
        ],
        german: [
          "Beschreiben Sie Ihre Morgenroutine. Was machen Sie zwischen 7:00 und 9:00 Uhr?",
          "Erzählen Sie von Ihrer Familie. Wie viele Personen sind es? Was machen sie?",
          "Beschreiben Sie Ihr Zimmer. Was ist in Ihrem Zimmer?",
          "Was essen Sie zum Frühstück? Beschreiben Sie ein typisches Frühstück.",
          "Erzählen Sie von Ihrem Haustier oder einem Tier, das Sie mögen.",
          "Beschreiben Sie einen perfekten Tag. Was würden Sie machen?",
          "Erzählen Sie von Ihrer Lieblingskleidung. Was tragen Sie heute?",
          "Beschreiben Sie das Wetter heute und was Sie tragen.",
          "Erzählen Sie von Ihrem besten Freund. Wie ist er/sie?",
          "Beschreiben Sie Ihr Haus oder Ihre Wohnung. Wie viele Zimmer gibt es?"
        ],
        italian: [
          "Descrivi la tua routine del mattino. Cosa fai tra le 7:00 e le 9:00?",
          "Parla della tua famiglia. Quante persone ci sono? Cosa fanno?",
          "Descrivi la tua camera. Cosa c'è nella tua camera?",
          "Cosa mangi a colazione? Descrivi una colazione tipica.",
          "Parla del tuo animale domestico o di un animale che ti piace.",
          "Descrivi una giornata perfetta. Cosa faresti?",
          "Parla dei tuoi vestiti preferiti. Cosa indossi oggi?",
          "Descrivi il tempo oggi e cosa indossi.",
          "Parla del tuo migliore amico/a. Com'è?",
          "Descrivi la tua casa o appartamento. Quante stanze ci sono?"
        ],
        portuguese: [
          "Descreva a sua rotina matinal. O que faz entre as 7:00 e as 9:00?",
          "Fale da sua família. Quantas pessoas há? O que fazem?",
          "Descreva o seu quarto. O que há no seu quarto?",
          "O que come no pequeno-almoço? Descreva um pequeno-almoço típico.",
          "Fale do seu animal de estimação ou de um animal de que gosta.",
          "Descreva um dia perfeito. O que faria?",
          "Fale da sua roupa favorita. O que veste hoje?",
          "Descreva o tempo hoje e que roupa veste.",
          "Fale do seu melhor amigo/a. Como é?",
          "Descreva a sua casa ou apartamento. Quantos quartos há?"
        ]
      },
      intermediate: {
        french: [
          "Racontez un voyage mémorable que vous avez fait. Où êtes-vous allé et qu'avez-vous découvert?",
          "Décrivez un moment où vous avez dû surmonter une difficulté. Comment l'avez-vous résolue?",
          "Parlez d'une tradition de votre pays que vous trouvez intéressante.",
          "Décrivez l'évolution de votre quartier au cours des dernières années.",
          "Racontez une expérience culturelle qui vous a marqué.",
          "Parlez de vos projets pour l'année prochaine. Que voulez-vous accomplir?",
          "Décrivez un livre ou un film qui vous a influencé.",
          "Racontez une conversation importante que vous avez eue récemment.",
          "Parlez des changements technologiques dans votre vie quotidienne.",
          "Décrivez une personne qui vous inspire et expliquez pourquoi."
        ],
        spanish: [
          "Cuenta un viaje memorable que hayas hecho. ¿Adónde fuiste y qué descubriste?",
          "Describe un momento en que tuviste que superar una dificultad. ¿Cómo la resolviste?",
          "Habla de una tradición de tu país que encuentras interesante.",
          "Describe la evolución de tu barrio en los últimos años.",
          "Cuenta una experiencia cultural que te haya marcado.",
          "Habla de tus planes para el próximo año. ¿Qué quieres lograr?",
          "Describe un libro o película que te haya influido.",
          "Cuenta una conversación importante que hayas tenido recientemente.",
          "Habla de los cambios tecnológicos en tu vida diaria.",
          "Describe una persona que te inspire y explica por qué."
        ],
        german: [
          "Erzählen Sie von einer unvergesslichen Reise. Wohin sind Sie gefahren und was haben Sie entdeckt?",
          "Beschreiben Sie einen Moment, in dem Sie eine Schwierigkeit überwinden mussten.",
          "Erzählen Sie von einer Tradition Ihres Landes, die Sie interessant finden.",
          "Beschreiben Sie die Entwicklung Ihres Stadtviertels in den letzten Jahren.",
          "Erzählen Sie von einer kulturellen Erfahrung, die Sie geprägt hat."
        ],
        italian: [
          "Racconta un viaggio memorabile che hai fatto. Dove sei andato e cosa hai scoperto?",
          "Descrivi un momento in cui hai dovuto superare una difficoltà. Come l'hai risolta?",
          "Parla di una tradizione del tuo paese che trovi interessante.",
          "Descrivi l'evoluzione del tuo quartiere negli ultimi anni.",
          "Racconta un'esperienza culturale che ti ha colpito."
        ],
        portuguese: [
          "Conte uma viagem memorável que fez. Onde foi e o que descobriu?",
          "Descreva um momento em que teve de superar uma dificuldade. Como a resolveu?",
          "Fale de uma tradição do seu país que acha interessante.",
          "Descreva a evolução do seu bairro nos últimos anos.",
          "Conte uma experiência cultural que o/a marcou."
        ]
      },
      advanced: {
        french: [
          "Analysez l'impact des réseaux sociaux sur les relations interpersonnelles modernes.",
          "Discutez du rôle de l'éducation dans la promotion de l'égalité sociale.",
          "Examinez les défis et opportunités de la mondialisation économique.",
          "Réfléchissez sur l'équilibre entre progrès technologique et préservation de l'environnement.",
          "Analysez l'évolution du concept de travail dans la société contemporaine."
        ],
        spanish: [
          "Analiza el impacto de las redes sociales en las relaciones interpersonales modernas.",
          "Discute el papel de la educación en la promoción de la igualdad social.",
          "Examina los desafíos y oportunidades de la globalización económica.",
          "Reflexiona sobre el equilibrio entre progreso tecnológico y preservación del medio ambiente.",
          "Analiza la evolución del concepto de trabajo en la sociedad contemporánea."
        ],
        german: [
          "Analysieren Sie den Einfluss sozialer Medien auf moderne zwischenmenschliche Beziehungen.",
          "Diskutieren Sie die Rolle der Bildung bei der Förderung sozialer Gleichheit.",
          "Untersuchen Sie die Herausforderungen und Chancen der wirtschaftlichen Globalisierung."
        ],
        italian: [
          "Analizza l'impatto dei social media sulle relazioni interpersonali moderne.",
          "Discuti il ruolo dell'educazione nella promozione dell'uguaglianza sociale.",
          "Esamina le sfide e le opportunità della globalizzazione economica."
        ],
        portuguese: [
          "Analise o impacto das redes sociais nas relações interpessoais modernas.",
          "Discuta o papel da educação na promoção da igualdade social.",
          "Examine os desafios e oportunidades da globalização económica."
        ]
      }
    };

    const levelPrompts = promptLibrary[level]?.[language];
    if (levelPrompts && levelPrompts.length > 0) {
      const randomIndex = Math.floor(Math.random() * levelPrompts.length);
      return levelPrompts[randomIndex];
    }
    return null;
  };

  // Analyze and correct user's writing
  // Cost-optimized writing analysis with local feedback (80% local, 20% AI)
  const analyzeWriting = async () => {
    if (!userText.trim()) {
      toast.error('Please write something first');
      return;
    }

    setIsAnalyzing(true);
    try {
      // First, generate local analysis to reduce AI dependency
      const localAnalysis = generateLocalAnalysis();
      
      // Use local analysis for 80% of cases
      const useLocalOnly = Math.random() < 0.8;
      
      if (useLocalOnly || !bedrockService.isReady()) {
        setFeedback(localAnalysis);
        toast.success('Writing analysis complete (cost-optimized)!');
        setIsAnalyzing(false);
        return;
      }

      // For remaining 20%, use minimal AI analysis
      const timestamp = Date.now();
      const minimalPrompt = `Analyze ${language} ${level} text briefly. Score 1-100, 2 strengths, 2 suggestions only. JSON format only:
Text: "${userText.substring(0, 200)}..."
Format: {"overallScore":85,"strengths":["str1","str2"],"suggestions":["sug1","sug2"]}`;

      const response = await bedrockService.generateText(minimalPrompt);
      
      try {
        const aiAnalysis = JSON.parse(response);
        // Merge AI analysis with local analysis for comprehensive feedback
        const enhancedFeedback = {
          ...localAnalysis,
          overallScore: aiAnalysis.overallScore || localAnalysis.overallScore,
          strengths: [...(aiAnalysis.strengths || []), ...localAnalysis.strengths].slice(0, 4),
          suggestions: [...(aiAnalysis.suggestions || []), ...localAnalysis.suggestions].slice(0, 4)
        };
        setFeedback(enhancedFeedback);
        toast.success('Enhanced writing analysis complete!');
      } catch (parseError) {
        // Fallback to local analysis if AI parsing fails
        setFeedback(localAnalysis);
        toast.success('Writing analysis complete (local backup)');
      }
    } catch (error) {
      console.error('Error analyzing writing:', error);
      // Always fallback to local analysis
      const fallbackAnalysis = generateLocalAnalysis();
      setFeedback(fallbackAnalysis);
      toast.success('Writing analysis complete (offline mode)');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Comprehensive local analysis to minimize AI dependency
  const generateLocalAnalysis = () => {
    const text = userText.trim();
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Calculate basic metrics
    const wordCount = words.length;
    const sentenceCount = sentences.length;
    const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;
    
    // Get target ranges
    const targets = {
      beginner: { min: 100, max: 200, avgSentence: 8 },
      intermediate: { min: 200, max: 300, avgSentence: 12 },
      advanced: { min: 300, max: 500, avgSentence: 15 }
    };
    const target = targets[level];
    
    // Calculate scores based on local analysis
    let grammarScore = 75; // Base score
    let vocabularyScore = 75;
    let fluencyScore = 75;
    
    // Word count score contribution
    if (wordCount >= target.min && wordCount <= target.max) {
      grammarScore += 10;
      fluencyScore += 10;
    } else if (wordCount < target.min) {
      grammarScore -= 15;
      fluencyScore -= 15;
    }
    
    // Sentence length variety score
    if (avgWordsPerSentence >= target.avgSentence - 3 && avgWordsPerSentence <= target.avgSentence + 5) {
      fluencyScore += 10;
    }
    
    // Vocabulary diversity (unique words ratio)
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const vocabularyDiversity = uniqueWords.size / words.length;
    if (vocabularyDiversity > 0.7) {
      vocabularyScore += 15;
    } else if (vocabularyDiversity > 0.5) {
      vocabularyScore += 5;
    }
    
    // Basic punctuation check
    const hasPunctuation = /[.!?]/.test(text);
    if (hasPunctuation) {
      grammarScore += 5;
    }
    
    // Capitalize scores
    grammarScore = Math.min(95, Math.max(40, grammarScore));
    vocabularyScore = Math.min(95, Math.max(40, vocabularyScore));
    fluencyScore = Math.min(95, Math.max(40, fluencyScore));
    
    const overallScore = Math.round((grammarScore + vocabularyScore + fluencyScore) / 3);
    
    // Generate context-aware feedback
    const strengths = [];
    const suggestions = [];
    const corrections = [];
    
    // Strengths based on analysis
    if (wordCount >= target.min) {
      strengths.push("Good text length for your level");
    }
    if (sentenceCount >= 3) {
      strengths.push("Nice variety in sentence structure");
    }
    if (vocabularyDiversity > 0.6) {
      strengths.push("Good vocabulary diversity");
    }
    if (hasPunctuation) {
      strengths.push("Proper use of punctuation");
    }
    
    // Default strengths if none found
    if (strengths.length === 0) {
      strengths.push("You completed the writing task!");
      strengths.push("Good effort in expressing your ideas");
    }
    
    // Suggestions based on level and analysis
    if (wordCount < target.min) {
      suggestions.push(`Try to write at least ${target.min} words to fully develop your ideas`);
    }
    if (wordCount > target.max) {
      suggestions.push(`Consider being more concise - aim for around ${target.max} words maximum`);
    }
    if (avgWordsPerSentence < 5) {
      suggestions.push("Try combining some short sentences for better flow");
    }
    if (avgWordsPerSentence > 20) {
      suggestions.push("Consider breaking down long sentences for clarity");
    }
    if (vocabularyDiversity < 0.5) {
      suggestions.push("Try using more varied vocabulary to express your ideas");
    }
    if (!hasPunctuation) {
      suggestions.push("Remember to use proper punctuation marks");
    }
    
    // Level-specific suggestions
    const levelSuggestions = {
      beginner: [
        "Focus on simple, clear sentences",
        "Use basic connecting words like 'and', 'but', 'because'",
        "Describe specific details to make your writing more interesting"
      ],
      intermediate: [
        "Try using more complex sentence structures",
        "Include examples to support your main ideas",
        "Use transitional phrases to connect your thoughts",
        "Experiment with different verb tenses"
      ],
      advanced: [
        "Develop more sophisticated arguments",
        "Use advanced vocabulary and idiomatic expressions",
        "Create more nuanced connections between ideas",
        "Consider different perspectives on the topic"
      ]
    };
    
    // Add level-appropriate suggestions
    const availableSuggestions = levelSuggestions[level];
    if (suggestions.length < 3 && availableSuggestions) {
      const randomSuggestions = availableSuggestions
        .sort(() => 0.5 - Math.random())
        .slice(0, 3 - suggestions.length);
      suggestions.push(...randomSuggestions);
    }
    
    // Basic corrections for common issues
    const commonIssues = {
      french: {
        patterns: [
          { regex: /\bi\b/gi, correction: "je", explanation: "Use 'je' instead of 'i' for 'I'" },
          { regex: /\bje suis avoir\b/gi, correction: "j'ai", explanation: "Use 'j'ai' for 'I have'" }
        ]
      },
      spanish: {
        patterns: [
          { regex: /\bi\b/gi, correction: "yo", explanation: "Use 'yo' instead of 'i' for 'I'" },
          { regex: /\bestoy tener\b/gi, correction: "tengo", explanation: "Use 'tengo' for 'I have'" }
        ]
      },
      german: {
        patterns: [
          { regex: /\bi\b/gi, correction: "ich", explanation: "Use 'ich' instead of 'i' for 'I'" }
        ]
      },
      italian: {
        patterns: [
          { regex: /\bi\b/gi, correction: "io", explanation: "Use 'io' instead of 'i' for 'I'" }
        ]
      },
      portuguese: {
        patterns: [
          { regex: /\bi\b/gi, correction: "eu", explanation: "Use 'eu' instead of 'i' for 'I'" }
        ]
      }
    };
    
    // Check for common issues
    const languageIssues = commonIssues[language];
    if (languageIssues) {
      languageIssues.patterns.forEach(pattern => {
        const matches = text.match(pattern.regex);
        if (matches) {
          corrections.push({
            original: matches[0],
            corrected: pattern.correction,
            explanation: pattern.explanation
          });
        }
      });
    }
    
    return {
      overallScore,
      strengths: strengths.slice(0, 3),
      corrections: corrections.slice(0, 3),
      suggestions: suggestions.slice(0, 3),
      grammarScore,
      vocabularyScore,
      fluencyScore,
      correctedText: text // Basic version - would need more sophisticated correction
    };
  };

  // Get word count color based on target
  const getWordCountColor = () => {
    const targets = {
      beginner: { min: 100, max: 200 },
      intermediate: { min: 200, max: 300 },
      advanced: { min: 300, max: 500 }
    };
    
    const target = targets[level];
    if (wordCount < target.min) return 'text-orange-500';
    if (wordCount > target.max) return 'text-red-500';
    return 'text-green-500';
  };

  // Get target word count range
  const getTargetRange = () => {
    const targets = {
      beginner: '100-200',
      intermediate: '200-300',
      advanced: '300-500'
    };
    return targets[level];
  };  return (
    <div className="space-y-2">      {/* Ultra-Compact Controls */}      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-2 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          {/* Micro Settings Display */}
          <div className="flex items-center gap-1.5 text-xs">
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white/20 rounded">
              <span className="text-white/70 text-xs">🌍</span>
              <span className="text-white font-medium">{languages[language]}</span>
            </div>
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white/20 rounded">
              <span className="text-white/70 text-xs">📊</span>
              <span className="text-white font-medium">{levels[level].split(' ')[0]}</span>
            </div>
          </div>
            {/* Micro Action Button */}
          <button
            onClick={generatePrompt}
            disabled={isGeneratingPrompt}
            className="px-3 py-1 bg-white/20 hover:bg-white/30 disabled:bg-white/10 text-white font-medium rounded transition-all duration-200 flex items-center gap-1 text-xs"
          >
            {isGeneratingPrompt ? (
              <>
                <div className="w-2.5 h-2.5 border border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Loading</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span className="hidden sm:inline">New Prompt</span>
                <span className="sm:hidden">Prompt</span>
              </>
            )}          </button>
        </div>
        
        {/* Micro Link to Profile Settings */}
        <div className="mt-1.5 pt-1.5 border-t border-white/20">
          <p className="text-white/70 text-xs text-center">
            Want to change your language or level? 
            <a href="/profile" className="text-white font-medium hover:underline ml-1">
              Update in Profile →
            </a>
          </p>
        </div>
      </div>{/* Ultra-Compact Writing Prompt Display */}
      {prompt && (
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-2 py-1.5">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              <span>📝</span>
              Writing Prompt
            </h2>
          </div>
          <div className="p-2">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-2 mb-2">
              <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                {prompt}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-purple-600 dark:text-purple-400 font-medium">🎯 Target:</span>
              <span className="text-gray-600 dark:text-gray-400">{getTargetRange()} words</span>
            </div>
          </div>
        </div>
      )}      {/* Ultra-Compact Writing Area */}
      {prompt && (
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
          {/* Micro Header with Word Count and Analyze Button */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-2 py-1.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <span>✍️</span>
                Your Writing
              </h2>
              <div className={`px-2 py-0.5 rounded text-xs font-medium ${getWordCountColor()} bg-white/80 dark:bg-gray-800/80`}>
                {wordCount} words
              </div>
            </div>
            <button
              onClick={analyzeWriting}
              disabled={isAnalyzing || !userText.trim()}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-2 py-1 rounded transition-all duration-200 flex items-center gap-1 text-xs font-medium"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Analyzing</span>
                </>
              ) : (
                <>
                  <span>🔍</span>
                  <span className="hidden sm:inline">Get Feedback</span>
                  <span className="sm:hidden">Analyze</span>
                </>
              )}
            </button>
          </div>

          {/* Ultra-Compact Writing Textarea */}
          <div className="p-2">
            <textarea
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              placeholder="Start writing your response here..."
              rows={10}
              className="w-full p-2 border-0 bg-gray-50 dark:bg-gray-700/50 rounded text-xs text-gray-900 dark:text-white resize-none focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all duration-200"
            />
          </div>

          {/* Micro Tip */}
          <div className="bg-purple-50 dark:bg-purple-900/20 px-2 py-1.5 border-t border-purple-100 dark:border-purple-800">
            <div className="flex items-start gap-1.5">
              <span className="text-purple-500 text-xs flex-shrink-0 mt-0.5">💡</span>
              <p className="text-xs text-purple-700 dark:text-purple-300">
                <span className="font-medium">Write naturally</span> and don't worry about perfection. AI will help you improve!
              </p>
            </div>
          </div>
        </div>
      )}      {/* Ultra-Compact Feedback Section */}
      {feedback && (
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-2 py-1.5">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1">
              <span className="text-xs">📊</span>
              AI Feedback & Analysis
            </h2>
          </div>

          <div className="p-2 space-y-2">
            {/* Overall Score Card */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-2">
              <div className="text-center mb-2">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {feedback.overallScore || 75}/100
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Overall Score</div>
              </div>
              
              {/* Detailed Scores - Compact Grid */}
              <div className="grid grid-cols-3 gap-1.5">
                <div className="text-center bg-white/50 dark:bg-gray-800/50 rounded-md p-1.5">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {feedback.grammarScore || 75}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Grammar</div>
                </div>
                <div className="text-center bg-white/50 dark:bg-gray-800/50 rounded-md p-1.5">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {feedback.vocabularyScore || 80}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Vocabulary</div>
                </div>
                <div className="text-center bg-white/50 dark:bg-gray-800/50 rounded-md p-1.5">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {feedback.fluencyScore || 70}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Fluency</div>
                </div>
              </div>
            </div>

            {/* Strengths */}
            {feedback.strengths && feedback.strengths.length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2">
                <h3 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-1.5 flex items-center gap-1">
                  <span className="text-xs">✅</span>
                  Strengths
                </h3>
                <div className="space-y-1">
                  {feedback.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start gap-1.5">
                      <span className="text-green-500 mt-0.5 text-xs">•</span>
                      <span className="text-xs text-gray-700 dark:text-gray-300">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Corrections */}
            {feedback.corrections && feedback.corrections.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-2">
                <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-1.5 flex items-center gap-1">
                  <span className="text-xs">🔧</span>
                  Corrections
                </h3>
                <div className="space-y-1.5">
                  {feedback.corrections.map((correction, index) => (
                    <div key={index} className="bg-white/70 dark:bg-gray-800/70 rounded-md p-1.5">
                      <div className="grid grid-cols-1 gap-1.5">
                        <div>
                          <div className="text-xs font-medium text-red-600 dark:text-red-400 mb-0.5">Original:</div>
                          <div className="text-xs text-gray-800 dark:text-gray-200 bg-red-100 dark:bg-red-900/30 px-1.5 py-0.5 rounded">
                            {correction.original}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-green-600 dark:text-green-400 mb-0.5">Corrected:</div>
                          <div className="text-xs text-gray-800 dark:text-gray-200 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded">
                            {correction.corrected}
                          </div>
                        </div>
                      </div>
                      {correction.explanation && (
                        <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                          <strong>Explanation:</strong> {correction.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {feedback.suggestions && feedback.suggestions.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
                <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1.5 flex items-center gap-1">
                  <span className="text-xs">💡</span>
                  Suggestions for Improvement
                </h3>
                <div className="space-y-1">
                  {feedback.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-1.5">
                      <span className="text-blue-500 mt-0.5 text-xs">•</span>
                      <span className="text-xs text-gray-700 dark:text-gray-300">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Corrected Text */}
            {feedback.correctedText && feedback.correctedText !== userText && (
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2">
                <h3 className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-1.5 flex items-center gap-1">
                  <span className="text-xs">✨</span>
                  Corrected Version
                </h3>
                <div className="bg-white/70 dark:bg-gray-800/70 rounded-md p-2">
                  <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed">
                    {feedback.correctedText}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
