// Estado global
let mediaRecorder = null;
let audioChunks = [];
let audioBlob = null;
let audioUrl = null;
let audioElement = null;
let timerInterval = null;
let startTime = null;
let isPlaying = false;

// Elementos del DOM
const els = {
  grabar: document.getElementById('btn-grabar'),
  pausar: document.getElementById('btn-pausar'),
  detener: document.getElementById('btn-detener'),
  reiniciar: document.getElementById('btn-reiniciar'),
  play: document.getElementById('btn-play'),
  pausePlay: document.getElementById('btn-pause-play'),
  stopPlay: document.getElementById('btn-stop-play'),
  descargar: document.getElementById('btn-descargar'),
  cargar: document.getElementById('input-cargar'),
  estado: document.getElementById('estado'),
  timer: document.getElementById('timer')
};

// === GRABACIÓN ===
els.grabar.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];
    
    mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
    mediaRecorder.onstop = () => {
      audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      audioUrl = URL.createObjectURL(audioBlob);
      audioElement = new Audio(audioUrl);
      
      // Configurar eventos del audio
      audioElement.onended = () => {
        isPlaying = false;
        els.play.disabled = false;
        els.pausePlay.disabled = true;
        els.stopPlay.disabled = true;
        els.pausePlay.textContent = '⏸ Pause';
      };
      
      els.play.disabled = false;
      els.descargar.disabled = false;
    };
    
    mediaRecorder.start();
    startTime = Date.now();
    timerInterval = setInterval(actualizarTimer, 100);
    els.estado.textContent = '🔴 Grabando...';
    els.grabar.disabled = true;
    els.pausar.disabled = false;
    els.detener.disabled = false;
  } catch (err) {
    alert('Error al acceder al micrófono: ' + err.message);
  }
});

els.pausar.addEventListener('click', () => {
  if (mediaRecorder.state === 'recording') {
    mediaRecorder.pause();
    els.pausar.textContent = '▶ Reanudar';
    clearInterval(timerInterval);
  } else if (mediaRecorder.state === 'paused') {
    mediaRecorder.resume();
    els.pausar.textContent = '⏸ Pausar';
    timerInterval = setInterval(actualizarTimer, 100);
  }
});

els.detener.addEventListener('click', () => {
  mediaRecorder.stop();
  mediaRecorder.stream.getTracks().forEach(t => t.stop());
  clearInterval(timerInterval);
  els.estado.textContent = '✅ Grabación detenida';
  els.grabar.disabled = false;
  els.pausar.disabled = true;
  els.detener.disabled = true;
  els.pausar.textContent = '⏸ Pausar';
});

// === REPRODUCCIÓN ===
els.play.addEventListener('click', () => {
  if (audioElement) {
    audioElement.play();
    isPlaying = true;
    els.play.disabled = true;
    els.pausePlay.disabled = false;
    els.stopPlay.disabled = false;
    els.pausePlay.textContent = '⏸ Pause';
  }
});

els.pausePlay.addEventListener('click', () => {
  if (audioElement && isPlaying) {
    audioElement.pause();
    isPlaying = false;
    els.pausePlay.textContent = '▶ Play';
  } else if (audioElement && !isPlaying) {
    audioElement.play();
    isPlaying = true;
    els.pausePlay.textContent = '⏸ Pause';
  }
});

els.stopPlay.addEventListener('click', () => {
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
    isPlaying = false;
    els.play.disabled = false;
    els.pausePlay.disabled = true;
    els.stopPlay.disabled = true;
    els.pausePlay.textContent = '⏸ Pause';
  }
});

// === ARCHIVOS ===
els.descargar.addEventListener('click', () => {
  if (!audioBlob) return;
  const a = document.createElement('a');
  a.href = audioUrl;
  a.download = `audio_${Date.now()}.webm`;
  a.click();
});

els.cargar.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  audioUrl = URL.createObjectURL(file);
  audioElement = new Audio(audioUrl);
  audioBlob = file;
  
  audioElement.onended = () => {
    isPlaying = false;
    els.play.disabled = false;
    els.pausePlay.disabled = true;
    els.stopPlay.disabled = true;
  };
  
  els.play.disabled = false;
  els.descargar.disabled = false;
  els.estado.textContent = `📂 ${file.name}`;
});

// === UTILIDADES ===
function actualizarTimer() {
  const delta = Math.floor((Date.now() - startTime) / 1000);
  const m = Math.floor(delta / 60).toString().padStart(2, '0');
  const s = (delta % 60).toString().padStart(2, '0');
  els.timer.textContent = `${m}:${s}`;
}

els.reiniciar.addEventListener('click', () => {
  location.reload();
});