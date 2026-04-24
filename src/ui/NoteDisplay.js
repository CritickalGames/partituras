export class NoteDisplay {
  constructor(options = {}) {
    this.noteEl = options.noteEl || document.getElementById('nota-base');
    this.chordEl = options.chordEl || document.getElementById('acorde-detectado');
    this.currentNote = null;
    this.currentChord = null;
    this._injectStyles();
  }

  _injectStyles() {
    if (document.getElementById('nd-styles')) return;
    const style = document.createElement('style');
    style.id = 'nd-styles';
    style.textContent = `
      .nd-note { font-family: monospace; transition: all 0.15s ease-out; display: inline-block; }
      .nd-pulse { animation: nd-pulse-anim 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      @keyframes nd-pulse-anim { 0% { transform: scale(1); } 50% { transform: scale(1.15); } 100% { transform: scale(1); } }
      .nd-range-low { color: #ff9800; text-shadow: 0 0 15px rgba(255,152,0,0.4); }
      .nd-range-mid { color: #4caf50; text-shadow: 0 0 15px rgba(76,175,80,0.4); }
      .nd-range-high { color: #2196f3; text-shadow: 0 0 15px rgba(33,150,243,0.4); }
      .nd-chord-major { color: #64b5f6; }
      .nd-chord-minor { color: #f06292; }
      .nd-chord-seventh { color: #ffb74d; }
      .nd-chord-dim { color: #ce93d8; }
      .nd-chord-aug { color: #ff8a65; }
      .nd-chord-unknown { color: #b0bec5; }
    `;
    document.head.appendChild(style);
  }

  updateNote(note, midi = null) {
    if (!note || note === this.currentNote) return;
    this.currentNote = note;

    let rangeClass = 'mid';
    if (midi !== undefined) {
      const octave = Math.floor(midi / 12) - 1;
      if (octave < 3) rangeClass = 'low';
      else if (octave > 5) rangeClass = 'high';
    }

    this.noteEl.textContent = note;
    this.noteEl.className = `nd-note nd-range-${rangeClass} nd-pulse`;
    setTimeout(() => this.noteEl.classList.remove('nd-pulse'), 200);
  }

  updateChord(chord) {
    const displayChord = chord || '--';
    if (displayChord === this.currentChord) return;
    this.currentChord = displayChord;

    let typeClass = 'unknown';
    if (chord) {
      const lower = chord.toLowerCase();
      if (lower.includes('m') && !lower.includes('maj') && !lower.includes('aug')) typeClass = 'minor';
      else if (lower.includes('maj') || (!lower.includes('m') && !lower.includes('dim') && !lower.includes('aug'))) typeClass = 'major';
      else if (lower.includes('7') || lower.includes('9') || lower.includes('11') || lower.includes('13')) typeClass = 'seventh';
      else if (lower.includes('dim') || lower.includes('°')) typeClass = 'dim';
      else if (lower.includes('aug') || lower.includes('+')) typeClass = 'aug';
    }

    this.chordEl.textContent = displayChord;
    this.chordEl.className = `nd-note nd-chord-${typeClass} nd-pulse`;
    setTimeout(() => this.chordEl.classList.remove('nd-pulse'), 200);
  }

  clear() {
    this.currentNote = null;
    this.currentChord = null;
    this.noteEl.textContent = '--';
    this.chordEl.textContent = '--';
    this.noteEl.className = 'nd-note';
    this.chordEl.className = 'nd-note';
  }
}
