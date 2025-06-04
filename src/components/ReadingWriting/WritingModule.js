// Writing Module - AI-powered writing practice with correction
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { toast } from 'react-hot-toast';
import { bedrockService } from '@/services/bedrockService';

export default function WritingModule({ writingState, setWritingState, level, language }) {
  const { currentUser } = useAuth();
  const [wordCount, setWordCount] = useState(0);

  // Debug log to check received props
  console.log('WritingModule received props:', { level, language });

  const levels = {
    beginner: 'Beginner (A1-A2)',
    intermediate: 'Intermediate (B1-B2)',
    advanced: 'Advanced (C1-C2)'
  };

  const languages = {
    english: 'English',
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
        english: {
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

Return only valid JSON format.`;      const response = await bedrockService.generateText(aiPrompt);
      
      try {
        // Clean the response to handle control characters and formatting issues
        let cleanResponse = response
          .replace(/```json/gi, "")
          .replace(/```/g, "")
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
          .replace(/\r\n/g, "\\n") // Replace actual line breaks with escaped ones
          .replace(/\n/g, "\\n")
          .replace(/\r/g, "\\r")
          .replace(/\t/g, "\\t")
          .trim();
        
        // Find JSON content between braces
        const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          cleanResponse = jsonMatch[0];
        }
        
        console.log("Cleaned AI response for parsing:", cleanResponse.substring(0, 200) + "...");
        
        const aiAnalysis = JSON.parse(cleanResponse);
        
        // Validate the structure
        if (!aiAnalysis || typeof aiAnalysis !== 'object') {
          throw new Error('Invalid response structure');
        }
        
        // Ensure corrections is an array
        const corrections = Array.isArray(aiAnalysis.corrections) ? aiAnalysis.corrections : [];
        
        // Clean each correction object
        const cleanedCorrections = corrections.map(correction => ({
          original: (correction.original || '').toString().trim(),
          corrected: (correction.corrected || '').toString().trim(),
          explanation: (correction.explanation || '').toString().trim()
        })).filter(correction => correction.original && correction.corrected);
        
        // Create feedback object with cleaned AI corrections
        const feedback = {
          corrections: cleanedCorrections
        };
        
        setWritingState(prev => ({ ...prev, feedback, isAnalyzing: false }));
        toast.success('Writing analysis complete with detailed AI explanations!');
        
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        console.error('Raw AI response:', response);
        
        // Fallback: try to extract corrections manually
        try {
          const fallbackCorrections = [];
          const originalMatches = response.match(/"original":\s*"([^"]+)"/g) || [];
          const correctedMatches = response.match(/"corrected":\s*"([^"]+)"/g) || [];
          const explanationMatches = response.match(/"explanation":\s*"([^"]+)"/g) || [];
          
          const minLength = Math.min(originalMatches.length, correctedMatches.length);
          
          for (let i = 0; i < minLength; i++) {
            const original = originalMatches[i].match(/"original":\s*"([^"]+)"/)?.[1] || '';
            const corrected = correctedMatches[i].match(/"corrected":\s*"([^"]+)"/)?.[1] || '';
            const explanation = explanationMatches[i]?.match(/"explanation":\s*"([^"]+)"/)?.[1] || 'Grammar correction needed.';
            
            if (original && corrected) {
              fallbackCorrections.push({ original, corrected, explanation });
            }
          }
          
          if (fallbackCorrections.length > 0) {
            const feedback = { corrections: fallbackCorrections };
            setWritingState(prev => ({ ...prev, feedback, isAnalyzing: false }));
            toast.success('Writing analysis complete!');
          } else {
            throw new Error('No corrections found');
          }
          
        } catch (fallbackError) {
          console.error('Fallback parsing also failed:', fallbackError);
          toast.error('Failed to analyze text. Please try again.');
          setWritingState(prev => ({ ...prev, isAnalyzing: false }));
        }
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
    
    const target = targets[level] || targets.beginner; // Fallback to beginner if level is undefined
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
    return targets[level] || targets.beginner; // Fallback to beginner if level is undefined
  };return (
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
      )}      {/* Ultra-Modern Corrections Section */}
      <AnimatePresence>
        {writingState.feedback && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative overflow-hidden"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 opacity-50"></div>
            <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-red-600/20 rounded-full blur-xl animate-pulse delay-1000"></div>
            
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-white/20 dark:border-gray-700/50">
              {/* Modern Header with Icon and Progress */}
              <div className="relative bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 p-6">
                {/* Animated particles background */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-2 left-4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <div className="absolute top-6 right-8 w-1 h-1 bg-white rounded-full animate-pulse delay-500"></div>
                  <div className="absolute bottom-4 left-12 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-1000"></div>
                </div>
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                        <span className="text-2xl">✨</span>
                      </div>
                      {writingState.feedback.corrections && writingState.feedback.corrections.length > 0 && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white"
                        >
                          <span className="text-xs font-bold text-white">{writingState.feedback.corrections.length}</span>
                        </motion.div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                        AI Writing Analysis
                      </h2>
                      <p className="text-white/80 text-sm sm:text-base">
                        {writingState.feedback.corrections && writingState.feedback.corrections.length > 0 
                          ? `${writingState.feedback.corrections.length} improvement${writingState.feedback.corrections.length > 1 ? 's' : ''} suggested`
                          : 'Perfect writing detected!'
                        }
                      </p>
                    </div>
                  </div>
                  
                  {/* Success indicator */}
                  {writingState.feedback.corrections && writingState.feedback.corrections.length === 0 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center gap-2 bg-green-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-green-400/30"
                    >
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-white text-sm font-medium">Excellent</span>
                    </motion.div>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                {/* Corrections with Enhanced Design */}
                {writingState.feedback.corrections && writingState.feedback.corrections.length > 0 ? (
                  <div className="space-y-6">
                    {writingState.feedback.corrections.map((correction, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="group relative"
                      >
                        {/* Card background with gradient border */}
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                        <div className="absolute inset-0.5 bg-white dark:bg-gray-800 rounded-2xl"></div>
                        
                        <div className="relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 group-hover:shadow-xl transition-all duration-300">                        {/* Correction number badge */}
                        <motion.div 
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 200 }}
                          className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg number-bounce hover-glow"
                        >
                          <span className="text-white text-sm font-bold">{index + 1}</span>
                        </motion.div>
                          
                          {/* Before/After comparison with modern design */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Original text */}                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <motion.div 
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.4 + index * 0.1 }}
                                  className="w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center"
                                >
                                  <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </motion.div>
                                <span className="text-sm font-semibold text-red-600 dark:text-red-400">Original</span>
                              </div>
                              <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className="relative group/text"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl opacity-0 group-hover/text:opacity-100 transition-opacity duration-200 shimmer-correction"></div>
                                <div className="relative text-sm sm:text-base text-gray-800 dark:text-gray-200 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-xl border-l-4 border-red-400 font-mono hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200">
                                  {correction.original}
                                </div>
                              </motion.div>
                            </div>
                            
                            {/* Corrected text */}                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <motion.div 
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.6 + index * 0.1 }}
                                  className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center"
                                >
                                  <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </motion.div>
                                <span className="text-sm font-semibold text-green-600 dark:text-green-400">Corrected</span>
                              </div>
                              <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 + index * 0.1 }}
                                className="relative group/text"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl opacity-0 group-hover/text:opacity-100 transition-opacity duration-200 shimmer-correction"></div>
                                <div className="relative text-sm sm:text-base text-gray-800 dark:text-gray-200 bg-green-50 dark:bg-green-900/20 px-4 py-3 rounded-xl border-l-4 border-green-400 font-mono hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200">
                                  {correction.corrected}
                                </div>
                              </motion.div>
                            </div>
                          </div>
                            {/* Explanation with enhanced styling */}
                          {correction.explanation && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.8 + index * 0.1 }}
                              className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700"
                            >
                              <div className="flex items-start gap-3">
                                <motion.div 
                                  initial={{ rotate: -90, scale: 0 }}
                                  animate={{ rotate: 0, scale: 1 }}
                                  transition={{ delay: 0.9 + index * 0.1, type: "spring" }}
                                  className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 hover-glow"
                                >
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </motion.div>
                                <div className="flex-1">
                                  <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">AI Explanation</h4>
                                  <div className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 hover:shadow-md transition-shadow duration-200">
                                    {correction.explanation}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  /* Perfect writing celebration */
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-center py-12 relative"
                  >
                    {/* Animated success background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl opacity-50"></div>
                    <div className="absolute top-4 left-1/4 w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
                    <div className="absolute top-8 right-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-300"></div>
                    <div className="absolute bottom-6 left-1/3 w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce delay-700"></div>
                      <div className="relative">
                      {/* Decorative floating elements */}
                      <motion.div 
                        animate={{ 
                          y: [0, -10, 0],
                          rotate: [0, 5, 0]
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute top-4 left-1/4 w-3 h-3 bg-green-400 rounded-full sparkle-effect"
                      ></motion.div>
                      <motion.div 
                        animate={{ 
                          y: [0, -15, 0],
                          rotate: [0, -5, 0]
                        }}
                        transition={{ 
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1
                        }}
                        className="absolute top-8 right-1/4 w-2 h-2 bg-emerald-400 rounded-full sparkle-effect"
                      ></motion.div>
                      <motion.div 
                        animate={{ 
                          y: [0, -8, 0],
                          rotate: [0, 3, 0]
                        }}
                        transition={{ 
                          duration: 5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 2
                        }}
                        className="absolute bottom-6 left-1/3 w-2.5 h-2.5 bg-green-500 rounded-full sparkle-effect"
                      ></motion.div>
                      
                      {/* Additional sparkle effects */}
                      <motion.div 
                        animate={{ 
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.5
                        }}
                        className="absolute top-12 left-2/3 text-yellow-400 text-xl"
                      >
                        ✨
                      </motion.div>
                      <motion.div 
                        animate={{ 
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0]
                        }}
                        transition={{ 
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1.5
                        }}
                        className="absolute bottom-12 right-1/3 text-green-400 text-lg"
                      >
                        🌟
                      </motion.div>
                      
                      {/* Large success icon with animation */}
                      <div className="relative inline-block mb-6">
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 10 }}
                          className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl success-pulse"
                        >
                          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                        {/* Ripple effect */}
                        <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
                      </div>
                      
                      <motion.h3 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4"
                      >
                        Outstanding Work!
                      </motion.h3>
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed"
                      >
                        Your writing is impeccable! No corrections needed. Keep up the excellent work! 🎉
                      </motion.p>
                      
                      {/* Success stats */}
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="mt-6 inline-flex items-center gap-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full px-6 py-3 border border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow duration-300"
                      >
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.9, type: "spring" }}
                          className="flex items-center gap-2"
                        >
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Grammar ✓</span>
                        </motion.div>
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1.0, type: "spring" }}
                          className="flex items-center gap-2"
                        >
                          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Style ✓</span>
                        </motion.div>
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1.1, type: "spring" }}
                          className="flex items-center gap-2"
                        >
                          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Flow ✓</span>
                        </motion.div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
