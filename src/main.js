import { AudioManager } from './services/AudioManager.js';
import { FileService } from './services/FileService.js';
import { UIController } from './ui/UIController.js';

const audioMgr = new AudioManager();
const fileSvc = new FileService();
let ui = null;

async function init() {
  ui = new UIController();
  ui.initialize();

  // ==========================================
  // RUTAS DE EVENTOS: UI -> SERVICIOS
  // ==========================================

  // 1. Grabación
  document.addEventListener('uic_recording:start', () => audioMgr.startRecording());
  document.addEventListener('uic_recording:stop', () => audioMgr.stopRecording());
  document.addEventListener('uic_recording:pause-rec', () => audioMgr.pauseRecording());
  document.addEventListener('uic_recording:resume-rec', () => audioMgr.pauseRecording());

  // 2. Archivos (Carga/Descarga)
  document.addEventListener('uic_fileui:load', async () => {
    const file = await fileSvc.selectFile();
    if (file) {
      const url = fileSvc.getObjectUrl(file);
      // Avisamos a la UI para que reproduzca
      document.dispatchEvent(new CustomEvent('app:update-player', { detail: url }));
    }
  });

  document.addEventListener('uic_fileui:download', () => {
    fileSvc.download(`grabacion_${Date.now()}.webm`);
  });

  // ==========================================
  // RUTAS DE EVENTOS: SERVICIOS -> UI
  // ==========================================

  // Cuando termina la grabación, pasamos el Blob a FileService para obtener URL
  document.addEventListener('audio:recording-ready', (e) => {
    const { blob } = e.detail;
    const url = fileSvc.getObjectUrl(blob);
    
    // Actualizamos la UI
    document.dispatchEvent(new CustomEvent('app:update-player', { detail: url }));
  });

  // Evento centralizado para actualizar el reproductor visual
  document.addEventListener('app:update-player', (e) => {
    if (ui) ui.setAudioSource(e.detail);
  });
}

init();