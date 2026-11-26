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
