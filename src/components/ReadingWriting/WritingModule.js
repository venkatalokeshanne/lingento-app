// Writing Module - AI-powered writing practice with correction
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { toast } from 'react-hot-toast';
import { bedrockService } from '@/services/bedrockService';

export default function WritingModule({ writingState, setWritingState, level, language }) {
  const { currentUser } = useAuth();
  const [wordCount, setWordCount] = useState(0);

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
    const words = writingState.userText.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [writingState.userText]);  // AI-only prompt generation with comprehensive error handling and topic tracking
  const generatePrompt = async () => {
    if (!bedrockService.isReady()) {
      toast.error('AI service is not available');
      return;
    }

    setWritingState(prev => ({ ...prev, isGeneratingPrompt: true }));    try {
      // Create sophisticated variety using multiple strategies
      const avoidTopics = writingState.generatedTopics && writingState.generatedTopics.length > 0 
        ? `\n\nCRITICAL: NEVER repeat these previously used topics: ${writingState.generatedTopics.join(', ')}. You MUST choose a completely different subject area.`
        : '';

      // Diverse topic pools with specific variety
      const topicCategories = {
        beginner: {
          personal: ['morning routine', 'favorite meal', 'weekend activities', 'family pet', 'school subject', 'best friend'],
          experiences: ['first day at work', 'learning to cook', 'visiting a museum', 'riding a bike', 'shopping for clothes', 'helping neighbors'],
          descriptions: ['your hometown', 'favorite season', 'dream vacation', 'ideal home', 'perfect day', 'favorite book/movie'],
          opinions: ['best hobby for relaxation', 'healthiest food', 'most useful invention', 'perfect weather', 'best time of day', 'ideal pet']
        },
        intermediate: {
          social: ['work-life balance', 'social media influence', 'cultural traditions', 'generation differences', 'community involvement', 'friendship challenges'],
          environmental: ['sustainable living', 'urban vs rural life', 'climate change solutions', 'recycling habits', 'transportation choices', 'energy conservation'],
          personal_growth: ['career ambitions', 'learning new skills', 'overcoming fears', 'personal achievements', 'life lessons', 'decision-making'],
          technology: ['smartphone impact', 'online learning', 'digital privacy', 'remote work', 'artificial intelligence', 'internet relationships']
        },
        advanced: {
          philosophical: ['meaning of success', 'role of art in society', 'nature vs nurture', 'individual vs collective good', 'progress vs tradition', 'freedom vs security'],
          analytical: ['economic inequality', 'education system reform', 'healthcare accessibility', 'political representation', 'cultural preservation', 'technological ethics'],
          global: ['international cooperation', 'migration patterns', 'cultural exchange', 'global communication', 'sustainable development', 'human rights'],
          futuristic: ['space exploration', 'genetic engineering', 'artificial consciousness', 'virtual reality society', 'climate adaptation', 'longevity research']
        }
      };

      // Randomly select a category and topic to ensure maximum variety
      const categories = Object.keys(topicCategories[level] || topicCategories.beginner);
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const categoryTopics = topicCategories[level]?.[randomCategory] || topicCategories.beginner.personal;
      const randomTopic = categoryTopics[Math.floor(Math.random() * categoryTopics.length)];

      // Create unique prompts with specific angles
      const promptAngles = {
        beginner: ['Describe', 'Tell about', 'Explain', 'Share your experience with', 'Write about your thoughts on'],
        intermediate: ['Analyze', 'Compare', 'Discuss your opinion about', 'Reflect on', 'Explain the importance of'],
        advanced: ['Critically examine', 'Evaluate the implications of', 'Argue for or against', 'Propose solutions for', 'Analyze the complexity of']
      };

      const angles = promptAngles[level] || promptAngles.beginner;
      const randomAngle = angles[Math.floor(Math.random() * angles.length)];      // Create a highly specific, unique prompt
      const promptRequest = `Create a unique, specific writing prompt for ${level} level ${language} learners.

CRITICAL LANGUAGE REQUIREMENT: The ENTIRE prompt must be written in ${language}. Do NOT use English.

MANDATORY REQUIREMENTS:
1. Focus on this EXACT topic: "${randomTopic}" from the "${randomCategory}" category
2. Use this specific approach: "${randomAngle}"
3. Make it highly specific and personal - avoid generic prompts
4. Include 2-3 specific questions or aspects to address
5. Word count guidance: ${level === 'beginner' ? '100-150' : level === 'intermediate' ? '150-250' : '250-350'} words
6. Write the ENTIRE prompt in ${language} - no English words allowed

${avoidTopics}

PROMPT STRUCTURE (all in ${language}):
- Start with the ${language} equivalent of: "${randomAngle} ${randomTopic}"
- Add specific details, examples, or scenarios in ${language}
- Include guiding questions in ${language}
- Make it personally relevant and engaging in ${language}

Return ONLY the complete prompt text in ${language}, no explanations or additional formatting.

The prompt must be creative, specific, written entirely in ${language}, and inspire thoughtful ${language} writing at the ${level} level.`;

      const response = await bedrockService.generateText(promptRequest);
      
      if (!response || response.trim().length === 0) {
        throw new Error('Empty response from AI service');
      }      // Extract a more specific topic identifier from the prompt for tracking
      const topicIdentifiers = [
        response.match(/about (.+?)(?:\.|,|\?|$)/i),
        response.match(/your (.+?)(?:\.|,|\?|$)/i),
        response.match(/describe (.+?)(?:\.|,|\?|$)/i),
        response.match(/discuss (.+?)(?:\.|,|\?|$)/i),
        response.match(/analyze (.+?)(?:\.|,|\?|$)/i),
        response.match(/explain (.+?)(?:\.|,|\?|$)/i)
      ].filter(Boolean);
      
      const topic = topicIdentifiers.length > 0 
        ? topicIdentifiers[0][1].trim() 
        : `${randomCategory}-${randomTopic}`;
      
      // Track this topic to avoid repetition
      const currentTopics = writingState.generatedTopics || [];
      const newTopics = [...currentTopics, topic].slice(-5); // Keep last 5 topics

      setWritingState(prev => ({
        ...prev,
        prompt: response.trim(),
        userText: '', // Clear previous text
        feedback: null, // Clear previous feedback
        isGeneratingPrompt: false,
        generatedTopics: newTopics
      }));
      toast.success('New writing prompt generated!');
    } catch (error) {
      console.error('Error generating prompt:', error);
        // Simple fallback prompt if AI fails - in target language
      const simpleFallbacks = {
        french: {
          beginner: `Écrivez sur votre journée typique. Que faites-vous du matin au soir?`,
          intermediate: `Décrivez une expérience mémorable que vous avez vécue récemment. Que s'est-il passé et comment vous êtes-vous senti(e)?`,
          advanced: `Quelle est votre opinion sur le rôle de la technologie dans l'éducation moderne? Discutez des avantages et des inconvénients.`
        },
        spanish: {
          beginner: `Escriba sobre su día típico. ¿Qué hace desde la mañana hasta la noche?`,
          intermediate: `Describa una experiencia memorable que haya tenido recientemente. ¿Qué pasó y cómo se sintió?`,
          advanced: `¿Cuál es su opinión sobre el papel de la tecnología en la educación moderna? Discuta las ventajas y desventajas.`
        },
        german: {
          beginner: `Schreiben Sie über Ihren typischen Tag. Was machen Sie von morgens bis abends?`,
          intermediate: `Beschreiben Sie eine unvergessliche Erfahrung, die Sie kürzlich gemacht haben. Was ist passiert und wie haben Sie sich gefühlt?`,
          advanced: `Was ist Ihre Meinung zur Rolle der Technologie in der modernen Bildung? Diskutieren Sie Vor- und Nachteile.`
        },
        italian: {
          beginner: `Scrivi della tua giornata tipica. Cosa fai dalla mattina alla sera?`,
          intermediate: `Descrivi un'esperienza memorabile che hai avuto di recente. Cosa è successo e come ti sei sentito/a?`,
          advanced: `Qual è la tua opinione sul ruolo della tecnologia nell'educazione moderna? Discuti vantaggi e svantaggi.`
        },
        portuguese: {
          beginner: `Escreva sobre seu dia típico. O que você faz da manhã à noite?`,
          intermediate: `Descreva uma experiência memorável que você teve recentemente. O que aconteceu e como você se sentiu?`,
          advanced: `Qual é sua opinião sobre o papel da tecnologia na educação moderna? Discuta vantagens e desvantagens.`
        }
      };
      
      const languageFallbacks = simpleFallbacks[language] || {
        beginner: `Write about your typical day in ${language}.`,
        intermediate: `Describe a memorable experience in ${language}.`,
        advanced: `Discuss technology's role in education in ${language}.`
      };
      
      const fallbackPrompt = languageFallbacks[level] || languageFallbacks.beginner;

      setWritingState(prev => ({
        ...prev,
        prompt: fallbackPrompt,
        isGeneratingPrompt: false
      }));
      toast.success('Using fallback prompt due to AI service issue');
    }
  };

  // Analyze and correct user's writing with AI-powered corrections and explanations
  const analyzeWriting = async () => {
    if (!writingState.userText.trim()) {
      toast.error('Please write something first');
      return;
    }

    if (!bedrockService.isReady()) {
      toast.error('AI service is not available');
      return;
    }

    setWritingState(prev => ({ ...prev, isAnalyzing: true }));
    try {
      const aiPrompt = `You are an expert ${language} language teacher working with a ${level} learner. Your goal is to help them understand their mistakes and improve their writing skills.

Text to analyze: "${writingState.userText}"

Please analyze this text and provide corrections with educational explanations that will help the learner understand and remember the rules.

For each error you find, provide a detailed correction following this format:

{
  "corrections": [
    {
      "original": "[exact incorrect phrase from the text]",
      "corrected": "[correct version of the phrase]", 
      "explanation": "This is incorrect because [specific reason why it's wrong]. The correct grammar rule is [explain the rule clearly]. To remember this: [provide a helpful memory tip or pattern]. Example: '[show a simple example sentence using the correct form]'."
    }
  ]
}

Guidelines for your analysis:
- Only include actual errors that need correction
- Focus on the most important errors first (grammar, verb conjugation, word order)
- Provide explanations that are appropriate for a ${level} learner
- Include memory tips or patterns to help the learner remember
- Give concrete examples of correct usage
- If the text has no significant errors, return an empty corrections array
- Be encouraging and educational in your explanations

Return only valid JSON format.`;

      const response = await bedrockService.generateText(aiPrompt);
      
      try {
        const aiAnalysis = JSON.parse(response);
        
        // Create feedback object with AI corrections
        const feedback = {
          corrections: aiAnalysis.corrections || []
        };
        
        setWritingState(prev => ({ ...prev, feedback, isAnalyzing: false }));
        toast.success('Writing analysis complete with detailed AI explanations!');
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        toast.error('Failed to analyze text. Please try again.');
        setWritingState(prev => ({ ...prev, isAnalyzing: false }));
      }
    } catch (error) {
      console.error('Error analyzing writing:', error);
      toast.error('Failed to analyze text. Please check your connection and try again.');
      setWritingState(prev => ({ ...prev, isAnalyzing: false }));
    }
  };  // Get word count color based on target
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
    <div className="space-y-4">
      {/* Compact Header with Essential Controls */}
      <div className="bg-white/90 dark:bg-gray-800/90 shadow-md rounded-xl p-4 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-purple-500 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white text-sm">✍️</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-white">
                Writing Practice
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Practice with AI feedback
              </p>
            </div>
          </div>

          {/* Compact Generate Button */}
          <button
            onClick={generatePrompt}
            disabled={writingState.isGeneratingPrompt}
            className="px-3 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-slate-400 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            {writingState.isGeneratingPrompt ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Loading...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>New Prompt</span>
              </>
            )}
          </button>
        </div>
      </div>      {/* Compact Writing Prompt Display */}
      {writingState.prompt && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="p-3 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
              <span>📝</span>
              Writing Prompt
            </h3>
            <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">
              🎯 Target: {getTargetRange()} words
            </span>
          </div>
          <div className="p-3">
            <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10 rounded p-2.5 text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
              {writingState.prompt}
            </div>
          </div>
        </div>
      )}{/* Mobile-First Writing Area */}
      {writingState.prompt && (
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
          {/* Header with Word Count and Analyze Button */}
          <div className="bg-gradient-to-r from-gray-50 to-green-50 dark:from-gray-700 dark:to-gray-600 p-3 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>✍️</span>
                Your Writing
              </h2>
              <div className={`px-3 py-1 rounded-lg text-sm font-medium ${getWordCountColor()} bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-600`}>
                {wordCount} words
              </div>
            </div>
            <button
              onClick={analyzeWriting}
              disabled={writingState.isAnalyzing || !writingState.userText.trim()}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium"
            >
              {writingState.isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Analyzing...</span>
                  <span className="sm:hidden">...</span>
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

          {/* Mobile-Optimized Writing Textarea */}
          <div className="p-4">
            <textarea
              value={writingState.userText}
              onChange={(e) => setWritingState(prev => ({ ...prev, userText: e.target.value }))}
              placeholder="Start writing your response here..."
              rows={8}
              className="w-full p-3 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm sm:text-base text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all duration-200"
            />
          </div>

          {/* Writing Tip */}
          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 border-t border-purple-100 dark:border-purple-800">
            <div className="flex items-start gap-2">
              <span className="text-purple-500 text-sm flex-shrink-0 mt-0.5">💡</span>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                <span className="font-medium">Write naturally</span> and don't worry about perfection. AI will help you improve!
              </p>
            </div>
          </div>
        </div>
      )}      {/* Mobile-First Corrections Section */}
      {writingState.feedback && (
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-4 border-l-4 border-red-500">
            <h2 className="text-lg sm:text-xl font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
              <span className="text-base sm:text-lg">🔧</span>
              Corrections & Feedback
            </h2>
          </div>
          
          <div className="p-4">
            {/* Corrections */}
            {writingState.feedback.corrections && writingState.feedback.corrections.length > 0 ? (
              <div className="space-y-4">
                {writingState.feedback.corrections.map((correction, index) => (
                  <div key={index} className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 sm:p-4 border border-red-200 dark:border-red-700">
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <div className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Original:</div>
                        <div className="text-sm sm:text-base text-gray-800 dark:text-gray-200 bg-red-100 dark:bg-red-900/30 px-3 py-2 rounded-md border border-red-300 dark:border-red-600">
                          {correction.original}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2">Corrected:</div>
                        <div className="text-sm sm:text-base text-gray-800 dark:text-gray-200 bg-green-100 dark:bg-green-900/30 px-3 py-2 rounded-md border border-green-300 dark:border-green-600">
                          {correction.corrected}
                        </div>
                      </div>
                    </div>
                    {correction.explanation && (
                      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-700">
                        <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1">Explanation:</div>
                        <div className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{correction.explanation}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">✅</div>
                <h3 className="text-lg sm:text-xl font-semibold text-green-600 dark:text-green-400 mb-2">Great work!</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">No corrections needed. Your writing looks good!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
