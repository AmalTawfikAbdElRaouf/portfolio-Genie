const createAudioContext = (): AudioContext | null => {
  try {
    return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  } catch {
    return null;
  }
};

const playTone = (
  ctx: AudioContext,
  frequency: number,
  startTime: number,
  duration: number,
  gain: number,
  type: OscillatorType = "sine"
) => {
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, startTime);
  osc.frequency.exponentialRampToValueAtTime(frequency * 1.02, startTime + duration * 0.5);

  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.start(startTime);
  osc.stop(startTime + duration);
};

export const playPortfolioCreatedSound = (): void => {
  const ctx = createAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  const melody = [
    { freq: 523.25, t: 0.00, dur: 0.18, gain: 0.18 },
    { freq: 659.25, t: 0.12, dur: 0.18, gain: 0.18 },
    { freq: 783.99, t: 0.24, dur: 0.18, gain: 0.18 },
    { freq: 1046.5, t: 0.36, dur: 0.32, gain: 0.22 },
    { freq: 880.00, t: 0.54, dur: 0.22, gain: 0.15 },
    { freq: 1046.5, t: 0.68, dur: 0.42, gain: 0.20 },
  ];

  melody.forEach(({ freq, t, dur, gain }) => {
    playTone(ctx, freq, now + t, dur, gain, "sine");
  });

  const shimmer = [
    { freq: 2093, t: 0.00, dur: 0.9, gain: 0.04 },
    { freq: 2637, t: 0.15, dur: 0.7, gain: 0.03 },
    { freq: 3136, t: 0.30, dur: 0.6, gain: 0.025 },
  ];

  shimmer.forEach(({ freq, t, dur, gain }) => {
    playTone(ctx, freq, now + t, dur, gain, "triangle");
  });

  setTimeout(() => {
    try { ctx.close(); } catch { /* ignore */ }
  }, 1800);
};

export const playCheckSound = (): void => {
  const ctx = createAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  playTone(ctx, 880, now, 0.1, 0.08, "sine");
  playTone(ctx, 1108.73, now + 0.06, 0.12, 0.07, "sine");

  setTimeout(() => {
    try { ctx.close(); } catch { /* ignore */ }
  }, 500);
};
