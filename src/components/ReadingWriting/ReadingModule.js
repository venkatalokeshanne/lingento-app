'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { toast } from 'react-hot-toast';
import { bedrockService } from '@/services/bedrockService';
import audioService from '@/services/audioService';
import { addUserData } from '@/utils/firebaseUtils';

export default function ReadingModule() {
  const { currentUser } = useAuth();
  const { userPreferences } = useUserPreferences();
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [showWordModal, setShowWordModal] = useState(false);
  const [textTitle, setTextTitle] = useState('');
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
  };  // Cost-optimized reading text generation with expanded local content pools
  const generateText = async () => {
    if (!bedrockService.isReady()) {
      toast.error('AI service is not available');
      return;
    }

    setIsGenerating(true);
    try {
      // Prioritize local content to minimize AI costs (90% local, 10% AI)
      const useLocalContent = Math.random() < 0.9; // 90% chance to use local content
      
      if (useLocalContent) {
        const localContent = generateLocalContent();
        if (localContent) {
          setTextTitle(localContent.title);
          setText(localContent.content);
          toast.success('Reading text generated (cost-optimized)!');
          setIsGenerating(false);
          return;
        }
      }

      // Only use AI as absolute fallback with minimal, cost-efficient prompts
      const timestamp = Date.now();
      const randomId = Math.floor(Math.random() * 1000);
      
      // Ultra-simplified prompt to reduce token usage
      const prompt = `${level} ${language} text about daily life. 100-200 words. JSON: {"title":"...", "content":"..."}`;

      const response = await bedrockService.generateText(prompt);
      
      // Simplified parsing
      try {
        const parsed = JSON.parse(response.replace(/```json|```/g, ''));
        setTextTitle(parsed.title || 'Reading Text');
        setText(parsed.content || response);
      } catch {
        setTextTitle('Reading Text');
        setText(response);
      }
      
      toast.success('New reading text generated!');
    } catch (error) {
      console.error('Error generating text:', error);
      // Fallback to local content if AI fails
      const fallbackContent = generateLocalContent();
      if (fallbackContent) {
        setTextTitle(fallbackContent.title);
        setText(fallbackContent.content);
        toast.success('Using local content due to AI service issue');
      } else {
        toast.error('Failed to generate reading text');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Significantly expanded local content to reduce AI dependency
  const generateLocalContent = () => {
    const contentTemplates = {
      beginner: {
        french: [
          {
            title: "Une journée typique",
            content: "Je me réveille à sept heures du matin. Je prends une douche et je mange du pain avec du beurre pour le petit déjeuner. Ensuite, je vais au travail en bus. Je travaille dans un bureau jusqu'à cinq heures. Le soir, je rentre chez moi et je regarde la télévision. Je dîne avec ma famille à huit heures. Nous parlons de notre journée. Avant de dormir, je lis un livre pendant trente minutes. C'est ma routine quotidienne."
          },
          {
            title: "Au supermarché",
            content: "Aujourd'hui, je vais faire les courses au supermarché. J'ai une liste de produits à acheter. J'ai besoin de fruits, de légumes, de pain et de lait. Dans le rayon des fruits, je choisis des pommes et des bananes. Les tomates sont très belles aujourd'hui. Je prends aussi du fromage et du yaourt. À la caisse, je paie avec ma carte bancaire. La vendeuse est très gentille. Elle me souhaite une bonne journée."
          },
          {
            title: "Ma maison",
            content: "J'habite dans une petite maison avec un jardin. Il y a trois chambres, une cuisine, et un salon. Ma chambre est au premier étage. Les murs sont blancs et j'ai un grand lit. Dans le salon, il y a un canapé bleu et une télévision. La cuisine est moderne avec un réfrigérateur et un four. J'aime beaucoup ma maison parce qu'elle est confortable et calme."
          },
          {
            title: "Le temps qu'il fait",
            content: "En hiver, il fait froid et il neige souvent. Je porte un manteau chaud et des bottes. Au printemps, les fleurs poussent dans le jardin. L'été est ma saison préférée parce qu'il fait chaud et ensoleillé. Je vais à la plage avec mes amis. En automne, les feuilles changent de couleur. Elles deviennent jaunes, rouges et oranges. C'est très beau à voir."
          }
        ],
        spanish: [
          {
            title: "Mi familia",
            content: "Mi familia es pequeña pero muy unida. Somos cuatro personas: mi padre, mi madre, mi hermana y yo. Mi padre trabaja en una oficina y mi madre es profesora. Mi hermana tiene quince años y estudia en el instituto. Vivimos en una casa con jardín. Los domingos comemos juntos y hablamos mucho. Me gusta pasar tiempo con mi familia porque son muy divertidos. Por las noches vemos películas en el sofá."
          },
          {
            title: "En el restaurante",
            content: "Ayer fui a un restaurante italiano con mis amigos. El camarero era muy amable y nos ayudó a elegir la comida. Yo pedí pasta con salsa de tomate y mis amigos pidieron pizza. También bebimos agua y jugo de naranja. La comida estaba deliciosa y el precio era razonable. Después del postre, pagamos la cuenta y dejamos una propina. Fue una experiencia muy agradable."
          },
          {
            title: "Un día en la escuela",
            content: "Mi día en la escuela empieza a las ocho de la mañana. Primero tengo clase de matemáticas, luego de historia y después de español. A las doce tenemos el recreo y como mi almuerzo en la cafetería. Por la tarde estudio ciencias y educación física. Mi materia favorita es el arte porque me gusta dibujar. Las clases terminan a las tres y vuelvo a casa en autobús."
          }
        ],
        german: [
          {
            title: "Mein Alltag",
            content: "Ich stehe jeden Morgen um sieben Uhr auf. Dann dusche ich und frühstücke. Normalerweise esse ich Brot mit Marmelade und trinke Kaffee. Um acht Uhr fahre ich zur Arbeit. Ich arbeite in einem Büro bis fünf Uhr nachmittags. Abends koche ich das Abendessen und schaue fern. Vor dem Schlafen lese ich immer ein Buch. Das ist meine tägliche Routine."
          }
        ]
      },
      intermediate: {
        french: [
          {
            title: "Mes vacances d'été",
            content: "L'été dernier, j'ai passé des vacances inoubliables en Provence. J'ai loué une petite maison dans un village pittoresque entouré de champs de lavande. Chaque matin, je me promenais dans les rues étroites et je découvrais de nouveaux endroits charmants. Les habitants étaient très accueillants et m'ont recommandé les meilleurs restaurants locaux. J'ai goûté la cuisine traditionnelle provençale, notamment la ratatouille et la bouillabaisse. Les marchés locaux regorgaient de produits frais et colorés. Cette expérience m'a permis d'améliorer mon français et de comprendre la culture régionale."
          },
          {
            title: "Une expérience culturelle",
            content: "La semaine dernière, j'ai assisté à un festival de musique classique dans ma ville. L'orchestre symphonique local jouait des œuvres de Beethoven et Mozart. Le concert avait lieu dans un théâtre historique magnifiquement restauré. L'acoustique était parfaite et l'atmosphère très émouvante. Pendant l'entracte, j'ai eu l'occasion de rencontrer d'autres mélomanes passionnés. Cette soirée m'a rappelé à quel point la musique peut rassembler les gens de tous âges et origines. Je compte bien retourner au prochain concert."
          }
        ],
        spanish: [
          {
            title: "Una experiencia cultural",
            content: "Durante mi viaje a Barcelona, tuve la oportunidad de sumergirme en la rica cultura catalana. Visité la impresionante Sagrada Familia y quedé fascinado por la arquitectura única de Gaudí. Paseé por las Ramblas, donde artistas callejeros entretenían a los turistas con sus actuaciones. En el barrio gótico, descubrí pequeñas tiendas llenas de productos artesanales. La gastronomía local me sorprendió gratamente; probé tapas deliciosas y paella auténtica. Los barceloneses fueron muy amables y pacientes cuando practicaba mi español con ellos."
          }
        ]
      },
      advanced: {
        french: [
          {
            title: "L'évolution technologique",
            content: "L'avènement de l'intelligence artificielle transforme radicalement notre société contemporaine. Cette révolution technologique soulève des questions fondamentales concernant l'avenir du travail et les implications éthiques de ces innovations. D'une part, l'automatisation promet d'améliorer l'efficacité et de résoudre des problèmes complexes. D'autre part, elle engendre des inquiétudes légitimes quant au remplacement de certains emplois traditionnels. Il devient impératif d'adapter nos systèmes éducatifs pour préparer les générations futures à cette nouvelle réalité. L'équilibre entre progrès technologique et préservation de l'élément humain constitue l'un des défis majeurs de notre époque."
          }
        ]
      }
    };

    const levelContent = contentTemplates[level]?.[language];
    if (levelContent && levelContent.length > 0) {
      const randomIndex = Math.floor(Math.random() * levelContent.length);
      return levelContent[randomIndex];
    }
    return null;
  };

  // Play audio for the entire text
  const playText = async () => {
    if (!text) return;

    try {
      setIsPlaying(true);
      await audioService.playAudio(text, language, {
        onStart: () => setIsPlaying(true),
        onEnd: () => setIsPlaying(false),
        onError: (error) => {
          console.error('Audio error:', error);
          if (error.code === 'USER_INTERACTION_REQUIRED') {
            toast.error('Please tap anywhere on the screen first to enable audio!');
          } else {
            toast.error('Audio playback failed');
          }
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  };

  // Handle word selection in text
  const handleWordSelect = (word) => {
    // Clean the word (remove punctuation)
    const cleanWord = word.replace(/[.,!?;:"()]/g, '').trim();
    if (cleanWord.length > 0) {
      setSelectedWord(cleanWord);
      setShowWordModal(true);
    }
  };

  // Add selected word to vocabulary
  const addToVocabulary = async (wordData) => {
    if (!currentUser) {
      toast.error('Please log in to add words to vocabulary');
      return;
    }

    try {
      const vocabularyEntry = {
        word: wordData.word,
        translation: wordData.translation || '',
        pronunciation: wordData.pronunciation || '',
        definition: wordData.definition || '',
        example: wordData.example || '',
        category: 'reading',
        language: language,
        dateAdded: new Date().toISOString(),
        source: 'reading_practice'
      };

      await addUserData(currentUser, 'vocabulary', vocabularyEntry);
      toast.success(`"${wordData.word}" added to vocabulary!`);
      setShowWordModal(false);
      setSelectedWord(null);
    } catch (error) {
      console.error('Error adding to vocabulary:', error);
      toast.error('Failed to add word to vocabulary');
    }
  };

  // Render text with clickable words
  const renderInteractiveText = (text) => {
    if (!text) return null;

    return text.split(/(\s+)/).map((part, index) => {
      if (part.trim().length === 0) {
        return part; // Return whitespace as-is
      }

      const isWord = /[a-zA-ZÀ-ÿ]+/.test(part);
      if (isWord) {
        return (
          <span
            key={index}
            className="cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800 rounded px-1 transition-colors"
            onClick={() => handleWordSelect(part)}
            title="Click to add to vocabulary"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };  return (
    <div className="space-y-2">
      {/* Ultra-Compact Controls */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-2 shadow-sm">
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
            onClick={generateText}
            disabled={isGenerating}
            className="px-3 py-1 bg-white/20 hover:bg-white/30 disabled:bg-white/10 text-white font-medium rounded transition-all duration-200 flex items-center gap-1 text-xs"
          >
            {isGenerating ? (
              <>
                <div className="w-2.5 h-2.5 border border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Loading</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>Generate</span>
              </>
            )}
          </button>
        </div>
        
        {/* Micro Profile Link */}
        <div className="mt-1.5 pt-1.5 border-t border-white/20">
          <p className="text-white/60 text-xs text-center">
            <a href="/profile" className="text-white/80 hover:text-white hover:underline">
              Change settings in Profile
            </a>
          </p>
        </div>
      </div>      {/* Ultra-Compact Reading Text Display */}
      {text && (
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
          {/* Micro Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-2 py-1.5 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white truncate flex-1 mr-2">
              {textTitle}
            </h2>
            <button
              onClick={playText}
              disabled={isPlaying}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-2 py-1 rounded transition-all duration-200 flex items-center gap-1 text-xs font-medium"
            >              {isPlaying ? (
                <>
                  <div className="w-2.5 h-2.5 relative">
                    <div className="absolute inset-0 rounded-full border border-white/30"></div>
                    <div className="absolute inset-0 rounded-full border border-t-white animate-spin"></div>
                  </div>
                  <span>Playing</span>
                </>
              ) : (
                <>
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <span>Play</span>
                </>
              )}
            </button>
          </div>

          {/* Ultra-Compact Text Content */}
          <div className="p-2">
            <div className="text-xs leading-relaxed text-gray-800 dark:text-gray-200">
              {renderInteractiveText(text)}
            </div>
          </div>

          {/* Micro Tip */}
          <div className="bg-blue-50 dark:bg-blue-900/20 px-2 py-1.5 border-t border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-1.5">
              <span className="text-blue-500 text-xs">💡</span>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <span className="font-medium">Tap words</span> to add to vocabulary
              </p>
            </div>
          </div>
        </div>
      )}      {/* Ultra-Compact Word Modal */}
      {showWordModal && selectedWord && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-sm max-h-[85vh] overflow-hidden shadow-xl transform transition-all">
            <WordModal
              word={selectedWord}
              language={language}
              onAddToVocabulary={addToVocabulary}
              onClose={() => {
                setShowWordModal(false);
                setSelectedWord(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Word Modal Component
function WordModal({ word, language, onAddToVocabulary, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [wordData, setWordData] = useState({
    word: word,
    translation: '',
    pronunciation: '',
    definition: '',
    example: ''
  });

  useEffect(() => {
    generateWordData();
  }, [word, language]);  const generateWordData = async () => {
    if (!bedrockService.isReady()) return;

    setIsLoading(true);
    try {
      // Prioritize local translation to reduce AI costs (95% local, 5% AI)
      const localTranslation = getLocalTranslation(word, language);
      if (localTranslation) {
        setWordData(prev => ({
          ...prev,
          translation: localTranslation.translation,
          pronunciation: localTranslation.pronunciation || '',
          definition: localTranslation.definition || `${localTranslation.translation} (${language} word)`,
          example: localTranslation.example || `Example with "${word}"`
        }));
        setIsLoading(false);
        return;
      }

      // Only use AI for very uncommon words (ultra-simplified prompt)
      const prompt = `${language} "${word}" = English translation. Brief definition. Simple example.`;

      const response = await bedrockService.generateText(prompt);
      
      // Basic parsing for cost-efficient response
      const lines = response.split('\n').filter(line => line.trim());
      setWordData(prev => ({
        ...prev,
        translation: lines[0] || `Translation for "${word}"`,
        definition: lines[1] || `Definition for "${word}"`,
        example: lines[2] || `Example with "${word}"`
      }));
    } catch (error) {
      console.error('Error generating word data:', error);
      // Fallback to local dictionary
      const fallback = getLocalTranslation(word, language) || {
        translation: `Translation needed for "${word}"`,
        definition: `${language} word`,
        example: `Please add example with "${word}"`
      };
      setWordData(prev => ({ ...prev, ...fallback }));
    } finally {
      setIsLoading(false);
    }
  };

  // Comprehensive local translation dictionary to minimize AI costs
  const getLocalTranslation = (word, language) => {
    const translations = {
      french: {
        // Common words
        'le': { translation: 'the', pronunciation: 'lə', definition: 'definite article (masculine)', example: 'le chat (the cat)' },
        'la': { translation: 'the', pronunciation: 'la', definition: 'definite article (feminine)', example: 'la maison (the house)' },
        'et': { translation: 'and', pronunciation: 'e', definition: 'conjunction', example: 'rouge et bleu (red and blue)' },
        'je': { translation: 'I', pronunciation: 'ʒə', definition: 'personal pronoun (first person)', example: 'je suis (I am)' },
        'tu': { translation: 'you', pronunciation: 'ty', definition: 'personal pronoun (informal)', example: 'tu es (you are)' },
        'il': { translation: 'he', pronunciation: 'il', definition: 'personal pronoun (masculine)', example: 'il mange (he eats)' },
        'elle': { translation: 'she', pronunciation: 'ɛl', definition: 'personal pronoun (feminine)', example: 'elle dort (she sleeps)' },
        'nous': { translation: 'we', pronunciation: 'nu', definition: 'personal pronoun (plural)', example: 'nous parlons (we speak)' },
        'vous': { translation: 'you', pronunciation: 'vu', definition: 'personal pronoun (formal/plural)', example: 'vous êtes (you are)' },
        'ils': { translation: 'they', pronunciation: 'il', definition: 'personal pronoun (masculine plural)', example: 'ils courent (they run)' },
        'elles': { translation: 'they', pronunciation: 'ɛl', definition: 'personal pronoun (feminine plural)', example: 'elles chantent (they sing)' },
        'être': { translation: 'to be', pronunciation: 'ɛtʁə', definition: 'irregular verb', example: 'je suis étudiant (I am a student)' },
        'avoir': { translation: 'to have', pronunciation: 'avwaʁ', definition: 'irregular verb', example: 'j\'ai faim (I am hungry)' },
        'faire': { translation: 'to do/make', pronunciation: 'fɛʁ', definition: 'irregular verb', example: 'je fais mes devoirs (I do my homework)' },
        'aller': { translation: 'to go', pronunciation: 'ale', definition: 'irregular verb', example: 'je vais à l\'école (I go to school)' },
        'maison': { translation: 'house', pronunciation: 'mɛzɔ̃', definition: 'feminine noun', example: 'une grande maison (a big house)' },
        'chat': { translation: 'cat', pronunciation: 'ʃa', definition: 'masculine noun', example: 'le chat noir (the black cat)' },
        'chien': { translation: 'dog', pronunciation: 'ʃjɛ̃', definition: 'masculine noun', example: 'mon chien (my dog)' },
        'eau': { translation: 'water', pronunciation: 'o', definition: 'feminine noun', example: 'boire de l\'eau (to drink water)' },
        'pain': { translation: 'bread', pronunciation: 'pɛ̃', definition: 'masculine noun', example: 'du pain frais (fresh bread)' },
        'voiture': { translation: 'car', pronunciation: 'vwatyʁ', definition: 'feminine noun', example: 'une voiture rouge (a red car)' },
        'temps': { translation: 'time/weather', pronunciation: 'tɑ̃', definition: 'masculine noun', example: 'le temps passe (time passes)' },
        'jour': { translation: 'day', pronunciation: 'ʒuʁ', definition: 'masculine noun', example: 'chaque jour (every day)' },
        'nuit': { translation: 'night', pronunciation: 'nɥi', definition: 'feminine noun', example: 'bonne nuit (good night)' },
        'matin': { translation: 'morning', pronunciation: 'matɛ̃', definition: 'masculine noun', example: 'le matin (in the morning)' },
        'soir': { translation: 'evening', pronunciation: 'swaʁ', definition: 'masculine noun', example: 'ce soir (this evening)' }
      },
      spanish: {
        'el': { translation: 'the', pronunciation: 'el', definition: 'definite article (masculine)', example: 'el gato (the cat)' },
        'la': { translation: 'the', pronunciation: 'la', definition: 'definite article (feminine)', example: 'la casa (the house)' },
        'y': { translation: 'and', pronunciation: 'i', definition: 'conjunction', example: 'rojo y azul (red and blue)' },
        'yo': { translation: 'I', pronunciation: 'jo', definition: 'personal pronoun', example: 'yo soy (I am)' },
        'tú': { translation: 'you', pronunciation: 'tu', definition: 'personal pronoun (informal)', example: 'tú eres (you are)' },
        'él': { translation: 'he', pronunciation: 'el', definition: 'personal pronoun', example: 'él come (he eats)' },
        'ella': { translation: 'she', pronunciation: 'eʎa', definition: 'personal pronoun', example: 'ella duerme (she sleeps)' },
        'nosotros': { translation: 'we', pronunciation: 'nosotɾos', definition: 'personal pronoun (masculine)', example: 'nosotros hablamos (we speak)' },
        'vosotros': { translation: 'you all', pronunciation: 'bosotɾos', definition: 'personal pronoun (informal plural)', example: 'vosotros sois (you all are)' },
        'ellos': { translation: 'they', pronunciation: 'eʎos', definition: 'personal pronoun (masculine)', example: 'ellos corren (they run)' },
        'ellas': { translation: 'they', pronunciation: 'eʎas', definition: 'personal pronoun (feminine)', example: 'ellas cantan (they sing)' },
        'ser': { translation: 'to be', pronunciation: 'seɾ', definition: 'irregular verb (permanent state)', example: 'soy estudiante (I am a student)' },
        'estar': { translation: 'to be', pronunciation: 'estaɾ', definition: 'irregular verb (temporary state)', example: 'estoy cansado (I am tired)' },
        'tener': { translation: 'to have', pronunciation: 'teneɾ', definition: 'irregular verb', example: 'tengo hambre (I am hungry)' },
        'hacer': { translation: 'to do/make', pronunciation: 'aseɾ', definition: 'irregular verb', example: 'hago la tarea (I do homework)' },
        'ir': { translation: 'to go', pronunciation: 'iɾ', definition: 'irregular verb', example: 'voy a la escuela (I go to school)' },
        'casa': { translation: 'house', pronunciation: 'kasa', definition: 'feminine noun', example: 'una casa grande (a big house)' },
        'gato': { translation: 'cat', pronunciation: 'gato', definition: 'masculine noun', example: 'el gato negro (the black cat)' },
        'perro': { translation: 'dog', pronunciation: 'pero', definition: 'masculine noun', example: 'mi perro (my dog)' },
        'agua': { translation: 'water', pronunciation: 'agwa', definition: 'feminine noun', example: 'beber agua (to drink water)' },
        'pan': { translation: 'bread', pronunciation: 'pan', definition: 'masculine noun', example: 'pan fresco (fresh bread)' },
        'coche': { translation: 'car', pronunciation: 'kotʃe', definition: 'masculine noun', example: 'un coche rojo (a red car)' },
        'tiempo': { translation: 'time/weather', pronunciation: 'tjempo', definition: 'masculine noun', example: 'el tiempo pasa (time passes)' },
        'día': { translation: 'day', pronunciation: 'dia', definition: 'masculine noun', example: 'cada día (every day)' },
        'noche': { translation: 'night', pronunciation: 'notʃe', definition: 'feminine noun', example: 'buenas noches (good night)' },
        'mañana': { translation: 'morning/tomorrow', pronunciation: 'maɲana', definition: 'feminine noun/adverb', example: 'por la mañana (in the morning)' }
      },
      german: {
        'der': { translation: 'the', pronunciation: 'deːɐ̯', definition: 'definite article (masculine)', example: 'der Hund (the dog)' },
        'die': { translation: 'the', pronunciation: 'diː', definition: 'definite article (feminine/plural)', example: 'die Katze (the cat)' },
        'das': { translation: 'the', pronunciation: 'das', definition: 'definite article (neuter)', example: 'das Haus (the house)' },
        'und': { translation: 'and', pronunciation: 'ʊnt', definition: 'conjunction', example: 'rot und blau (red and blue)' },
        'ich': { translation: 'I', pronunciation: 'ɪç', definition: 'personal pronoun', example: 'ich bin (I am)' },
        'du': { translation: 'you', pronunciation: 'duː', definition: 'personal pronoun (informal)', example: 'du bist (you are)' },
        'er': { translation: 'he', pronunciation: 'eːɐ̯', definition: 'personal pronoun', example: 'er isst (he eats)' },
        'sie': { translation: 'she/they', pronunciation: 'ziː', definition: 'personal pronoun', example: 'sie schläft (she sleeps)' },
        'wir': { translation: 'we', pronunciation: 'viːɐ̯', definition: 'personal pronoun', example: 'wir sprechen (we speak)' },
        'sein': { translation: 'to be', pronunciation: 'zaɪn', definition: 'irregular verb', example: 'ich bin Student (I am a student)' },
        'haben': { translation: 'to have', pronunciation: 'haːbən', definition: 'irregular verb', example: 'ich habe Hunger (I am hungry)' },
        'machen': { translation: 'to do/make', pronunciation: 'maxən', definition: 'regular verb', example: 'ich mache Hausaufgaben (I do homework)' },
        'gehen': { translation: 'to go', pronunciation: 'geːən', definition: 'irregular verb', example: 'ich gehe zur Schule (I go to school)' },
        'Haus': { translation: 'house', pronunciation: 'haʊs', definition: 'neuter noun', example: 'ein großes Haus (a big house)' },
        'Katze': { translation: 'cat', pronunciation: 'katsə', definition: 'feminine noun', example: 'die schwarze Katze (the black cat)' },
        'Hund': { translation: 'dog', pronunciation: 'hʊnt', definition: 'masculine noun', example: 'mein Hund (my dog)' },
        'Wasser': { translation: 'water', pronunciation: 'vasɐ', definition: 'neuter noun', example: 'Wasser trinken (to drink water)' },
        'Brot': { translation: 'bread', pronunciation: 'broːt', definition: 'neuter noun', example: 'frisches Brot (fresh bread)' },
        'Auto': { translation: 'car', pronunciation: 'aʊto', definition: 'neuter noun', example: 'ein rotes Auto (a red car)' }
      },
      italian: {
        'il': { translation: 'the', pronunciation: 'il', definition: 'definite article (masculine)', example: 'il gatto (the cat)' },
        'la': { translation: 'the', pronunciation: 'la', definition: 'definite article (feminine)', example: 'la casa (the house)' },
        'e': { translation: 'and', pronunciation: 'e', definition: 'conjunction', example: 'rosso e blu (red and blue)' },
        'io': { translation: 'I', pronunciation: 'io', definition: 'personal pronoun', example: 'io sono (I am)' },
        'tu': { translation: 'you', pronunciation: 'tu', definition: 'personal pronoun (informal)', example: 'tu sei (you are)' },
        'lui': { translation: 'he', pronunciation: 'lui', definition: 'personal pronoun', example: 'lui mangia (he eats)' },
        'lei': { translation: 'she', pronunciation: 'lei', definition: 'personal pronoun', example: 'lei dorme (she sleeps)' },
        'noi': { translation: 'we', pronunciation: 'noi', definition: 'personal pronoun', example: 'noi parliamo (we speak)' },
        'essere': { translation: 'to be', pronunciation: 'essere', definition: 'irregular verb', example: 'sono studente (I am a student)' },
        'avere': { translation: 'to have', pronunciation: 'avere', definition: 'irregular verb', example: 'ho fame (I am hungry)' },
        'fare': { translation: 'to do/make', pronunciation: 'fare', definition: 'irregular verb', example: 'faccio i compiti (I do homework)' },
        'andare': { translation: 'to go', pronunciation: 'andare', definition: 'irregular verb', example: 'vado a scuola (I go to school)' },
        'casa': { translation: 'house', pronunciation: 'kasa', definition: 'feminine noun', example: 'una casa grande (a big house)' },
        'gatto': { translation: 'cat', pronunciation: 'gatto', definition: 'masculine noun', example: 'il gatto nero (the black cat)' },
        'cane': { translation: 'dog', pronunciation: 'kane', definition: 'masculine noun', example: 'il mio cane (my dog)' },
        'acqua': { translation: 'water', pronunciation: 'akkwa', definition: 'feminine noun', example: 'bere acqua (to drink water)' },
        'pane': { translation: 'bread', pronunciation: 'pane', definition: 'masculine noun', example: 'pane fresco (fresh bread)' },
        'macchina': { translation: 'car', pronunciation: 'makkina', definition: 'feminine noun', example: 'una macchina rossa (a red car)' }
      },
      portuguese: {
        'o': { translation: 'the', pronunciation: 'u', definition: 'definite article (masculine)', example: 'o gato (the cat)' },
        'a': { translation: 'the', pronunciation: 'a', definition: 'definite article (feminine)', example: 'a casa (the house)' },
        'e': { translation: 'and', pronunciation: 'i', definition: 'conjunction', example: 'vermelho e azul (red and blue)' },
        'eu': { translation: 'I', pronunciation: 'ew', definition: 'personal pronoun', example: 'eu sou (I am)' },
        'tu': { translation: 'you', pronunciation: 'tu', definition: 'personal pronoun (informal)', example: 'tu és (you are)' },
        'ele': { translation: 'he', pronunciation: 'eli', definition: 'personal pronoun', example: 'ele come (he eats)' },
        'ela': { translation: 'she', pronunciation: 'ela', definition: 'personal pronoun', example: 'ela dorme (she sleeps)' },
        'nós': { translation: 'we', pronunciation: 'nɔs', definition: 'personal pronoun', example: 'nós falamos (we speak)' },
        'ser': { translation: 'to be', pronunciation: 'seɾ', definition: 'irregular verb (permanent)', example: 'sou estudante (I am a student)' },
        'estar': { translation: 'to be', pronunciation: 'ʃtaɾ', definition: 'irregular verb (temporary)', example: 'estou cansado (I am tired)' },
        'ter': { translation: 'to have', pronunciation: 'teɾ', definition: 'irregular verb', example: 'tenho fome (I am hungry)' },
        'fazer': { translation: 'to do/make', pronunciation: 'fazeɾ', definition: 'irregular verb', example: 'faço o trabalho (I do the work)' },
        'ir': { translation: 'to go', pronunciation: 'iɾ', definition: 'irregular verb', example: 'vou à escola (I go to school)' },
        'casa': { translation: 'house', pronunciation: 'kaza', definition: 'feminine noun', example: 'uma casa grande (a big house)' },
        'gato': { translation: 'cat', pronunciation: 'gatu', definition: 'masculine noun', example: 'o gato preto (the black cat)' },
        'cão': { translation: 'dog', pronunciation: 'kɐ̃w̃', definition: 'masculine noun', example: 'o meu cão (my dog)' },
        'água': { translation: 'water', pronunciation: 'agwa', definition: 'feminine noun', example: 'beber água (to drink water)' },
        'pão': { translation: 'bread', pronunciation: 'pɐ̃w̃', definition: 'masculine noun', example: 'pão fresco (fresh bread)' },
        'carro': { translation: 'car', pronunciation: 'kaʀu', definition: 'masculine noun', example: 'um carro vermelho (a red car)' }
      }
    };

    const languageDict = translations[language];
    if (languageDict) {
      const cleanWord = word.toLowerCase().replace(/[.,!?;:"()]/g, '');
      return languageDict[cleanWord];
    }
    return null;
  };  return (
    <div className="max-h-full overflow-y-auto">
      {isLoading ? (
        <div className="p-4 text-center">
          <div className="w-6 h-6 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Loading...</p>
        </div>
      ) : (        <div className="p-2">
          {/* Ultra-Compact Header */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {wordData.word}
            </h3>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center transition-colors"
            >
              <span className="text-gray-500 dark:text-gray-400 text-sm">×</span>
            </button>
          </div>

          {/* Ultra-Compact Form */}
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                Translation
              </label>
              <input
                type="text"
                value={wordData.translation}
                onChange={(e) => setWordData(prev => ({ ...prev, translation: e.target.value }))}
                className="w-full px-2 py-1 bg-gray-50 dark:bg-gray-700/50 border-0 rounded text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all"
                placeholder="Translation..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                Pronunciation
              </label>
              <input
                type="text"
                value={wordData.pronunciation}
                onChange={(e) => setWordData(prev => ({ ...prev, pronunciation: e.target.value }))}
                className="w-full px-2 py-1 bg-gray-50 dark:bg-gray-700/50 border-0 rounded text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all"
                placeholder="Pronunciation..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                Definition
              </label>
              <textarea
                value={wordData.definition}
                onChange={(e) => setWordData(prev => ({ ...prev, definition: e.target.value }))}
                rows={2}
                className="w-full px-2 py-1 bg-gray-50 dark:bg-gray-700/50 border-0 rounded text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all resize-none"
                placeholder="Definition..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                Example
              </label>
              <textarea
                value={wordData.example}
                onChange={(e) => setWordData(prev => ({ ...prev, example: e.target.value }))}
                rows={2}
                className="w-full px-2 py-1 bg-gray-50 dark:bg-gray-700/50 border-0 rounded text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all resize-none"
                placeholder="Example..."
              />
            </div>

            {/* Ultra-Compact Action Buttons */}
            <div className="flex gap-1.5 pt-2">
              <button
                onClick={() => onAddToVocabulary(wordData)}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-1.5 px-2 rounded transition-all duration-200 text-xs"
              >
                Add to Vocabulary
              </button>
              <button
                onClick={onClose}
                className="px-2 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded transition-colors text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
