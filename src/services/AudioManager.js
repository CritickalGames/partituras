import { DeviceService } from './DeviceService.js';

export class AudioManager {
  constructor() {
    this.mediaRecorder = null;
    this.streamActivo = null;
  }

  async startRecording() {
    try {
      this.streamActivo = await DeviceService.requestMicrophone();
      this.mediaRecorder = new MediaRecorder(this.streamActivo);
      const chunks = [];

      this.mediaRecorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        // Disparamos evento con el Blob crudo. Main/FileService decidirán qué hacer.
        document.dispatchEvent(new CustomEvent('audio:recording-ready', { 
          detail: { blob } 
        }));
      };

      this.mediaRecorder.start(100);
    } catch (err) {
      console.error(err);
      alert(err.message);
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
    if (this.mediaRecorder.state === 'recording') this.mediaRecorder.pause();
    else if (this.mediaRecorder.state === 'paused') this.mediaRecorder.resume();
  }
}