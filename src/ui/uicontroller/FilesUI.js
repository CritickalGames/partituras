export class FilesUI {
  constructor(elements) {
    this.els = elements; // { cargar, descargar, reiniciar }
  }

  bindEvents(dispatcher) {
    if (this.els.cargar) {
      this.els.cargar.addEventListener('click', () => {
        dispatcher.dispatchEvent(new CustomEvent('uic_fileui:load'));
      });
    }

    if (this.els.descargar) {
      this.els.descargar.addEventListener('click', () => {
        dispatcher.dispatchEvent(new CustomEvent('uic_fileui:download'));
      });
    }

    if (this.els.reiniciar) {
      this.els.reiniciar.addEventListener('click', () => location.reload());
    }
  }
}