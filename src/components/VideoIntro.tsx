import React, { useState, useRef } from "react";
import { COUPLE, getEvent } from "../eventDetails";

interface VideoIntroProps {
  key?: React.Key;
  onComplete: () => void;
  onMusicStart?: () => void;
  event?: string | null;
  readyToTransition?: boolean;
}

export function VideoIntro({
  onComplete,
  onMusicStart,
  event = 'both',
  readyToTransition = true,
}: VideoIntroProps) {
  const [stage, setStage] = useState<'intro' | 'exiting'>('intro');
  const completedRef = useRef(false);

  const handleEnter = () => {
    if (!readyToTransition || completedRef.current) return;
    completedRef.current = true;
    
    if (onMusicStart) onMusicStart();
    
    setStage('exiting');
    window.setTimeout(() => onComplete(), 800); // 800ms fade/blur out match
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        .intro-scene {
          position: fixed;
          inset: 0;
          z-index: 100;
          min-height: 100vh;
          min-height: 100dvh;
          transition: opacity 1s ease, filter 1s ease;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .intro-scene.is-exiting {
          opacity: 0;
          filter: blur(15px);
          pointer-events: none;
        }
        
        .intro-video {
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 1;
        }
        
        .intro-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.2); /* Slight darkening for better button visibility */
          z-index: 2;
        }

        .intro-content {
          position: relative;
          z-index: 3;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 20px;
        }

        .view-invitation-btn {
          background: linear-gradient(135deg, #fff 0%, #FBE3EA 100%);
          color: #A8456A;
          border: 1px solid rgba(184, 147, 90, 0.6);
          padding: 15px 40px;
          font-size: 18px;
          font-family: "Cormorant Garamond", serif;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.25), 0 12px 30px rgba(194, 87, 122, 0.35);
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-top: auto;
          margin-bottom: 60px;
          font-weight: 600;
        }

        .view-invitation-btn:hover {
          transform: translateY(-2px);
          background: linear-gradient(135deg, #fff 0%, #F6CCD9 100%);
          box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.3), 0 16px 36px rgba(194, 87, 122, 0.45);
        }
        
        .view-invitation-btn:active {
          transform: translateY(1px);
        }
      `}</style>
      
      <div className={`intro-scene ${stage === 'exiting' ? 'is-exiting' : ''}`}>
        {stage === 'intro' && (
          <>
            <video 
              className="intro-video"
              src="/give_this_as_wedding_invitatio%20(online-video-cutter.com).mp4"
              autoPlay 
              muted 
              loop 
              playsInline
            />
            <div className="intro-overlay" />
            <div className="intro-content">
              <div className="mt-12 mb-auto text-white drop-shadow-md">
                <p className="uppercase tracking-[0.4em] text-xs sm:text-sm font-bold mb-2 opacity-90">{getEvent(event).invitationTitle}</p>
                <h1 className="font-names text-5xl sm:text-6xl lg:text-7xl drop-shadow-lg tracking-wide">{COUPLE.names}</h1>
              </div>
              <button className="view-invitation-btn" onClick={handleEnter}>
                View Invitation
              </button>
            </div>
          </>
        )}

      </div>
    </>
  );
}
