export class RecordingUI {
  constructor(elements, timerManager) {
    this.els = elements;
    this.timer = timerManager;
  }

  bindEvents(dispatcher) {
    if (!this.els.grabar || !this.els.detener) return;

    // 1. GRABAR
    this.els.grabar.addEventListener('click', () => {
      this.timer.start();
      dispatcher.dispatchEvent(new CustomEvent('uic_recording:start')); // ✅ Cambio
      this.setRecordingState(true);
    });

    // 2. PAUSAR / REANUDAR GRABACIÓN
    if (this.els.pauseRec) {
      this.els.pauseRec.addEventListener('click', () => {
        const isPaused = this.els.pauseRec.textContent.includes('Reanudar');
        
        if (isPaused) {
          this.timer.resume();
          this.els.pauseRec.textContent = '⏸ Pausar';
          dispatcher.dispatchEvent(new CustomEvent('uic_recording:resume-rec')); // ✅ Cambio
        } else {
          this.timer.pause();
          this.els.pauseRec.textContent = '▶ Reanudar';
          dispatcher.dispatchEvent(new CustomEvent('uic_recording:pause-rec')); // ✅ Cambio
        }
      });
    }

    // 3. DETENER GRABACIÓN
    this.els.detener.addEventListener('click', () => {
      this.timer.stop();
      dispatcher.dispatchEvent(new CustomEvent('uic_recording:stop')); // ✅ Cambio
      this.setRecordingState(false);
    });
  }

  setRecordingState(isRecording) {
    this.els.grabar.disabled = isRecording;
    
    if (this.els.pauseRec) {
      this.els.pauseRec.disabled = !isRecording;
      if (!isRecording) this.els.pauseRec.textContent = '⏸ Pausar';
    }
    
    this.els.detener.disabled = !isRecording;
    
    if (this.els.play) this.els.play.disabled = isRecording;
    if (this.els.stopPlay) this.els.stopPlay.disabled = isRecording;
    if (this.els.descargar) this.els.descargar.disabled = isRecording;
  }
}