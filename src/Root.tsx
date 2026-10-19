import React from 'react';
import { Composition } from 'remotion';
import { MainVideo, VIDEO_CONFIG } from './Video';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MainVideo"
      component={MainVideo}
      durationInFrames={VIDEO_CONFIG.durationInFrames}
      fps={VIDEO_CONFIG.fps}
      width={VIDEO_CONFIG.width}
      height={VIDEO_CONFIG.height}
    />
  );
};
 