import { AppState } from './types';

export const MOODS = [
    'Cinematic',
    'Cosmic',
    'Creative',
    'Darkly poetic',
    'Disciplined',
    'Empowered',
    'Funny',
    'Healing',
    'Hopeful',
    'Inspirational',
    'Mindful',
    'Philosophical',
    'Playful',
    'Rebellious',
    'Romantic',
    'Sovereignty',
    'Stoic'
].sort();


export const PANTHEON_DATA = {
  ethicalStatement: 'This work celebrates ideas that expand empathy, freedom, and self-knowledge. It draws from philosophy, literature, mysticism, and modern psychology—but not blindly. Some figures shaped thought while upholding systems that contradicted the very principles they taught. We’vechosen to exclude those who endorsed or profited from human enslavement or systemic cruelty, and to retain only those whose ideas can still serve growth, peace, and liberation in 2025 and beyond. Context matters, but integrity matters more. You can reference the following pantheon for inspiration—or input your own notable speaker and let the AI pull a quote for you. The following curated collection is roughly 59% men and 41% women, an almost impossible balance for a body of work spanning 2,500 years of human history.',
  categories: [
    {
      name: 'Philosophers',
      description: 'Seekers of truth, reason, and the examined life—voices that shaped how humanity thinks about existence, ethics, and meaning.',
      thinkers: [
        { name: 'Baruch Spinoza', bio: '(1632–1777) Rationalist pantheist; saw God and nature as one.', quote: 'The highest activity a human being can attain is learning for understanding, because to understand is to be free.' },
        { name: 'Epicurus', bio: '(341–270 BCE) Ancient Greek philosopher; advocated for a life of modest pleasure and tranquility.', quote: 'Do not spoil what you have by desiring what you have not.' },
        { name: 'Friedrich Nietzsche', bio: '(1844–1900) Existentialist philosopher; challenged morality and conformity.', quote: 'He who has a why to live for can bear almost any how.' },
        { name: 'Hannah Arendt', bio: '(1906–1975) Political theorist; examined power, evil, and moral choice.', quote: 'The most radical revolutionary will become a conservative the day after the revolution.' },
        { name: 'Immanuel Kant', bio: '(1724–1804) Central figure in modern philosophy; his later ethics emphasized universal dignity.', quote: 'Science is organized knowledge. Wisdom is organized life.' },
        { name: 'Jean-Paul Sartre', bio: '(1905–1980) Existentialist philosopher; explored freedom and responsibility.', quote: 'Freedom is what you do with what’s been done to you.' },
        { name: 'John Stuart Mill', bio: '(1806–1873) Philosopher and political economist; proponent of utilitarianism and liberty.', quote: 'A person may cause evil to others not only by his actions but by his inaction.' },
        { name: 'Lao Tzu', bio: '(6th century BCE, traditional dates) Ancient Chinese philosopher; taught effortless harmony.', quote: 'Nature does not hurry, yet everything is accomplished.' },
        { name: 'Ludwig Wittgenstein', bio: '(1889–1951) Philosopher of language; explored the limits of thought.', quote: 'The limits of my language mean the limits of my world.' },
        { name: 'Plato', bio: '(427–347 BCE) Athenian philosopher; wrote on justice, beauty, and equality.', quote: 'The greatest wealth is to live content with little.' },
        { name: 'René Descartes', bio: '(1596–1650) Father of modern philosophy; fused logic and doubt into discovery.', quote: 'The reading of all good books is like a conversation with the finest minds of past centuries.' },
        { name: 'Simone de Beauvoir', bio: '(1908–1986) Feminist philosopher and author of “The Second Sex.”', quote: 'One is not born, but rather becomes, a woman.' },
        { name: 'Socrates', bio: '(470–399 BCE) Classical Greek philosopher; questioned everything to reach truth.', quote: 'The unexamined life is not worth living.' },
        { name: 'Thomas Hobbes', bio: '(1588–1679) Political philosopher; theorized the social contract and human order.', quote: 'Covenants without the sword are but words and of no strength to secure a man at all.' }
      ].sort((a, b) => a.name.localeCompare(b.name))
    },
    {
      name: 'Modern Thinkers',
      description: 'Contemporary minds who bridge intellect, vulnerability, and creativity—blending reason with heart and humanity.',
      thinkers: [
        { name: 'Ada Lovelace', bio: '(1815–1852) Visionary mathematician; poetic about machinery and mind.', quote: 'Imagination is the discovering faculty, pre-eminently.' },
        { name: 'Alan Watts', bio: '(1915–1973) Philosophical entertainer; translated Eastern wisdom for Western minds.', quote: 'You are an aperture through which the universe is looking at and exploring itself.' },
        { name: 'Albert Einstein', bio: '(1879–1955) Physicist and humanist; humility wrapped in genius.', quote: 'Life is like riding a bicycle. To keep your balance you must keep moving.' },
        { name: 'Audre Lorde', bio: '(1934–1992) Poet and activist; wielded words as tools for liberation.', quote: 'Your silence will not protect you.' },
        { name: 'Brené Brown', bio: '(b. 1965) Researcher and storyteller; studies vulnerability and courage.', quote: 'Vulnerability is the birthplace of innovation, creativity, and change.' },
        { name: 'Buckminster Fuller', bio: '(1895–1983) Futurist and inventor; designed for a sustainable world.', quote: 'You never change things by fighting the existing reality. Build a new model that makes the old one obsolete.' },
        { name: 'Carl Jung', bio: '(1875–1961) Depth psychologist; mapped the unconscious and archetypes.', quote: 'Who looks outside, dreams; who looks inside, awakes.' },
        { name: 'David Whyte', bio: '(b. 1955) Poet-philosopher; explores the conversational nature of reality.', quote: 'Courage is the measure of our heartfelt participation with life.' }
      ].sort((a, b) => a.name.localeCompare(b.name))
    },
    {
      name: 'Mystics & Manifestors',
      description: 'Writers and teachers who dissolve the line between spirit and matter—merging poetry, faith, and awareness.',
      thinkers: [
        { name: 'Florence Scovel Shinn', bio: '(1871–1940) Metaphysical teacher; united spiritual principle and practical manifestation.', quote: 'Your word is your wand.' },
        { name: 'Kahlil Gibran', bio: '(1883–1931) Poet-philosopher; author of “The Prophet.”', quote: 'Out of suffering have emerged the strongest souls.' },
        { name: 'Mirabai', bio: '(c. 1498–1546) Indian mystic and poet devoted to Krishna; sang of love and union.', quote: 'I am mad with love, and no one understands my joy.' },
        { name: 'Osho', bio: '(1931–1990) Indian mystic and teacher; celebrated awareness and play.', quote: 'Be—don’t try to become.' },
        { name: 'Paramahansa Yogananda', bio: '(1893–1952) Indian yogi and spiritual teacher; brought Eastern spirituality westward.', quote: 'The season of failure is the best time for sowing the seeds of success.' },
        { name: 'Pema Chödrön', bio: '(b. 1936) American Buddhist nun; teaches compassion through presence.', quote: 'Nothing ever goes away until it has taught us what we need to know.' },
        { name: 'Rumi', bio: '(1207–1273) Persian poet and Sufi mystic; wrote of divine love and transformation.', quote: 'The wound is the place where the Light enters you.' }
      ].sort((a, b) => a.name.localeCompare(b.name))
    },
    {
      name: 'Strategic Minds',
      description: 'Masters of timing, adaptability, and clear thought—thinkers who saw life as artful strategy.',
      thinkers: [
        { name: 'Miyamoto Musashi', bio: '(1584–1645) Samurai philosopher; wrote “The Book of Five Rings.”', quote: 'Perceive that which cannot be seen with the eye.' },
        { name: 'Niccolò Machiavelli', bio: '(1469–1527) Renaissance strategist; analyzed power and leadership.', quote: 'The lion cannot protect himself from traps, and the fox cannot defend himself from wolves. One must therefore be both.' },
        { name: 'Sun Tzu', bio: '(544–496 BCE) Chinese strategist; author of “The Art of War.”', quote: 'In the midst of chaos, there is also opportunity.' },
        { name: 'T. E. Lawrence', bio: '(1888–1935) Scholar-soldier and writer; fused intellect and action.', quote: 'All men dream, but not equally.' }
      ].sort((a, b) => a.name.localeCompare(b.name))
    },
    {
      name: 'Rebels',
      description: 'Rule-breakers and visionaries who reshaped art, politics, and identity—proof that resistance can become revelation.',
      thinkers: [
        { name: 'Frida Kahlo', bio: '(1907–1954) Painter; transformed pain into color and symbolism.', quote: 'I never paint dreams or nightmares, I paint my own reality.' },
        { name: 'Harvey Milk', bio: '(1930–1978) LGBTQ+ rights pioneer; embodied courage and compassion.', quote: 'Hope will never be silent.' },
        { name: 'Malala Yousafzai', bio: '(b. 1997) Activist for girls’ education; youngest Nobel laureate.', quote: 'One child, one teacher, one book, one pen can change the world.' },
        { name: 'Muhammad Ali', bio: '(1942–2016) Champion and civil rights icon; turned bravado into poetry.', quote: 'Don’t count the days; make the days count.' },
        { name: 'Nelson Mandela', bio: '(1918–2013) Freedom fighter and president of South Africa; practiced forgiveness as strength.', quote: 'The greatest glory in living lies not in never falling, but in rising every time we fall.' },
        { name: 'Rosa Parks', bio: '(1913–2005) Civil rights activist; ignited a movement through quiet defiance.', quote: 'I have learned over the years that when one’s mind is made up, this diminishes fear.' }
      ].sort((a, b) => a.name.localeCompare(b.name))
    },
    {
      name: 'Luminaries',
      description: 'Visionaries who expanded human understanding—curiosity and compassion reshaped how we see the universe.',
      thinkers: [
        { name: 'Carl Sagan', bio: '(1934–1996) Astronomer and communicator; taught cosmic wonder.', quote: 'Somewhere, something incredible is waiting to be known.' },
        { name: 'Florence Nightingale', bio: '(1820–1910) Founder of modern nursing; merged science and empathy.', quote: 'I attribute my success to this: I never gave or took any excuse.' },
        { name: 'Galileo Galilei', bio: '(1564–1642) Astronomer and physicist; father of modern science.', quote: 'All truths are easy to understand once they are discovered; the point is to discover them.' },
        { name: 'Leonardo da Vinci', bio: '(1452–19) Renaissance polymath; embodied curiosity and precision.', quote: 'Simplicity is the ultimate sophistication.' },
        { name: 'Nikola Tesla', bio: '(1856–1943) Inventor and futurist; saw the future in electric form.', quote: 'The present is theirs; the future, for which I have really worked, is mine.' },
        { name: 'Rachel Carson', bio: '(1907–1964) Marine biologist and conservationist; awakened ecological awareness.', quote: 'Those who contemplate the beauty of the earth find reserves of strength that will endure as long as life lasts.' },
        { name: 'Stephen Hawking', bio: '(1942–2018) Theoretical physicist; merged intellect with humor.', quote: 'Intelligence is the ability to adapt to change.' }
      ].sort((a, b) => a.name.localeCompare(b.name))
    },
    {
      name: 'Authors & Storytellers',
      description: 'Writers who gave emotion architecture—translating love, struggle, and wonder into words that echo through time.',
      thinkers: [
        { name: 'Adrienne Rich', bio: '(1929–2012) Poet and essayist; truth as a form of resistance.', quote: 'When a woman tells the truth she is creating the possibility for more truth around her.' },
        { name: 'Albert Camus', bio: '(1913–1960) Existential humanist; saw meaning in defiance.', quote: 'In the depth of winter, I finally learned that within me there lay an invincible summer.' },
        { name: 'Anne Lamott', bio: '(b. 1954) Spiritual writer; humorous and unguarded.', quote: 'Almost everything will work again if you unplug it for a few minutes, including you.' },
        { name: 'bell hooks', bio: '(1952–2021) Cultural critic and feminist; wrote of love and freedom.', quote: 'The moment we choose to love we begin to move toward freedom.' },
        { name: 'Chimamanda Ngozi Adichie', bio: '(b. 1977) Novelist and feminist; gives voice to complexity.', quote: 'We teach girls to shrink themselves, to make themselves smaller.' },
        { name: 'Clarissa Pinkola Estés', bio: '(b. 1945) Poet and psychoanalyst; reclaimed the wild feminine.', quote: 'Be wild; that is how to clear the river.' },
        { name: 'F. Scott Fitzgerald', bio: '(1896–1940) Novelist; romantic fatalist of ambition and loss.', quote: 'So we beat on, boats against the current, borne back ceaselessly into the past.' },
        { name: 'George Orwell', bio: '(1903–1950) Essayist; defender of truth and moral clarity.', quote: 'In a time of deceit, telling the truth is a revolutionary act.' },
        { name: 'Gloria Steinem', bio: '(b. 1934) Journalist and activist; fearless voice of modern feminism.', quote: 'The truth will set you free, but first it will piss you off.' },
        { name: 'James Baldwin', bio: '(1924–1987) Essayist and novelist; illuminated race, love, and justice.', quote: 'Not everything that is faced can be changed, but nothing can be changed until it is faced.' },
        { name: 'Joan Didion', bio: '(1934–2021) Essayist and novelist; captured fragility and control.', quote: 'We tell ourselves stories in order to live.' },
        { name: 'Margaret Atwood', bio: '(b. 1939) Novelist and poet; fierce chronicler of power and imagination.', quote: 'A word after a word after a word is power.' },
        { name: 'Mary Oliver', bio: '(1935–2019) Poet; revealed holiness in simplicity.', quote: 'Tell me, what is it you plan to do with your one wild and precious life?' },
        { name: 'Maya Angelou', bio: '(1928–2014) Poet and memoirist; spoke of resilience and joy.', quote: 'You may not control all the events that happen to you, but you can decide not to be reduced by them.' },
        { name: 'Oscar Wilde', bio: '(1854–1900) Playwright and wit; rebelled through irony and grace.', quote: 'Be yourself; everyone else is already taken.' },
        { name: 'Simone Weil', bio: '(1909–1943) Philosopher and mystic; devotion through attention.', quote: 'Attention is the rarest and purest form of generosity.' },
        { name: 'Toni Morrison', bio: 'Toni Morrison (1931–2019) Novelist; explored freedom, identity, and belonging.', quote: 'If you want to fly, you have to give up the things that weigh you down.' },
        { name: 'Virginia Woolf', bio: '(1882–1941) Modernist writer; explored consciousness and feminism.', quote: 'Arrange whatever pieces come your way.' },
        { name: 'Zadie Smith', bio: '(b. 1975) Novelist and essayist; sharp observer of humanity.', quote: 'Progress is never permanent, will always be threatened, must be redoubled and reimagined.' }
      ].sort((a, b) => a.name.localeCompare(b.name))
    }
  ]
};

const getThinkerNames = (categoryName: string) => 
  PANTHEON_DATA.categories
    .find(cat => cat.name === categoryName)?.thinkers
    .map(t => t.name)
    .sort() || [];

export const PHILOSOPHERS = getThinkerNames('Philosophers');
export const MODERN_THINKERS = getThinkerNames('Modern Thinkers');
export const MYSTICS_AND_MANIFESTORS = getThinkerNames('Mystics & Manifestors');
export const STRATEGIC_MINDS = getThinkerNames('Strategic Minds');
export const REBELS = getThinkerNames('Rebels');
export const LUMINARIES = getThinkerNames('Luminaries');
export const AUTHORS_AND_STORYTELLERS = getThinkerNames('Authors & Storytellers');


export const COLOR_SCHEMES = [
    'None',
    'Monochromatic',
    'Duotone',
    'Warm Earth',
    'Cool Blue / Teal',
    'Golden Hour',
    'Pastel Dream',
    'High Contrast Noir',
    'Minimal Neutrals',
    'Olive & Sage',
    'Retro Pop'
];

export const ASPECT_RATIOS = [
    { label: 'Square', value: '1:1' },
    { label: 'Portrait', value: '4:5' },
    { label: 'Story', value: '9:16' },
    { label: 'Landscape', value: '16:9' },
];

export const VISUAL_THEMES = [
    {
        category: 'Modern Movements',
        options: [
            'Bauhaus Geometry',
            'Brutalist Minimalism',
            'Mid-Century Modern',
        ]
    },
    {
        category: 'Vibes & Aesthetics',
        options: [
            'Vaporwave / Synthwave',
            'Warm Nostalgia',
            'Minimalist Design',
            'Hyperreal Digital',
            'Scrapbook Collage (Paper Layers + Tape Elements)',
        ]
    },
    {
        category: 'Cinematic Styles',
        options: [
            'Film Noir',
            'Golden Hour Realism',
            'Analog Film Grain',
            'Monochrome Mood',
        ]
    },
    {
        category: 'Nature & Cosmos',
        options: [
            'Botanical Study',
            'Celestial Skies',
        ]
    },
    {
        category: 'Beach Themes',
        options: [
            'Coastal Minimalism (Soft Sand + Blue Horizon)',
            'Sunset Shoreline (Warm Light + Gentle Waves)',
        ]
    },
    {
        category: 'Surreal & Conceptual',
        options: [
            'Surreal Collage',
            'Cosmic Symbolism',
        ]
    },
];

export const GOOGLE_FONTS = [
  { name: 'Abril Fatface', family: "'Abril Fatface', cursive", weights: ['400'] },
  { name: 'Anton', family: "'Anton', sans-serif", weights: ['400'] },
  { name: 'Bebas Neue', family: "'Bebas Neue', cursive", weights: ['400'] },
  { name: 'Bodoni Moda', family: "'Bodoni Moda', serif", weights: ['400', '700', '900'] },
  { name: 'Caveat', family: "'Caveat', cursive", weights: ['400', '700'] },
  { name: 'Cinzel Decorative', family: "'Cinzel Decorative', cursive", weights: ['400', '700', '900'] },
  { name: 'Cormorant Garamond', family: "'Cormorant Garamond', serif", weights: ['400', '600', '700'] },
  { name: 'Dancing Script', family: "'Dancing Script', cursive", weights: ['400', '700'] },
  { name: 'Fraunces', family: "'Fraunces', serif", weights: ['400', '700', '900'] },
  { name: 'Great Vibes', family: "'Great Vibes', cursive", weights: ['400'] },
  { name: 'Josefin Sans', family: "'Josefin Sans', sans-serif", weights: ['300', '400', '600', '700'] },
  { name: 'League Spartan', family: "'League Spartan', sans-serif", weights: ['400', '700', '900'] },
  { name: 'Libre Baskerville', family: "'Libre Baskerville', serif", weights: ['400', '700'] },
  { name: 'Lobster', family: "'Lobster', cursive", weights: ['400'] },
  { name: 'Lora', family: "'Lora', serif", weights: ['400', '700'] },
  { name: 'Merriweather', family: "'Merriweather', serif", weights: ['400', '700', '900'] },
  { name: 'Montserrat', family: "'Montserrat', sans-serif", weights: ['300', '400', '600', '700'] },
  { name: 'Oswald', family: "'Oswald', sans-serif", weights: ['300', '400', '700'] },
  { name: 'Pacifico', family: "'Pacifico', cursive", weights: ['400'] },
  { name: 'Playfair Display', family: "'Playfair Display', serif", weights: ['400', '700', '900'] },
  { name: 'Poppins', family: "'Poppins', sans-serif", weights: ['400', '600', '700'] },
  { name: 'Prata', family: "'Prata', serif", weights: ['400'] },
  { name: 'Raleway', family: "'Raleway', sans-serif", weights: ['400', '700'] },
  { name: 'Righteous', family: "'Righteous', cursive", weights: ['400'] },
  { name: 'Satisfy', family: "'Satisfy', cursive", weights: ['400'] },
  { name: 'Special Elite', family: "'Special Elite', cursive", weights: ['400'] },
  { name: 'Syne', family: "'Syne', sans-serif", weights: ['400', '700', '800'] },
  { name: 'Unica One', family: "'Unica One', cursive", weights: ['400'] },
  { name: 'Yeseva One', family: "'Yeseva One', cursive", weights: ['400'] },
].sort((a, b) => a.name.localeCompare(b.name));

export const INITIAL_STATE: AppState = {
  quote: {
    source: 'generate',
    usePhilosopher: true,
    useModernThinker: false,
    useLuminary: false,
    useRebel: false,
    useMystic: false,
    useStrategicMind: false,
    useAuthor: false,
    mood: 'Inspirational',
    philosopher: 'Friedrich Nietzsche',
    modernThinker: 'Maya Angelou',
    luminary: 'Leonardo da Vinci',
    rebel: 'Frida Kahlo',
    mystic: 'Rumi',
    strategicMind: 'Sun Tzu',
    author: 'Maya Angelou',
    ownQuote: 'The journey of a thousand miles begins with a single step.',
    generatedQuote: '',
    inspirationSources: [],
  },
  image: {
    colorScheme: 'None',
    backdrop: 'None',
    prompt: '',
    uploadedImage: null,
    aspectRatio: '1:1',
  },
  style: {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: 64,
    fontColor: '#FFFFFF',
    fontWeight: '400',
    isBold: false,
    isItalic: false,
    position: 'center',
    textAlign: 'center',
    textOutlineEnabled: false,
    textOutlineColor: '#000000',
    textOutlineWidth: 4,
    textBackgroundEnabled: false,
    textBackgroundColor: '#000000',
    textBackgroundOpacity: 0.5,
    textBackgroundPadding: 24,
    textBackgroundBorderRadius: 16,
  },
  watermark: {
    image: null,
    enabled: true,
    position: 'bottomRight',
    opacity: 0.7,
    size: 15,
  },
  generatedImage: null,
  loading: {
    quote: false,
    image: false,
    journey: false,
  },
  journey: [],
  selectedJourneyItemIndex: null,
  imageTransform: {
    x: 0,
    y: 0,
    scale: 1,
  },
};