import { TimerManager } from './uicontroller/TimerManager.js';
import { PlaybackUI } from './uicontroller/PlaybackUI.js';
import { RecordingUI } from './uicontroller/RecordingUI.js';
import { FilesUI } from './uicontroller/FilesUI.js';

export class UIController {
  constructor() {
    this.els = {
      grabar: document.getElementById('btn-grabar'),
      pauseRec: document.getElementById('btn-pause-rec'),
      detener: document.getElementById('btn-detener'),
      descargar: document.getElementById('btn-descargar'),
      cargar: document.getElementById('btn-cargar'),
      play: document.getElementById('btn-play'),
      stopPlay: document.getElementById('btn-stop-play'),
      reiniciar: document.getElementById('btn-reiniciar'),
      timer: document.getElementById('timer'),
      audioPlayer: document.getElementById('audio-player')
    };

    this.timerMgr = new TimerManager(this.els.timer);
    
    this.playbackUI = new PlaybackUI({
      play: this.els.play,
      stopPlay: this.els.stopPlay,
      audioPlayer: this.els.audioPlayer
    });
    
    this.recordingUI = new RecordingUI({
      grabar: this.els.grabar,
      pauseRec: this.els.pauseRec,
      detener: this.els.detener,
      descargar: this.els.descargar,
      play: this.els.play,
      stopPlay: this.els.stopPlay
    }, this.timerMgr);

    this.filesUI = new FilesUI({
      cargar: this.els.cargar,
      descargar: this.els.descargar,
      reiniciar: this.els.reiniciar
    });
  }

  initialize() {
    this.recordingUI.bindEvents(document);
    this.filesUI.bindEvents(document); // ✅ Vinculado
    this._bindPlaybackControls();
  }

  _bindPlaybackControls() {
    if (this.els.play) this.els.play.addEventListener('click', () => this.playbackUI.togglePlay());
    if (this.els.stopPlay) this.els.stopPlay.addEventListener('click', () => this.playbackUI.stop());
  }

  setAudioSource(url) {
    this.playbackUI.loadSource(url);
  }
}