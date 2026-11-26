const MUTE_KEY = 'survival_checklist_muted';

class RetroSoundEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean;

  constructor() {
    try {
      this.muted = localStorage.getItem(MUTE_KEY) === 'true';
    } catch {
      this.muted = false;
    }
  }

  isMuted(): boolean {
    return this.muted;
  }

  setMuted(value: boolean): void {
    this.muted = value;
    try {
      localStorage.setItem(MUTE_KEY, String(value));
    } catch {
      // ignore storage failure
    }
  }

  private getContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  private tone(
    freq: number,
    durationSec: number,
    delaySec = 0,
    type: OscillatorType = 'square',
    gainLevel = 0.08
  ): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const start = ctx.currentTime + delaySec;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(gainLevel, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + durationSec);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc.stop(start + durationSec + 0.01);
  }

  playSlash(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + 0.12);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  playStokeFire(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Warm burst
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.linearRampToValueAtTime(260, now + 0.15);
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.23);

    // Crackle pops
    for (let i = 0; i < 3; i++) {
      const popDelay = 0.04 + i * 0.06;
      this.tone(600 + Math.random() * 400, 0.02, popDelay, 'square', 0.04);
    }
  }

  playWolfHowl(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(680, now + 0.35);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.75);

    gain.gain.setValueAtTime(0.02, now);
    gain.gain.linearRampToValueAtTime(0.11, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.81);
  }

  playDroneScan(): void {
    this.tone(880, 0.05, 0, 'sine', 0.08);
    this.tone(1320, 0.05, 0.06, 'sine', 0.08);
    this.tone(1760, 0.08, 0.12, 'sine', 0.09);
  }

  playPotBubble(): void {
    this.tone(480, 0.04, 0, 'sine', 0.06);
    this.tone(620, 0.04, 0.05, 'sine', 0.06);
    this.tone(540, 0.05, 0.11, 'sine', 0.05);
  }

  playMonsterHit(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.16);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.17);
  }

  playPerimeterAlert(): void {
    this.tone(310, 0.06, 0, 'sawtooth', 0.05);
    this.tone(260, 0.08, 0.08, 'sawtooth', 0.06);
  }

  playLockTask(): void {
    this.tone(240, 0.06, 0, 'triangle', 0.07);
    this.tone(360, 0.07, 0.05, 'square', 0.05);
  }

  playTaskComplete(): void {
    this.tone(523.25, 0.08, 0, 'square', 0.07);
    this.tone(659.25, 0.09, 0.07, 'square', 0.07);
    this.tone(783.99, 0.14, 0.14, 'square', 0.08);
  }

  playDaySurvived(): void {
    const notes = [523.25, 659.25, 783.99, 1046.5, 987.77, 1046.5];
    const times = [0, 0.09, 0.18, 0.27, 0.4, 0.5];
    const durs = [0.09, 0.09, 0.09, 0.12, 0.09, 0.28];
    notes.forEach((n, idx) => {
      this.tone(n, durs[idx], times[idx], 'square', 0.08);
    });
  }

  playPerished(): void {
    this.tone(293.66, 0.18, 0, 'sawtooth', 0.08);
    this.tone(246.94, 0.18, 0.18, 'sawtooth', 0.08);
    this.tone(196.0, 0.22, 0.36, 'sawtooth', 0.08);
    this.tone(130.81, 0.45, 0.56, 'sawtooth', 0.09);
  }
}

export const soundEngine = new RetroSoundEngine();
