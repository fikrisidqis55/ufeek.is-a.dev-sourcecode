/**
 * Procedural Retro Audio Synthesizer for will-remember
 * Generates classic Windows 98 system sounds and 3.5" floppy disk stepper motor noises
 * via Web Audio API without any external sound assets.
 */

let audioCtx: AudioContext | null = null;
let isMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function setAudioMuted(muted: boolean): void {
  isMuted = muted;
}

export function getAudioMuted(): boolean {
  return isMuted;
}

/**
 * 3.5" Floppy Disk Drive Stepper Motor Sound:
 * Recreates the physical chugging and seek head step clicks of a classic diskette drive.
 */
export function playFloppySaveSound(): void {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const steps = 6;
  const stepInterval = 0.07; // 70ms per seek pulse

  for (let i = 0; i < steps; i++) {
    const startTime = now + i * stepInterval;

    // Stepper motor thud
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = i % 2 === 0 ? 'sawtooth' : 'square';
    osc.frequency.setValueAtTime(80 + (i % 3) * 35, startTime);
    osc.frequency.exponentialRampToValueAtTime(35, startTime + 0.04);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, startTime);

    gain.gain.setValueAtTime(0.25, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.045);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.05);

    // Mechanical chatter noise
    const bufferSize = ctx.sampleRate * 0.02;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let j = 0; j < bufferSize; j++) {
      data[j] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.12, startTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.025);

    noise.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(startTime);
    noise.stop(startTime + 0.03);
  }

  // Final mechanical settling clack
  const finalTime = now + steps * stepInterval + 0.04;
  const finalOsc = ctx.createOscillator();
  const finalGain = ctx.createGain();
  finalOsc.type = 'triangle';
  finalOsc.frequency.setValueAtTime(140, finalTime);
  finalOsc.frequency.exponentialRampToValueAtTime(40, finalTime + 0.03);
  finalGain.gain.setValueAtTime(0.2, finalTime);
  finalGain.gain.exponentialRampToValueAtTime(0.001, finalTime + 0.03);

  finalOsc.connect(finalGain);
  finalGain.connect(ctx.destination);
  finalOsc.start(finalTime);
  finalOsc.stop(finalTime + 0.035);
}

/**
 * Mechanical Win98 Button Click:
 * Micro pulse with fast exponential decay.
 */
export function playClickSound(): void {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(1200, now);
  osc.frequency.exponentialRampToValueAtTime(300, now + 0.015);

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.02);
}

/**
 * Classic Windows 98 Asterisk / Ding Chord:
 * Dual-tone harmonic sine chime.
 */
export function playDingSound(): void {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const freqs = [523.25, 1046.5]; // C5 and C6

  freqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    const initialGain = idx === 0 ? 0.25 : 0.12;
    gain.gain.setValueAtTime(initialGain, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  });
}
