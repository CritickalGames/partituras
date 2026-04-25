export class FileService {
  constructor() {
    this.currentFile = null;
    this.currentUrl = null;
  }

  /**
   * Abre el diálogo nativo y devuelve el archivo seleccionado
   */
  async selectFile() {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'audio/*';
      
      input.onchange = (e) => {
        const file = e.target.files[0];
        resolve(file || null);
      };
      
      input.click();
    });
  }

  /**
   * Genera una URL temporal para un Blob o File
   */
  getObjectUrl(blobOrFile) {
    if (!blobOrFile) return null;
    
    if (this.currentUrl) {
      URL.revokeObjectURL(this.currentUrl);
    }
    
    this.currentFile = blobOrFile;
    this.currentUrl = URL.createObjectURL(blobOrFile);
    return this.currentUrl;
  }

  /**
   * Dispara la descarga del archivo actual
   */
  download(filename = 'file.webm') {
    if (!this.currentUrl || !this.currentFile) return;
    
    const a = document.createElement('a');
    a.href = this.currentUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}