export interface WordSearchLevel {
  level: number;
  grid: string[][];
  targetWords: string[];
  category: string;
}

export interface AnagramLevel {
  level: number;
  bigWord: string;
  targetWords: string[];
}

// 1. Dictionaries for Anagram subwords
const ANAGRAM_WORDS_BANK: { big: string; subs: string[] }[] = [
  { big: 'GOBBLER', subs: ['BOG', 'ROB', 'BEG', 'LOB', 'LEG', 'ORE', 'GOB', 'LOG', 'EGO', 'GEL', 'BLOB', 'GLOB', 'LOBE', 'ROBE', 'BLOG', 'BORE', 'GORE', 'OGRE', 'GLOBE', 'GOBBLER'] },
  { big: 'SELCOUTH', subs: ['OUT', 'THE', 'SHE', 'USE', 'CUT', 'HUE', 'LET', 'HOT', 'LOT', 'LUSH', 'CULT', 'SOUL', 'CLUE', 'CUTE', 'HOST', 'SHOT', 'HOUSE', 'COUTH', 'SOUTH', 'CLOTH', 'SCOUT', 'SELCOUTH'] },
  { big: 'DANDELION', subs: ['DEN', 'LID', 'LAD', 'ION', 'OIL', 'NIL', 'AND', 'END', 'ODE', 'LED', 'OLD', 'ALE', 'ONE', 'DEAL', 'LEAN', 'LINE', 'LAND', 'LOAN', 'LEAD', 'IDOL', 'NAIL', 'LION', 'LANE', 'IDEA', 'ALONE', 'IDEAL', 'ALIEN', 'DANDELION'] },
  { big: 'PROBOSCIS', subs: ['ROB', 'SOB', 'COP', 'RIB', 'SIP', 'PRO', 'COB', 'BIO', 'SIR', 'ORB', 'BOSS', 'CROP', 'CRIB', 'COPS', 'RIBS', 'SOBS', 'SCION', 'CRISP', 'BISON', 'SPOIL', 'PROBOSCIS'] },
  { big: 'TEACHER', subs: ['TEA', 'THE', 'EAT', 'HAT', 'CAT', 'HER', 'CAR', 'ART', 'RAT', 'ACE', 'ACT', 'EAR', 'EACH', 'HEAR', 'HATE', 'HEAT', 'CHAT', 'TEAR', 'RATE', 'CARE', 'RACE', 'ARCH', 'CHAR', 'TEACH', 'REACH', 'HATER', 'CHEAT', 'TEACHER'] },
  { big: 'MONSTER', subs: ['SON', 'NOT', 'ONE', 'TEN', 'MEN', 'MET', 'SET', 'NET', 'ROT', 'ORE', 'MORE', 'SOME', 'MOST', 'SENT', 'TORN', 'ROSE', 'NEST', 'SORE', 'NOTE', 'TONE', 'TERM', 'STERN', 'STONE', 'STORM', 'MONSTER'] },
  { big: 'CREATIVE', subs: ['CAT', 'EAT', 'CAR', 'RAT', 'TEA', 'ART', 'ICE', 'TIE', 'ACT', 'EAR', 'VET', 'AIR', 'VIA', 'RATE', 'CARE', 'RACE', 'TEAR', 'RICE', 'TIRE', 'CAVE', 'VETO', 'ACTIVE', 'REACT', 'CREATIVE', 'CREATE'] },
  { big: 'DYNAMITE', subs: ['DAY', 'MAY', 'NET', 'TEN', 'YET', 'MAN', 'MET', 'TIE', 'AID', 'MAD', 'AIM', 'DIM', 'AND', 'MINT', 'MIND', 'TIDE', 'DATE', 'NAME', 'TIME', 'MANY', 'DIME', 'TEAM', 'MEAT', 'YIELD', 'DYNAMITE'] },
  { big: 'BEAUTIFUL', subs: ['BUT', 'TUB', 'BAT', 'TAB', 'FIT', 'LIT', 'LET', 'AIL', 'BETA', 'BEAT', 'LUTE', 'FLUTE', 'LUTE', 'TALE', 'LACE', 'BLUE', 'FUEL', 'FLAT', 'FEAT', 'BEAUTY', 'BEAUTIFUL'] },
  { big: 'COMPUTER', subs: ['PUT', 'OUT', 'CUP', 'PET', 'MET', 'ROT', 'COP', 'RUT', 'TOP', 'MOP', 'CUTE', 'PORT', 'POET', 'MORE', 'MUTE', 'CORE', 'COME', 'COPE', 'TEMP', 'RUMP', 'CURE', 'PURE', 'ROUP', 'COMPUTER'] },
  { big: 'CREATION', subs: ['CAT', 'RAT', 'EAT', 'TEN', 'NET', 'CON', 'ION', 'ICE', 'TIE', 'ART', 'CAR', 'ONE', 'NOT', 'ACT', 'COIN', 'CORN', 'TORN', 'RATE', 'CARE', 'RACE', 'TEAR', 'INTO', 'NOTE', 'TONE', 'ONCE', 'CREATION'] },
  { big: 'PLAYGROUND', subs: ['PLAY', 'GROUND', 'RUN', 'PAG', 'DOG', 'LOG', 'PRAY', 'LOUD', 'PLAN', 'POND', 'GLAD', 'RAY', 'DAY', 'GAY', 'PAY', 'GOLD', 'DRAG', 'DROP', 'PANG', 'ROUND', 'POND', 'YARD', 'PLAYGROUND'] },
  { big: 'BEAUTY', subs: ['BUT', 'TUB', 'BET', 'BYE', 'YET', 'BAT', 'TAB', 'BEAT', 'BETA', 'BUTE', 'ABUY', 'TUBE', 'BEAUTY'] },
  { big: 'DANGER', subs: ['RED', 'DEN', 'END', 'AND', 'AGE', 'RAG', 'RAN', 'DEAR', 'GEAR', 'READ', 'RAGE', 'DEAN', 'RAND', 'DANGER', 'GARDEN'] },
  { big: 'JOURNEY', subs: ['OUR', 'ONE', 'RUN', 'YET', 'JOY', 'RYE', 'YEN', 'ORE', 'JUNO', 'ROUT', 'RUNE', 'JUNE', 'YOUR', 'JURY', 'JOURNEY'] },
  { big: 'KITCHEN', subs: ['THE', 'TEN', 'NET', 'HEN', 'ICE', 'INK', 'CHIN', 'HINT', 'THICK', 'KITE', 'ETCH', 'ITCH', 'KITCHEN', 'CHICK'] },
  { big: 'LANTERN', subs: ['ART', 'RAN', 'TAN', 'NET', 'TEN', 'EAR', 'LANE', 'TEAR', 'RATE', 'TALL', 'RENT', 'LEARN', 'LANTERN', 'ALTER'] },
  { big: 'MYSTERY', subs: ['MY', 'TRY', 'YET', 'YES', 'RYE', 'SET', 'MET', 'REST', 'TERM', 'YEST', 'STEM', 'TYRE', 'SEMY', 'MYSTERY'] },
  { big: 'BLANKET', subs: ['BAN', 'LET', 'NET', 'TEN', 'BAT', 'TAB', 'ELK', 'LAKE', 'BANK', 'BALE', 'BEAK', 'LEAK', 'ABLE', 'BLANK', 'BLANKET'] },
  { big: 'FESTIVAL', subs: ['FAT', 'LIT', 'LET', 'FIT', 'SAT', 'VAS', 'TIE', 'AIL', 'LAVE', 'VAST', 'TAIL', 'FLAT', 'FEAT', 'LACE', 'FESTIVAL', 'VITAL'] }
];

// 2. Categories for Word Search procedurally
const SEARCH_CATEGORIES: { name: string; words: string[] }[] = [
  { name: 'Animals', words: ['CAT', 'DOG', 'PIG', 'LION', 'BEAR', 'WOLF', 'DEER', 'FROG', 'DUCK', 'FISH', 'TIGER', 'KOALA', 'SHARK', 'PANDA', 'ZEBRA', 'MONKEY', 'GIRAFFE', 'ELEPHANT', 'DOLPHIN', 'OCTOPUS'] },
  { name: 'Food & Sweets', words: ['CAKE', 'PIE', 'TART', 'BUN', 'SOUP', 'RICE', 'TACO', 'PIZZA', 'PASTA', 'BREAD', 'SALAD', 'BURGER', 'DONUT', 'COOKIE', 'SUSHI', 'CHEESE', 'WAFFLE', 'PUDDING', 'PANCAKE', 'BACON'] },
  { name: 'Tech & Sci', words: ['BYTE', 'CODE', 'DATA', 'CHIP', 'RAM', 'DISK', 'WEB', 'WIFI', 'PIXEL', 'ROBOT', 'LOGIC', 'CYBER', 'CLOUD', 'MODEM', 'MOUSE', 'SCREEN', 'SERVER', 'DEVICE', 'LAPTOP', 'SOFTWARE'] },
  { name: 'Nature & Parks', words: ['TREE', 'LEAF', 'RAIN', 'WIND', 'SAND', 'ROCK', 'SOIL', 'HILL', 'LAKE', 'POND', 'RIVER', 'GRASS', 'FLOWER', 'FOREST', 'DESERT', 'VALLEY', 'CANYON', 'MOUNTAIN', 'OCEAN', 'MEADOW'] },
  { name: 'Sports', words: ['GOLF', 'BALL', 'RUN', 'BAT', 'NET', 'GOAL', 'TEAM', 'POOL', 'RINK', 'CLUB', 'TENNIS', 'SOCCER', 'RUGBY', 'PLAYER', 'HELMET', 'TRACK', 'HOCKEY', 'BASKET', 'BOWLING', 'CRICKET'] },
  { name: 'Colors', words: ['RED', 'BLUE', 'PINK', 'CYAN', 'GRAY', 'AQUA', 'GOLD', 'ROSE', 'PLUM', 'NAVY', 'GREEN', 'BLACK', 'WHITE', 'BROWN', 'ORANGE', 'YELLOW', 'PURPLE', 'SILVER', 'INDIGO', 'MAGENTA'] },
  { name: 'Space', words: ['SUN', 'STAR', 'MOON', 'MARS', 'ORBIT', 'COMET', 'PLANET', 'GALAXY', 'COSMOS', 'NEBULA', 'SATURN', 'ASTEROID', 'METEOR', 'TELESCOPE', 'GRAVITY', 'UNIVERSE', 'ASTRONAUT', 'SPACESHIP'] }
];

// Helper to procedurally place words in a Word Search grid
export const generateWordSearch = (level: number): WordSearchLevel => {
  // Determine grid size based on level
  let size = 6;
  if (level > 50) size = 8;
  if (level > 150) size = 10;
  if (level > 300) size = 12;
  if (level > 450) size = 15;

  const categoryData = SEARCH_CATEGORIES[(level - 1) % SEARCH_CATEGORIES.length];
  const category = categoryData.name;
  
  // Pick 3 to 7 words from the category based on size
  const maxWords = size === 6 ? 3 : size === 8 ? 4 : size === 10 ? 5 : size === 12 ? 6 : 8;
  const targetWords = [...categoryData.words]
    .sort(() => 0.5 - Math.random())
    .filter(w => w.length < size)
    .slice(0, maxWords);

  // Initialize empty grid
  const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(''));

  // Place each target word
  for (const word of targetWords) {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 100) {
      attempts++;
      const isHorizontal = Math.random() > 0.5;
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);
      
      let canPlace = true;
      if (isHorizontal) {
        if (col + word.length > size) continue;
        for (let i = 0; i < word.length; i++) {
          const cell = grid[row][col + i];
          if (cell !== '' && cell !== word[i]) {
            canPlace = false;
            break;
          }
        }
        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            grid[row][col + i] = word[i];
          }
          placed = true;
        }
      } else {
        // Vertical
        if (row + word.length > size) continue;
        for (let i = 0; i < word.length; i++) {
          const cell = grid[row + i][col];
          if (cell !== '' && cell !== word[i]) {
            canPlace = false;
            break;
          }
        }
        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            grid[row + i][col] = word[i];
          }
          placed = true;
        }
      }
    }
  }

  // Fill empty spaces with random uppercase letters
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  return {
    level,
    grid,
    targetWords,
    category
  };
};

// Expose levels 501-1000 procedurally or statically
export const generateWordConnect = (level: number): AnagramLevel => {
  // Normalize index for the bank
  const index = (level - 501) % ANAGRAM_WORDS_BANK.length;
  const baseData = ANAGRAM_WORDS_BANK[index];

  // Modify level number inside
  return {
    level,
    bigWord: baseData.big,
    targetWords: baseData.subs
  };
};

// Main routing resolver for campaign map nodes
export const getCampaignLevel = (level: number) => {
  if (level <= 500) {
    return generateWordSearch(level);
  } else {
    return generateWordConnect(level);
  }
};
