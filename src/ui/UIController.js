export class UIController {
  constructor() {
    this.els = {
      grabar: document.getElementById('btn-grabar'),
      pausar: document.getElementById('btn-pausar'),
      detener: document.getElementById('btn-detener'),
      descargar: document.getElementById('btn-descargar'),
      cargar: document.getElementById('btn-cargar'),
      inputFile: document.getElementById('input-file-audio'),
      play: document.getElementById('btn-play'),
      reiniciar: document.getElementById('btn-reiniciar'),
      timer: document.getElementById('timer')
    };

    this.timerInterval = null;
    this.startTime = 0;
    this.elapsedTime = 0; // Tiempo acumulado en ms
  }

  initialize() {
    this._bindEvents();
  }

  _bindEvents() {
    if (!this.els.grabar || !this.els.detener) return;

    // 1. GRABAR
    this.els.grabar.addEventListener('click', () => {
      this._startTimer();
      document.dispatchEvent(new CustomEvent('audio:start'));
      
      this._setRecordingState(true);
    });

    // 2. PAUSAR / REANUDAR
    if (this.els.pausar) {
      this.els.pausar.addEventListener('click', () => {
        const isCurrentlyPaused = this.els.pausar.textContent.includes('Reanudar');

        if (isCurrentlyPaused) {
          // REANUDAR
          this._resumeTimer();
          this.els.pausar.textContent = '⏸ Pausar';
          document.dispatchEvent(new CustomEvent('audio:resume'));
        } else {
          // PAUSAR
          this._pauseTimer();
          this.els.pausar.textContent = '▶ Reanudar';
          document.dispatchEvent(new CustomEvent('audio:pause'));
        }
      });
    }

    // 3. DETENER
    this.els.detener.addEventListener('click', () => {
      this._stopTimer();
      document.dispatchEvent(new CustomEvent('audio:stop'));
      this._setRecordingState(false);
    });

    // 4. DESCARGAR
    if (this.els.descargar) {
      this.els.descargar.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('audio:download'));
      });
    }

    // 5. CARGAR
    if (this.els.cargar && this.els.inputFile) {
      this.els.cargar.addEventListener('click', () => this.els.inputFile.click());
      this.els.inputFile.addEventListener('change', e => {
        if (e.target.files[0]) {
          document.dispatchEvent(new CustomEvent('audio:load', { detail: e.target.files[0] }));
        }
      });
    }

    // 6. PLAY
    if (this.els.play) {
      this.els.play.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('audio:togglePlay'));
      });
    }

    // 7. REINICIAR
    if (this.els.reiniciar) {
      this.els.reiniciar.addEventListener('click', () => location.reload());
    }
  }

  // --- Lógica del Cronómetro ---

  _startTimer() {
    this.elapsedTime = 0;
    this.startTime = Date.now();
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => this._updateTimerDisplay(), 100);
  }

  _pauseTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    // Guardar cuánto tiempo ha pasado hasta ahora
    this.elapsedTime += Date.now() - this.startTime;
  }

  _resumeTimer() {
    if (!this.timerInterval) {
      this.startTime = Date.now();
      this.timerInterval = setInterval(() => this._updateTimerDisplay(), 100);
    }
  }

  _stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.els.timer.textContent = '00:00';
    this.elapsedTime = 0;
    this.startTime = 0;
  }

  _updateTimerDisplay() {
    // Tiempo total = Tiempo acumulado antes de pausas + Tiempo actual desde el último start/resume
    const now = Date.now();
    const currentSession = now - this.startTime;
    const totalMs = this.elapsedTime + currentSession;

    const delta = Math.floor(totalMs / 1000);
    const m = Math.floor(delta / 60).toString().padStart(2, '0');
    const s = (delta % 60).toString().padStart(2, '0');
    
    if (this.els.timer) this.els.timer.textContent = `${m}:${s}`;
  }

  // --- Utilidad Visual ---
  _setRecordingState(isRecording) {
    this.els.grabar.disabled = isRecording;
    
    if (this.els.pausar) {
      this.els.pausar.disabled = !isRecording;
      if (!isRecording) this.els.pausar.textContent = '⏸ Pausar';
    }
    
    this.els.detener.disabled = !isRecording;
    
    if (this.els.play) this.els.play.disabled = isRecording;
    if (this.els.descargar) this.els.descargar.disabled = isRecording;
  }
}