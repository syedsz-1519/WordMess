export interface WordSearchLevel {
  level: number;
  grid: string[][];
  targetWords: string[];
}

export interface AnagramLevel {
  level: number;
  bigWord: string;
  targetWords: string[];
}

// Free Tier: Word Search levels
export const SEARCH_LEVELS: WordSearchLevel[] = [
  {
    level: 1,
    grid: [
      ['B', 'E', 'A', 'C', 'H', 'X', 'Y', 'Z'],
      ['O', 'P', 'A', 'L', 'M', 'A', 'B', 'C'],
      ['W', 'A', 'V', 'E', 'S', 'D', 'E', 'F'],
      ['S', 'U', 'N', 'N', 'Y', 'G', 'H', 'I'],
      ['O', 'C', 'E', 'A', 'N', 'J', 'K', 'L'],
      ['X', 'Y', 'Z', 'S', 'H', 'E', 'L', 'L'],
      ['T', 'R', 'E', 'E', 'S', 'K', 'Y', 'S'],
      ['S', 'A', 'N', 'D', 'W', 'I', 'N', 'D']
    ],
    targetWords: ['BEACH', 'PALM', 'WAVES', 'SUNNY', 'OCEAN', 'SHELL', 'SAND', 'WIND', 'SKY', 'TREES']
  },
  {
    level: 2,
    grid: [
      ['S', 'U', 'M', 'M', 'E', 'R', 'X', 'Y'],
      ['I', 'S', 'L', 'A', 'N', 'D', 'A', 'B'],
      ['T', 'R', 'O', 'P', 'I', 'C', 'A', 'L'],
      ['B', 'R', 'E', 'E', 'Z', 'E', 'D', 'E'],
      ['C', 'O', 'C', 'O', 'N', 'U', 'T', 'G'],
      ['F', 'L', 'A', 'M', 'I', 'N', 'G', 'O'],
      ['H', 'A', 'P', 'P', 'Y', 'S', 'U', 'N'],
      ['W', 'A', 'T', 'E', 'R', 'L', 'I', 'D']
    ],
    targetWords: ['SUMMER', 'ISLAND', 'TROPICAL', 'BREEZE', 'COCONUT', 'FLAMINGO', 'SUN', 'WATER', 'HAPPY']
  }
];

export const NUMBER_SEARCH_LEVELS: WordSearchLevel[] = [
  {
    level: 1,
    grid: [
      ['1', '2', '3', '4', '5', '9', '8', '7'],
      ['6', '7', '8', '9', '0', '1', '2', '3'],
      ['5', '4', '3', '2', '1', '6', '5', '4'],
      ['9', '8', '7', '6', '5', '2', '4', '6'],
      ['1', '3', '5', '7', '9', '8', '1', '9'],
      ['2', '4', '6', '8', '0', '2', '9', '8'],
      ['9', '7', '5', '3', '1', '7', '5', '3'],
      ['8', '6', '4', '2', '0', '8', '6', '4']
    ],
    targetWords: ['12345', '54321', '98765', '13579', '24680', '97531', '86420']
  },
  {
    level: 2,
    grid: [
      ['9', '9', '9', '9', '9', '1', '1', '1'],
      ['8', '8', '8', '8', '8', '2', '2', '2'],
      ['7', '7', '7', '7', '7', '3', '3', '3'],
      ['1', '1', '2', '2', '3', '3', '4', '4'],
      ['5', '5', '6', '6', '7', '7', '8', '8'],
      ['4', '3', '2', '1', '0', '9', '8', '7'],
      ['1', '2', '3', '4', '5', '6', '7', '8'],
      ['8', '7', '6', '5', '4', '3', '2', '1']
    ],
    targetWords: ['99999', '88888', '77777', '11223', '43210', '12345', '87654']
  }
];

// Paid Tier: Word Connect (Anagram) levels
export const ANAGRAM_LEVELS: AnagramLevel[] = [
  {
    level: 1,
    bigWord: 'GOBBLER',
    targetWords: ['BOG', 'ROB', 'BEG', 'LOB', 'LEG', 'ORE', 'GOB', 'LOG', 'EGO', 'GEL', 'BLOB', 'GLOB', 'LOBE', 'ROBE', 'BLOG', 'BORE', 'GORE', 'OGRE', 'GLOBE', 'GOBBLER']
  },
  {
    level: 2,
    bigWord: 'SELCOUTH',
    targetWords: ['OUT', 'THE', 'SHE', 'USE', 'CUT', 'HUE', 'LET', 'HOT', 'LOT', 'LUSH', 'CULT', 'SOUL', 'CLUE', 'CUTE', 'HOST', 'SHOT', 'HOUSE', 'COUTH', 'SOUTH', 'CLOTH', 'SCOUT', 'SELCOUTH']
  },
  {
    level: 3,
    bigWord: 'DANDELION',
    targetWords: ['DEN', 'LID', 'LAD', 'ION', 'OIL', 'NIL', 'AND', 'END', 'ODE', 'LED', 'OLD', 'ALE', 'ONE', 'DEAL', 'LEAN', 'LINE', 'LAND', 'LOAN', 'LEAD', 'IDOL', 'NAIL', 'LION', 'LANE', 'IDEA', 'ALONE', 'IDEAL', 'ALIEN', 'DANDELION']
  },
  {
    level: 4,
    bigWord: 'PROBOSCIS',
    targetWords: ['ROB', 'SOB', 'COP', 'RIB', 'SIP', 'PRO', 'COB', 'BIO', 'SIR', 'ORB', 'BOSS', 'CROP', 'CRIB', 'COPS', 'RIBS', 'SOBS', 'SCION', 'CRISP', 'BISON', 'SPOIL', 'PROBOSCIS']
  }
];
