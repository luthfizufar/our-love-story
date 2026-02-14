/**
 * Procedural Audio System using Web Audio API
 * Generates BGM melodies and SFX without external audio files
 */

type NoteFreq = number;

// Note frequencies (Hz)
const NOTES: Record<string, NoteFreq> = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00,
  'Db4': 277.18, 'Eb4': 311.13, 'Gb4': 369.99, 'Ab4': 415.30, 'Bb4': 466.16,
  'Db5': 554.37, 'Eb5': 622.25, 'Ab3': 207.65, 'Bb3': 233.08,
};

interface MelodyNote {
  note: string;
  duration: number; // in beats
}

// Scene-specific melodies
const MELODIES: Record<string, MelodyNote[]> = {
  boot: [
    { note: 'E4', duration: 1 }, { note: 'G4', duration: 1 }, { note: 'A4', duration: 2 },
    { note: 'G4', duration: 1 }, { note: 'E4', duration: 1 }, { note: 'D4', duration: 2 },
    { note: 'C4', duration: 1 }, { note: 'E4', duration: 1 }, { note: 'G4', duration: 1.5 },
    { note: 'A4', duration: 0.5 }, { note: 'G4', duration: 2 },
    { note: 'E4', duration: 1 }, { note: 'D4', duration: 1 }, { note: 'C4', duration: 2 },
    { note: 'D4', duration: 1 }, { note: 'E4', duration: 1 }, { note: 'C4', duration: 2 },
  ],
  home: [
    { note: 'C4', duration: 1.5 }, { note: 'E4', duration: 0.5 }, { note: 'G4', duration: 1 },
    { note: 'F4', duration: 1 }, { note: 'E4', duration: 1 }, { note: 'D4', duration: 1 },
    { note: 'C4', duration: 2 }, { note: 'D4', duration: 1 }, { note: 'E4', duration: 1 },
    { note: 'F4', duration: 1.5 }, { note: 'E4', duration: 0.5 }, { note: 'D4', duration: 2 },
    { note: 'G4', duration: 1 }, { note: 'F4', duration: 1 }, { note: 'E4', duration: 1 },
    { note: 'D4', duration: 1 }, { note: 'C4', duration: 2 },
  ],
  town: [
    { note: 'G4', duration: 1 }, { note: 'A4', duration: 0.5 }, { note: 'B4', duration: 0.5 },
    { note: 'C5', duration: 1.5 }, { note: 'B4', duration: 0.5 }, { note: 'A4', duration: 1 },
    { note: 'G4', duration: 1 }, { note: 'E4', duration: 2 },
    { note: 'F4', duration: 1 }, { note: 'G4', duration: 1 }, { note: 'A4', duration: 1.5 },
    { note: 'G4', duration: 0.5 }, { note: 'F4', duration: 1 }, { note: 'E4', duration: 1 },
    { note: 'D4', duration: 1 }, { note: 'G4', duration: 2 },
  ],
  cafe: [
    { note: 'E4', duration: 1 }, { note: 'A4', duration: 1 }, { note: 'G4', duration: 0.5 },
    { note: 'A4', duration: 0.5 }, { note: 'B4', duration: 2 },
    { note: 'A4', duration: 1 }, { note: 'G4', duration: 0.5 }, { note: 'E4', duration: 0.5 },
    { note: 'F4', duration: 1 }, { note: 'E4', duration: 1 }, { note: 'D4', duration: 2 },
    { note: 'C4', duration: 1 }, { note: 'E4', duration: 0.5 }, { note: 'G4', duration: 0.5 },
    { note: 'A4', duration: 1.5 }, { note: 'G4', duration: 0.5 }, { note: 'E4', duration: 2 },
  ],
  ride: [
    // Mellow, romantis: nada panjang dan lembut untuk perjalanan motor
    { note: 'A4', duration: 2 }, { note: 'C5', duration: 2 },
    { note: 'E4', duration: 2 }, { note: 'G4', duration: 2 },
    { note: 'F4', duration: 3 }, { note: 'G4', duration: 1 },
    { note: 'E4', duration: 2 }, { note: 'D4', duration: 2 },
    { note: 'C4', duration: 4 },
    { note: 'E4', duration: 2 }, { note: 'G4', duration: 2 },
    { note: 'A4', duration: 3 }, { note: 'G4', duration: 1 },
    { note: 'E4', duration: 4 },
  ],
  final: [
    // Melodi piano mellow & romantis untuk ending
    { note: 'E4', duration: 2 }, { note: 'G4', duration: 1 }, { note: 'A4', duration: 3 },
    { note: 'G4', duration: 1 }, { note: 'E4', duration: 2 }, { note: 'C4', duration: 2 },
    { note: 'D4', duration: 1 }, { note: 'E4', duration: 1 }, { note: 'F4', duration: 3 },
    { note: 'E4', duration: 1 }, { note: 'D4', duration: 2 }, { note: 'C4', duration: 4 },
    { note: 'A4', duration: 2 }, { note: 'C5', duration: 1 }, { note: 'E5', duration: 3 },
    { note: 'D5', duration: 1 }, { note: 'C5', duration: 2 }, { note: 'A4', duration: 2 },
    { note: 'G4', duration: 2 }, { note: 'F4', duration: 2 }, { note: 'E4', duration: 4 },
    { note: 'E4', duration: 2 }, { note: 'G4', duration: 1 }, { note: 'A4', duration: 3 },
    { note: 'G4', duration: 1 }, { note: 'E4', duration: 2 }, { note: 'C4', duration: 4 },
  ],
};

// Bass patterns (chord roots)
const BASS: Record<string, string[]> = {
  boot: ['C3', 'G3', 'A3', 'F3'],
  home: ['C3', 'F3', 'G3', 'C3'],
  town: ['G3', 'C3', 'F3', 'G3'],
  cafe: ['A3', 'F3', 'C3', 'G3'],
  ride: ['E3', 'A3', 'B3', 'E3', 'A3', 'C4', 'B3', 'A3'],
  final: ['C3', 'G3', 'A3', 'F3', 'E3', 'A3', 'G3', 'C3'],
};

export class AudioSystem {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private currentBgm: number | null = null;
  private bgmPlaying = false;
  private initialized = false;

  constructor() {}

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.5;
      this.masterGain.connect(this.ctx.destination);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = 0.35;
      this.bgmGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.4;
      this.sfxGain.connect(this.masterGain);

      this.initialized = true;
    } catch {
      console.warn('Web Audio API not available');
    }
  }

  private async ensureCtx(): Promise<boolean> {
    if (!this.ctx) return false;
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    return true;
  }

  /** Panggil saat user pertama kali berinteraksi (klik/tap) untuk unlock audio */
  async unlock() {
    this.init();
    return this.ensureCtx();
  }

  playBGM(sceneKey: string) {
    this.init();
    if (!this.ctx || !this.bgmGain) return;

    const doPlay = async () => {
      const ok = await this.ensureCtx();
      if (!ok || !this.ctx || !this.bgmGain) return;
      this.startBGM(sceneKey);
    };
    doPlay();
  }

  private startBGM(sceneKey: string) {
    this.stopBGM();
    if (this.bgmGain) this.bgmGain.gain.value = sceneKey === 'final' ? 0.45 : 0.35;
    this.bgmPlaying = true;

    const melody = MELODIES[sceneKey] || MELODIES.boot;
    const bass = BASS[sceneKey] || BASS.boot;
    const isRomantic = sceneKey === 'ride' || sceneKey === 'final';
    const isPiano = sceneKey === 'final'; // Piano mellow untuk ending
    const bpm = isRomantic ? 56 : 90;
    const beatDur = 60 / bpm;

    const loopMelody = () => {
      if (!this.bgmPlaying || !this.ctx || !this.bgmGain) return;

      let time = this.ctx.currentTime + 0.05;

      // Play melody with soft sine wave
      for (const { note, duration } of melody) {
        if (!this.bgmPlaying) return;
        const freq = NOTES[note];
        if (!freq) continue;
        const dur = duration * beatDur;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = isPiano ? 'triangle' : (isRomantic ? 'sine' : 'triangle');
        osc.frequency.value = freq;
        const vol = isPiano ? 0.2 : (isRomantic ? 0.25 : 0.18);
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(vol, time + (isPiano ? 0.08 : 0.05));
        gain.gain.setValueAtTime(vol, time + dur - 0.12);
        gain.gain.linearRampToValueAtTime(0, time + dur);
        osc.connect(gain);
        gain.connect(this.bgmGain);
        osc.start(time);
        osc.stop(time + dur);
        // Piano overtone: harmonic lembut untuk warmth
        if (isPiano && freq < 600) {
          const overtone = this.ctx.createOscillator();
          const otGain = this.ctx.createGain();
          overtone.type = 'sine';
          overtone.frequency.value = freq * 2.5;
          otGain.gain.setValueAtTime(0, time);
          otGain.gain.linearRampToValueAtTime(0.04, time + 0.05);
          otGain.gain.linearRampToValueAtTime(0, time + dur);
          overtone.connect(otGain);
          otGain.connect(this.bgmGain);
          overtone.start(time);
          overtone.stop(time + dur);
        }
        time += dur;
      }

      // Play bass pad underneath
      let bassTime = this.ctx.currentTime + 0.05;
      const totalBeats = melody.reduce((s, n) => s + n.duration, 0);
      const bassDur = (totalBeats * beatDur) / bass.length;
      for (const note of bass) {
        if (!this.bgmPlaying || !this.ctx) return;
        const freq = NOTES[note];
        if (!freq) continue;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, bassTime);
        gain.gain.linearRampToValueAtTime(0.12, bassTime + 0.1);
        gain.gain.setValueAtTime(0.12, bassTime + bassDur - 0.15);
        gain.gain.linearRampToValueAtTime(0, bassTime + bassDur);
        osc.connect(gain);
        gain.connect(this.bgmGain!);
        osc.start(bassTime);
        osc.stop(bassTime + bassDur);
        bassTime += bassDur;
      }

      // Schedule next loop
      const totalDur = totalBeats * beatDur;
      this.currentBgm = window.setTimeout(() => loopMelody(), totalDur * 1000 - 100);
    };

    loopMelody();
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.currentBgm !== null) {
      clearTimeout(this.currentBgm);
      this.currentBgm = null;
    }
  }

  fadeOutBGM(duration = 1500) {
    if (!this.bgmGain || !this.ctx) {
      this.stopBGM();
      return;
    }
    const now = this.ctx.currentTime;
    this.bgmGain.gain.setValueAtTime(this.bgmGain.gain.value, now);
    this.bgmGain.gain.linearRampToValueAtTime(0, now + duration / 1000);
    setTimeout(() => {
      this.stopBGM();
      if (this.bgmGain) this.bgmGain.gain.value = 0.35;
    }, duration);
  }

  // Dialog typing sound
  playTypeSfx() {
    if (!this.ensureCtx() || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 600 + Math.random() * 200;
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.04);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  // Dialog advance sound
  playAdvanceSfx() {
    if (!this.ensureCtx() || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.linearRampToValueAtTime(660, now + 0.06);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.1);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Scene transition whoosh
  playTransitionSfx() {
    if (!this.ensureCtx() || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    // Noise-like sweep
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.5);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.5);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.5);
  }

  destroy() {
    this.stopBGM();
    this.ctx?.close();
    this.ctx = null;
    this.initialized = false;
  }
}

// Singleton
export const audioSystem = new AudioSystem();
