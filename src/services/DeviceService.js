export class DeviceService {
  static async requestMicrophone() {
    if (!window.isSecureContext) {
      throw new Error('Requiere HTTPS o localhost.');
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        }
      });
      return stream;
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        throw new Error('Permiso denegado. Habilita el micrófono en la barra de direcciones.');
      } else if (err.name === 'NotFoundError') {
        throw new Error('No se encontró micrófono.');
      } else {
        throw err;
      }
    }
  }
}