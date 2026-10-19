import React from 'react';
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const VIDEO_CONFIG = {
  fps: 30,
  durationInFrames: 150, 
  width: 1080,   // Change to 1920 for YouTube (16:9), or keep 1080 for Shorts/Reels (9:16)
  height: 1920,  // Change to 1080 for YouTube (16:9), or keep 1920 for Shorts/Reels (9:16)
};

export const MainVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    fps,
    frame,
    config: { damping: 12, stiffness: 120 },
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #09090b 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          padding: '40px',
          borderRadius: '30px',
          background: 'rgba(255, 255, 255, 0.07)',
          border: '2px solid rgba(99, 102, 241, 0.6)',
          textAlign: 'center',
          maxWidth: '85%',
        }}
      >
        <h1 style={{ color: '#ffffff', fontSize: '60px', margin: 0, fontWeight: 900 }}>
          MH Motion Studio
        </h1>
        <p style={{ color: '#818cf8', fontSize: '26px', marginTop: '15px' }}>
          Rendered via GitHub Actions on Mobile
        </p>
      </div>
    </AbsoluteFill>
  );
};
