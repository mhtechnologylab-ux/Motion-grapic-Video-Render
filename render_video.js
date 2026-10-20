const puppeteer = require('puppeteer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

(async () => {
  const FPS = 30;
  const DURATION = 30; // 30 seconds
  const TOTAL_FRAMES = FPS * DURATION; // 900 frames

  console.log('🚀 Launching Headless Browser for 1080x1920 @ 30fps Render...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });

  const htmlPath = 'file://' + path.resolve(__dirname, 'index.html');
  await page.goto(htmlPath, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  const hasAudio = fs.existsSync(path.resolve(__dirname, 'voiceover.mp3'));
  const ffmpegArgs = [
    '-y',
    '-f', 'image2pipe',
    '-vcodec', 'png',
    '-r', String(FPS),
    '-i', '-'
  ];

  if (hasAudio) {
    ffmpegArgs.push('-i', 'voiceover.mp3', '-c:a', 'aac', '-b:a', '192k', '-shortest');
  }

  ffmpegArgs.push(
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-preset', 'medium',
    '-crf', '18',
    'success_5_steps_reel.mp4'
  );

  const ffmpeg = spawn('ffmpeg', ffmpegArgs);

  for (let frame = 0; frame < TOTAL_FRAMES; frame++) {
    const timeSec = frame / FPS;
    await page.evaluate((t) => window.seekTo(t), timeSec);
    const buffer = await page.screenshot({ type: 'png' });
    ffmpeg.stdin.write(buffer);

    if (frame % 90 === 0) {
      console.log(`🎬 Rendered ${frame}/${TOTAL_FRAMES} frames (${Math.round((frame / TOTAL_FRAMES) * 100)}%)`);
    }
  }

  ffmpeg.stdin.end();
  await new Promise((resolve) => ffmpeg.on('close', resolve));
  await browser.close();
  console.log('✅ Render Complete: success_5_steps_reel.mp4');
})();
