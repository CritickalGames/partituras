import { DeviceService } from './DeviceService.js';

export class AudioManager {
  constructor() {
    this.mediaRecorder = null;
    this.streamActivo = null;
    this.audioElement = null;
    this.audioBlob = null;
    this.audioUrl = null;
  }

  async startRecording(onStateChange) {
    try {
      this.streamActivo = await DeviceService.requestMicrophone();
      this.mediaRecorder = new MediaRecorder(this.streamActivo);
      const chunks = [];

      this.mediaRecorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        this._loadAudio(blob);
        onStateChange?.('stopped');
      };

      this.mediaRecorder.start(100);
      onStateChange?.('recording');
    } catch (err) {
      console.error(err);
      alert(err.message);
      onStateChange?.('error');
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.streamActivo?.getTracks().forEach(t => t.stop());
    }
  }

  pauseRecording() {
    if (!this.mediaRecorder) return;
    
    // Si está grabando, pausa. Si está pausado, reanuda.
    if (this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
      console.log('🎙️ Grabación pausada (silencio)');
    } else if (this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
      console.log('🎙️ Grabación reanudada');
    }
  }

  loadFile(file) {
    this._loadAudio(file);
  }

  togglePlay() {
    if (!this.audioElement) return false;
    if (this.audioElement.paused) {
      this.audioElement.play();
      return true;
    } else {
      this.audioElement.pause();
      return false;
    }
  }

  download(filename = 'audio.webm') {
    if (!this.audioBlob || !this.audioUrl) return;
    const a = document.createElement('a');
    a.href = this.audioUrl;
    a.download = filename;
    a.click();
  }

  _loadAudio(blobOrFile) {
    if (this.audioUrl) URL.revokeObjectURL(this.audioUrl);
    this.audioBlob = blobOrFile;
    this.audioUrl = URL.createObjectURL(blobOrFile);
    this.audioElement = new Audio(this.audioUrl);
  }
}