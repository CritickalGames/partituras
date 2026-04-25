export class Visualizer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.analyser = null;
    this.animationFrameId = null;
    this.isRunning = false;

    this._resizeCanvas();
    window.addEventListener('resize', () => this._resizeCanvas());
  }

  _resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
    this.ctx.scale(dpr, dpr);

    this.width = rect.width;
    this.height = rect.height;
  }

  start(analyser) {
    if (this.isRunning) return;
    this.analyser = analyser;
    this.isRunning = true;
    this._renderLoop();
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.ctx.fillStyle = '#0a0a15';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  _renderLoop() {
    if (!this.isRunning) return;

    if (this.analyser) {
      this._drawSpectrum(this.analyser);
    } else {
      this._drawIdle();
    }

    this.animationFrameId = requestAnimationFrame(() => this._renderLoop());
  }

  _drawSpectrum(analyser) {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    this.ctx.fillStyle = '#0a0a15';
    this.ctx.fillRect(0, 0, this.width, this.height);

    const barWidth = (this.width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * this.height * 0.9;
      const hue = 200 + (i / bufferLength) * 60;
      const lightness = 30 + (dataArray[i] / 255) * 40;

      this.ctx.fillStyle = `hsl(${hue}, 80%, ${lightness}%)`;

      const radius = Math.min(barWidth / 2, 4);
      this._roundRect(x, this.height - barHeight, barWidth, barHeight, radius);

      x += barWidth + 1;
      if (x > this.width) break;
    }
  }

  _drawIdle() {
    this.ctx.fillStyle = '#0a0a15';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.strokeStyle = '#1f1f2e';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.height / 2);
    this.ctx.lineTo(this.width, this.height / 2);
    this.ctx.stroke();
  }

  _roundRect(x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    this.ctx.beginPath();
    this.ctx.moveTo(x + r, y);
    this.ctx.arcTo(x + w, y, x + w, y + h, r);
    this.ctx.arcTo(x + w, y + h, x, y + h, 0);
    this.ctx.arcTo(x, y + h, x, y, 0);
    this.ctx.arcTo(x, y, x + w, y, r);
    this.ctx.closePath();
    this.ctx.fill();
  }
}
