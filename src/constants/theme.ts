export const THEME = {
  colors: {
    correct: '#3B6D11',
    present: '#854F0B',
    absent: '#3a3a3c',
    bg: '#121213',
    surface: '#1a1a1b',
    border: '#3a3a3c',
    text: '#ffffff',
    textMuted: '#818384',
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
  layout: {
    tileSizeDesktop: '62px',
    tileSizeMobile: '52px',
    tileGap: '5px',
    rowGap: '6px',
    tileRadius: '4px',
    modalRadius: '12px',
    headerHeight: '50px',
    maxBoardWidth: '350px',
    maxKeyboardWidth: '500px',
  }
} as const;
