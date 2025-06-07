// Reading and Writing Hub - Main component
'use client';

import { useState, useEffect } from 'react';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { useAuth } from '@/context/AuthContext';
import ReadingModule from './ReadingModule';
import WritingModule from './WritingModule';
import AddButton from '@/components/AddButton';
import WordModal from '@/components/WordModal/WordModal';
import { bedrockService } from "@/services/bedrockService";
import { toast } from 'react-hot-toast';
import { addUserData } from '@/utils/firebaseUtils';
import { AnimatePresence } from 'framer-motion';
import audioService from "@/services/audioService";

export default function ReadingWritingHub() {
  const [activeTab, setActiveTab] = useState('reading');
  const { language, level, loading, error } = useUserPreferences();
  const { currentUser } = useAuth();
  
  // Modal state for adding words
  const [showWordModal, setShowWordModal] = useState(false);
  const [selectedWord, setSelectedWord] = useState('');
  
  // Writing module state management
  const [writingState, setWritingState] = useState({
    prompt: '',
    userText: '',
    feedback: null,
    isGeneratingPrompt: false,
    isAnalyzing: false,
    hasInitialPrompt: false,
    generatedTopics: [] // Track generated topics to avoid repetition
  });
  
  // Reading module state management
  const [readingState, setReadingState] = useState({
    text: '',
    textTitle: '',
    isGenerating: false,
    hasInitialText: false,
    generatedTopics: [] // Track generated topics to avoid repetition
  });  // Get level and language from user preferences with fallbacks
  const userLevel = level || 'beginner';
  const userLanguage = language || 'english';
  console.log("User preferences:", { level: userLevel, language: userLanguage, loading, error });
  // Handler for tab switching with audio pause functionality
  const handleTabSwitch = (newTab) => {
    // If switching from reading to writing, pause any playing audio
    if (activeTab === 'reading' && newTab === 'writing') {
      if (audioService.isPlaying()) {
        console.log("Pausing audio due to tab switch from Reading to Writing");
        audioService.pause();
      }
    }
    setActiveTab(newTab);
  };

  // Handler for add word button
  const handleAddWord = () => {
    setSelectedWord('');
    setShowWordModal(true);
  };

  // Handler for adding word to vocabulary
  const handleWordSubmit = async (wordData) => {
    if (!currentUser) {
      toast.error("Please log in to add words to vocabulary");
      return;
    }

    try {
      const vocabularyEntry = {
        word: wordData.word,
        translation: wordData.translation || "",
        pronunciation: wordData.pronunciation || "",
        definition: wordData.definition || "",
        example: wordData.example || "",
        category: "vocabulary",
        language: userLanguage,
        dateAdded: new Date().toISOString(),
        source: "reading_writing_practice",
      };

      await addUserData(currentUser, "vocabulary", vocabularyEntry);
      toast.success(`"${wordData.word}" added to vocabulary!`);
      setShowWordModal(false);
      setSelectedWord('');
    } catch (error) {
      console.error("Error adding to vocabulary:", error);
      toast.error("Failed to add word to vocabulary");
    }
  };

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS  // Generate initial prompt when component mounts or language/level changes
  useEffect(() => {
    if (!loading && userLanguage && userLevel && 
        (!writingState.hasInitialPrompt || 
        (writingState.prompt && !writingState.prompt.includes(userLanguage)))) {
      console.log("Triggering initial writing prompt generation");
      generateInitialPrompt();
    }
  }, [userLanguage, userLevel, loading]); // Removed writingState.hasInitialPrompt from dependencies to prevent re-triggering
  // Generate initial reading text when component mounts or language/level changes
  useEffect(() => {
    if (!loading && userLanguage && userLevel && !readingState.hasInitialText) {
      console.log("Triggering initial reading text generation");
      generateInitialReadingText();
    }
  }, [userLanguage, userLevel, loading]); // Removed readingState.hasInitialText from dependencies to prevent re-triggering

  // Show loading state while preferences are loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading preferences...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error loading preferences
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Error loading preferences: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }  const generateInitialPrompt = async () => {
    try {
      console.log("Generating AI prompt for:", { level: userLevel, language: userLanguage });
      
      // Prevent double execution by checking if already generating or has initial prompt
      if (writingState.isGeneratingPrompt || writingState.hasInitialPrompt) {
        console.log("Skipping initial prompt generation - already generating or has initial prompt");
        return;
      }
      
      if (!bedrockService.isReady()) {
        console.log("Bedrock service not ready");
        toast.error("AI service is not available");
        return;
      }

      // Create sophisticated variety using multiple strategies
      const avoidTopics = writingState.generatedTopics.length > 0 
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
      const categories = Object.keys(topicCategories[userLevel] || topicCategories.beginner);
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const categoryTopics = topicCategories[userLevel]?.[randomCategory] || topicCategories.beginner.personal;
      const randomTopic = categoryTopics[Math.floor(Math.random() * categoryTopics.length)];

      // Create unique prompts with specific angles
      const promptAngles = {
        beginner: ['Describe', 'Tell about', 'Explain', 'Share your experience with', 'Write about your thoughts on'],
        intermediate: ['Analyze', 'Compare', 'Discuss your opinion about', 'Reflect on', 'Explain the importance of'],
        advanced: ['Critically examine', 'Evaluate the implications of', 'Argue for or against', 'Propose solutions for', 'Analyze the complexity of']
      };

      const angles = promptAngles[userLevel] || promptAngles.beginner;
      const randomAngle = angles[Math.floor(Math.random() * angles.length)];

      // Create a highly specific, unique prompt
      const promptRequest = `Create a unique, specific writing prompt for ${userLevel} level ${userLanguage} learners.

CRITICAL LANGUAGE REQUIREMENT: The ENTIRE prompt must be written in ${userLanguage}. Do NOT use English.

MANDATORY REQUIREMENTS:
1. Focus on this EXACT topic: "${randomTopic}" from the "${randomCategory}" category
2. Use this specific approach: "${randomAngle}"
3. Make it highly specific and personal - avoid generic prompts
4. Include 2-3 specific questions or aspects to address
5. Word count guidance: ${userLevel === 'beginner' ? '100-150' : userLevel === 'intermediate' ? '150-250' : '250-350'} words
6. Write the ENTIRE prompt in ${userLanguage} - no English words allowed

${avoidTopics}

PROMPT STRUCTURE (all in ${userLanguage}):
- Start with the ${userLanguage} equivalent of: "${randomAngle} ${randomTopic}"
- Add specific details, examples, or scenarios in ${userLanguage}
- Include guiding questions in ${userLanguage}
- Make it personally relevant and engaging in ${userLanguage}

Return ONLY the complete prompt text in ${userLanguage}, no explanations or additional formatting.

The prompt must be creative, specific, written entirely in ${userLanguage}, and inspire thoughtful ${userLanguage} writing at the ${userLevel} level.`;
      
      const aiPrompt = await bedrockService.generateText(promptRequest);
        // Extract a more specific topic identifier from the prompt for tracking
      const topicIdentifiers = [
        aiPrompt.match(/about (.+?)(?:\.|,|\?|$)/i),
        aiPrompt.match(/your (.+?)(?:\.|,|\?|$)/i),
        aiPrompt.match(/describe (.+?)(?:\.|,|\?|$)/i),
        aiPrompt.match(/discuss (.+?)(?:\.|,|\?|$)/i),
        aiPrompt.match(/analyze (.+?)(?:\.|,|\?|$)/i),
        aiPrompt.match(/explain (.+?)(?:\.|,|\?|$)/i)
      ].filter(Boolean);
      
      const topic = topicIdentifiers.length > 0 
        ? topicIdentifiers[0][1].trim() 
        : `${randomCategory}-${randomTopic}`;
      
      // Track this topic to avoid repetition
      const newTopics = [...writingState.generatedTopics, topic].slice(-5); // Keep last 5 topics
      
      setWritingState(prev => ({
        ...prev,
        prompt: aiPrompt.trim(),
        userText: '',
        feedback: null,
        hasInitialPrompt: true,
        generatedTopics: newTopics
      }));
      
      toast.success("Writing prompt generated!");
        } catch (error) {
      console.error("Error generating AI prompt:", error);
        // Simple fallback prompt without local libraries - in target language
      const fallbackPrompts = {
        french: `Écrivez sur votre routine quotidienne en français.`,
        spanish: `Escriba sobre su rutina diaria en español.`,
        german: `Schreiben Sie über Ihre tägliche Routine auf Deutsch.`,
        italian: `Scrivi della tua routine quotidiana in italiano.`,
        portuguese: `Escreva sobre sua rotina diária em português.`
      };
      
      const fallbackPrompt = fallbackPrompts[userLanguage] || `Write about your daily routine in ${userLanguage}.`;
      
      setWritingState(prev => ({
        ...prev,
        prompt: fallbackPrompt,
        userText: '',
        feedback: null,
        hasInitialPrompt: true
      }));
      
      toast.error("Failed to generate AI prompt, using fallback");
    }
  };  // Generate initial reading text using AI only
  const generateInitialReadingText = async () => {
    console.log("Generating initial reading text with AI for:", { level: userLevel, language: userLanguage });
    
    // Prevent double execution by checking if already generating or has initial text
    if (readingState.isGenerating || readingState.hasInitialText) {
      console.log("Skipping initial text generation - already generating or has initial text");
      return;
    }
    
    if (!bedrockService) {
      console.error("Bedrock service not available for initial text generation");
      setReadingState((prev) => ({
        ...prev,
        text: "AI service is currently unavailable. Please try again later.",
        textTitle: "Service Unavailable",
        isGenerating: false,
        hasInitialText: true
      }));
      return;
    }

    setReadingState((prev) => ({ ...prev, isGenerating: true }));

    try {
      // Create sophisticated variety in topics by avoiding previously generated ones
      const avoidTopics = readingState.generatedTopics.length > 0 
        ? `\n\nCRITICAL: NEVER repeat these previously used topics: ${readingState.generatedTopics.join(', ')}. You MUST choose a completely different subject area.`
        : '';

      // Diverse topic pools with specific variety for reading
      const readingTopicCategories = {
        beginner: {
          cultural: ['traditional festivals', 'local customs', 'food traditions', 'family celebrations', 'regional music', 'folk stories'],
          nature: ['seasonal changes', 'animal behaviors', 'plant life cycles', 'weather patterns', 'natural landmarks', 'environmental care'],
          daily_life: ['transportation methods', 'shopping habits', 'work routines', 'educational systems', 'healthcare practices', 'communication styles'],
          entertainment: ['popular sports', 'traditional games', 'music genres', 'dance forms', 'storytelling traditions', 'art forms']
        },
        intermediate: {
          historical: ['historical figures', 'important events', 'cultural movements', 'technological advances', 'social changes', 'architectural developments'],
          scientific: ['medical discoveries', 'space exploration', 'environmental research', 'technological innovations', 'biological studies', 'physics concepts'],
          social: ['cultural exchange', 'migration stories', 'community projects', 'social movements', 'generational differences', 'urban development'],
          economic: ['trade relationships', 'business innovations', 'market trends', 'entrepreneurship', 'sustainable practices', 'global commerce']
        },
        advanced: {
          philosophical: ['ethical debates', 'moral dilemmas', 'philosophical schools', 'existential questions', 'consciousness studies', 'human nature'],
          analytical: ['policy analysis', 'research findings', 'statistical trends', 'comparative studies', 'theoretical frameworks', 'academic discourse'],
          global: ['geopolitical issues', 'international relations', 'global challenges', 'cross-cultural analysis', 'diplomatic history', 'world systems'],
          futuristic: ['emerging technologies', 'future predictions', 'scientific possibilities', 'societal evolution', 'innovation impacts', 'paradigm shifts']
        }
      };

      // Randomly select a category and topic to ensure maximum variety
      const categories = Object.keys(readingTopicCategories[userLevel] || readingTopicCategories.beginner);
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const categoryTopics = readingTopicCategories[userLevel]?.[randomCategory] || readingTopicCategories.beginner.cultural;
      const randomTopic = categoryTopics[Math.floor(Math.random() * categoryTopics.length)];

      // Different text styles for variety
      const textStyles = {
        beginner: ['informational article', 'personal story', 'descriptive piece', 'simple explanation', 'cultural introduction'],
        intermediate: ['analytical article', 'comparative study', 'historical account', 'research summary', 'opinion piece'],
        advanced: ['academic analysis', 'critical examination', 'theoretical discussion', 'research paper excerpt', 'philosophical treatise']
      };

      const styles = textStyles[userLevel] || textStyles.beginner;
      const randomStyle = styles[Math.floor(Math.random() * styles.length)];

      const prompt = `You are a ${userLanguage} language teacher. Create a ${userLevel} level reading text as a ${randomStyle} about "${randomTopic}" from the "${randomCategory}" category.

MANDATORY REQUIREMENTS:
1. Text length: 150-250 words
2. Focus specifically on: "${randomTopic}"
3. Write as: ${randomStyle}
4. Vocabulary appropriate for ${userLevel} level
5. Include interesting facts or perspectives

${avoidTopics}

CRITICAL FORMATTING REQUIREMENTS:
1. Return ONLY valid JSON in this exact format with no additional text or explanation
2. Use proper line breaks (\\n) in the content for paragraphs
3. Format: {"title": "Title Here", "content": "Text content here with \\n for new paragraphs"}

Create an engaging, educational text that provides unique insights about ${randomTopic}.`;
      
      console.log("Sending initial text generation prompt to AI:", prompt);
      const response = await bedrockService.generateText(prompt);
      console.log("AI response for initial text received:", response.substring(0, 100) + "...");

      // Enhanced JSON parsing with better cleaning and formatting
      try {
        // Remove any markdown formatting, extra text, and normalize the response
        let cleanResponse = response
          .replace(/```json/gi, "")
          .replace(/```/g, "")
          .replace(/Here is.*?format:\s*/i, "")
          .replace(/Here is.*?JSON format:\s*/i, "")
          .replace(/Here's.*?format:\s*/i, "")
          .trim();
        
        // Find JSON-like content between braces
        const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          cleanResponse = jsonMatch[0];
        }
        
        console.log("Cleaned response for parsing:", cleanResponse.substring(0, 200) + "...");
        
        const parsed = JSON.parse(cleanResponse);
        
        if (parsed.title && parsed.content) {
          console.log("Successfully parsed initial AI response");
          
          // Format the content properly - convert \\n to actual line breaks
          const formattedContent = parsed.content
            .replace(/\\n/g, '\n')
            .replace(/\\\"/g, '"')
            .replace(/\\\'/g, "'")
            .trim();
          
          // Track this topic to avoid repetition
          const newTopics = [...readingState.generatedTopics, parsed.title].slice(-5); // Keep last 5 topics
          
          setReadingState((prev) => ({
            ...prev,
            textTitle: parsed.title,
            text: formattedContent,
            isGenerating: false,
            hasInitialText: true,
            generatedTopics: newTopics
          }));
        } else {
          throw new Error("Invalid JSON structure from AI");
        }
      } catch (parseError) {
        console.log("JSON parsing failed for initial text, extracting content manually");
        
        // Fallback: extract content manually if JSON parsing fails
        const titleMatch = response.match(/"title":\s*"([^"]+)"/);
        const contentMatch = response.match(/"content":\s*"([^"]*?)"/);
        
        if (titleMatch && contentMatch) {
          const formattedContent = contentMatch[1]
            .replace(/\\n/g, '\n')
            .replace(/\\\"/g, '"')
            .replace(/\\\'/g, "'")
            .trim();
            
          const newTopics = [...readingState.generatedTopics, titleMatch[1]].slice(-5);
          
          setReadingState((prev) => ({
            ...prev,
            textTitle: titleMatch[1],
            text: formattedContent,
            isGenerating: false,
            hasInitialText: true,
            generatedTopics: newTopics
          }));
        } else {
          // Final fallback: use raw response with basic cleaning
          const cleanedText = response
            .replace(/^.*?"content":\s*"/, "")
            .replace(/".*$/, "")
            .replace(/\\n/g, '\n')
            .replace(/\\\"/g, '"')
            .replace(/\\\'/g, "'")
            .trim();
            
          setReadingState((prev) => ({
            ...prev,
            textTitle: "Reading Text",
            text: cleanedText,
            isGenerating: false,
            hasInitialText: true
          }));
        }
      }
    } catch (error) {
      console.error("Error generating initial text:", error);
      setReadingState((prev) => ({
        ...prev,
        text: "Failed to generate initial reading text. Please try generating a new text.",
        textTitle: "Generation Failed",
        isGenerating: false,
        hasInitialText: true
      }));
    }
  };  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Space-Efficient Container */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-5xl">
        {/* Compact Header + Tab Navigation Combined */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3 mb-2 sm:mb-0">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Reading & Writing
              </span>
            </h1>
          </div>
          
          {/* Compact Tab Navigation */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-1 shadow-md border border-white/20 dark:border-gray-700/50 w-full max-w-xs sm:max-w-md">
            <div className="grid grid-cols-2 gap-1">              <button
                onClick={() => handleTabSwitch('reading')}
                className={`relative px-3 py-2 rounded-md font-medium transition-all text-sm overflow-hidden ${
                  activeTab === 'reading'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>📖</span>
                  <span>Reading</span>
                </div>
              </button>
              <button
                onClick={() => handleTabSwitch('writing')}
                className={`relative px-3 py-2 rounded-md font-medium transition-all text-sm overflow-hidden ${
                  activeTab === 'writing'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>✍️</span>
                  <span>Writing</span>
                </div>
              </button>
            </div>
          </div>
        </div>        {/* Compact Content Area */}
        <div className="w-full">
          {activeTab === 'reading' ? (
            <ReadingModule 
              readingState={readingState}
              setReadingState={setReadingState}
              level={userLevel}
              language={userLanguage}
            />
          ) : (
            <WritingModule 
              writingState={writingState}
              setWritingState={setWritingState}
              level={userLevel}
              language={userLanguage}
            />
          )}        </div>
      </div>
      
      {/* Add Word Button */}
      <AddButton
        onClick={handleAddWord}
        title="Add new word to vocabulary"
        position="bottom-right"
        show={!loading}
      />

      {/* Word Modal */}
      <AnimatePresence>
        {showWordModal && (
          <WordModal
            isOpen={showWordModal}
            onClose={() => {
              setShowWordModal(false);
              setSelectedWord('');
            }}
            onSubmit={handleWordSubmit}
            initialWord={selectedWord}
            language={userLanguage}
            userId={currentUser?.uid || null}
          />
        )}
      </AnimatePresence>
      
      {/* Subtle Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100/30 dark:bg-purple-900/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
