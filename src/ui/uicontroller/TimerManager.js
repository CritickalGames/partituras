export class TimerManager {
  constructor(timerElement) {
    this.el = timerElement;
    this.intervalId = null;
    this.startTime = 0;
    this.elapsedTime = 0; // Tiempo acumulado en ms (para pausas)
  }

  /**
   * Inicia el cronómetro desde cero
   */
  start() {
    this.elapsedTime = 0;
    this.startTime = Date.now();
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => this._updateDisplay(), 100);
  }

  /**
   * Pausa el cronómetro acumulando el tiempo transcurrido
   */
  pause() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    // Guardar cuánto tiempo ha pasado hasta este momento
    this.elapsedTime += Date.now() - this.startTime;
  }

  /**
   * Reanuda el cronómetro desde donde se quedó
   */
  resume() {
    if (!this.intervalId) {
      this.startTime = Date.now();
      this.intervalId = setInterval(() => this._updateDisplay(), 100);
    }
  }

  /**
   * Detiene y resetea el cronómetro a 00:00
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this._resetDisplay();
    this.elapsedTime = 0;
    this.startTime = 0;
  }

  /**
   * Actualiza el texto del elemento DOM
   */
  _updateDisplay() {
    const now = Date.now();
    const currentSession = now - this.startTime;
    const totalMs = this.elapsedTime + currentSession;
    
    const delta = Math.floor(totalMs / 1000);
    const m = Math.floor(delta / 60).toString().padStart(2, '0');
    const s = (delta % 60).toString().padStart(2, '0');
    
    if (this.el) this.el.textContent = `${m}:${s}`;
  }

  _resetDisplay() {
    if (this.el) this.el.textContent = '00:00';
  }
}