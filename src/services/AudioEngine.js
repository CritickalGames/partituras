import PitchFinder from 'pitchfinder';
import { hzToNote } from '../core/musicTheory.js';
import { Note } from '@tonaljs/tonal';

export class AudioEngine {
  constructor(onNoteDetected, onChordDetected) {
    this.audioContext = null;
    this.analyser = null;
    this.pitchDetector = null;
    this.onNoteDetected = onNoteDetected;
    this.onChordDetected = onChordDetected;
    this.animationFrame = null;
  }

  start(stream) {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;

    const source = this.audioContext.createMediaStreamSource(stream);
    source.connect(this.analyser);

    this.pitchDetector = PitchFinder.MCLEOD({
      sampleRate: this.audioContext.sampleRate,
      minFrequency: 80,
      maxFrequency: 1200
    });

    this._loop();
  }

  _loop() {
    const bufferLength = this.analyser.fftSize;
    const timeData = new Float32Array(bufferLength);
    this.analyser.getFloatTimeDomainData(timeData);

    const frequency = this.pitchDetector(timeData);

    if (frequency) {
      const note = hzToNote(frequency);
      if (note) {
        const midi = Note.midi(note);
        this.onNoteDetected(note, midi);
      }
    }

    this.animationFrame = requestAnimationFrame(() => this._loop());
  }

  stop() {
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    if (this.audioContext) this.audioContext.close();
  }

  getAnalyser() {
    return this.analyser;
  }
}
