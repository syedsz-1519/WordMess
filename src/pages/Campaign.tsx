import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getCampaignLevel } from '../campaign/campaignData';
import { useCampaign } from '../campaign/useCampaign';
import { WordSearch } from '../campaign/WordSearch';
import { WordConnect } from '../campaign/WordConnect';
import { ParticleCanvas } from '../themes/ParticleCanvas';

export const Campaign = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { completeLevel } = useCampaign();

  const levelStr = searchParams.get('level') || '1';
  const level = parseInt(levelStr, 10);
  const levelData = getCampaignLevel(level);

  const handleLevelComplete = () => {
    // Save progress and award coins
    completeLevel(level);
    
    // Auto-advance to the next level
    if (level < 1000) {
      navigate(`/game/campaign?level=${level + 1}`);
    } else {
      navigate('/campaign');
    }
  };

  const handleBack = () => {
    navigate('/campaign');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col">
      {/* Campaign background theme */}
      <ParticleCanvas modeId="campaign" />

      <main className="flex-1 flex flex-col justify-center items-center">
        {level <= 500 ? (
          <WordSearch 
            levelData={levelData as any} 
            onComplete={handleLevelComplete} 
            onBack={handleBack} 
          />
        ) : (
          <WordConnect 
            levelData={levelData as any} 
            onComplete={handleLevelComplete} 
            onBack={handleBack} 
          />
        )}
      </main>
    </div>
  );
};

export default Campaign;
