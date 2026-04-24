import { AudioManager } from './services/AudioManager.js';
import { UIController } from './ui/UIController.js';

const audioMgr = new AudioManager();

async function init() {
  const ui = new UIController();
  ui.initialize();

  document.addEventListener('audio:start', () => {
    audioMgr.startRecording((state) => console.log(`Estado: ${state}`));
  });

  document.addEventListener('audio:stop', () => audioMgr.stopRecording());

  // Tanto pause como resume llaman al mismo método que alterna estados
  document.addEventListener('audio:pause', () => audioMgr.pauseRecording());
  document.addEventListener('audio:resume', () => audioMgr.pauseRecording());

  document.addEventListener('audio:togglePlay', () => audioMgr.togglePlay());
  document.addEventListener('audio:load', e => audioMgr.loadFile(e.detail));
  document.addEventListener('audio:download', () => audioMgr.download(`grabacion_${Date.now()}.webm`));
}

init();