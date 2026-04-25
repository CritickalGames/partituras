export class PlaybackUI {
  constructor(elements) {
    this.els = elements; // { play, stopPlay, audioPlayer }
    this._syncEvents();
  }

  /**
   * Sincroniza el botón Play/Pause con los eventos nativos del <audio>
   */
  _syncEvents() {
    if (!this.els.audioPlayer || !this.els.play) return;

    // Cuando el audio empieza a sonar (por cualquier razón)
    this.els.audioPlayer.addEventListener('play', () => {
      this._setPlayButtonState(true);
    });

    // Cuando el audio se pausa o termina
    this.els.audioPlayer.addEventListener('pause', () => {
      this._setPlayButtonState(false);
    });

    this.els.audioPlayer.addEventListener('ended', () => {
      this._setPlayButtonState(false);
    });
    
    // Manejo básico de errores
    this.els.audioPlayer.addEventListener('error', (e) => {
      console.error('❌ Error en reproducción de audio:', e);
      this._setPlayButtonState(false);
    });
  }

  /**
   * Cambia el texto/icono del botón según el estado
   */
  _setPlayButtonState(isPlaying) {
    if (!this.els.play) return;
    this.els.play.textContent = isPlaying ? '⏸ Pause' : '▶ Play';
    // Opcional: Aquí podrías añadir clases CSS si quieres cambiar colores
  }

  /**
   * Alterna entre reproducir y pausar
   */
  togglePlay() {
    if (!this.els.audioPlayer) return;

    // Validación de seguridad: No intentar reproducir si no hay fuente
    if (!this.els.audioPlayer.src || this.els.audioPlayer.src === window.location.href) {
      console.warn('⚠️ No hay audio cargado para reproducir');
      return;
    }

    if (this.els.audioPlayer.paused) {
      this.els.audioPlayer.play().catch(e => console.error('Error al reproducir:', e));
    } else {
      this.els.audioPlayer.pause();
    }
  }

  /**
   * Detiene la reproducción y rebobina al inicio
   */
  stop() {
    if (this.els.audioPlayer) {
      this.els.audioPlayer.pause();
      this.els.audioPlayer.currentTime = 0;
    }
  }

  /**
   * Carga una nueva fuente de audio en el elemento <audio>
   * @param {string} url - URL del blob o archivo
   */
  loadSource(url) {
    if (this.els.audioPlayer && url) {
      this.els.audioPlayer.src = url;
      this.els.audioPlayer.load();
      
      // Habilitar controles manuales ya que ahora hay audio disponible
      if (this.els.play) this.els.play.disabled = false;
      if (this.els.stopPlay) this.els.stopPlay.disabled = false;
      
      console.log('✅ Fuente de audio cargada en reproductor');
    }
  }
}