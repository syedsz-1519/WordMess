import { toPng } from 'html-to-image';

export const generateInstaCard = async (elementId: string): Promise<string | null> => {
  try {
    const node = document.getElementById(elementId);
    if (!node) return null;
    
    // Scale up for 1080x1080 resolution
    const dataUrl = await toPng(node, {
      quality: 1.0,
      pixelRatio: 3,
      backgroundColor: '#121213',
    });
    
    return dataUrl;
  } catch (err) {
    console.error('Error generating InstaCard', err);
    return null;
  }
};
