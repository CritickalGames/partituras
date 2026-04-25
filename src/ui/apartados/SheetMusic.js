import { Renderer, Stave, StaveNote, Voice, Formatter } from 'vexflow';

export class SheetMusic {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.renderer = null;
    this.context = null;
    
    // Dimensiones lógicas
    this.staveWidth = this.canvas.width - 40;
    this.staveHeight = 60;
    this.gap = 20;
    
    this.init();
  }

  init() {
    try {
      // VexFlow 4.x: Usar Renderer directamente con contexto Canvas
      this.renderer = new Renderer(this.canvas, Renderer.Backends.CANVAS);
      this.context = this.renderer.getContext();
      
      // Configurar tamaño del canvas en el renderer
      this.renderer.resize(this.canvas.width, this.canvas.height);
      
      console.log('✅ VexFlow inicializado correctamente');
    } catch (e) {
      console.error('❌ Error inicializando VexFlow:', e);
    }
  }

  /**
   * Dibuja el sistema completo (Sol + Fa) y coloca la nota donde corresponda.
   * @param {string} noteKey - Formato VexFlow (ej: "c/4", "g#/3")
   * @param {string} clef - 'treble' o 'bass' (opcional, se autodetecta si no se pasa)
   */
  drawNote(noteKey, clef = null) {
    if (!this.context) return;

    const ctx = this.context;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Posiciones Y de los pentagramas
    const trebleY = 40;
    const bassY = trebleY + this.staveHeight + this.gap;

    // 1. Crear Pentagrama de CLAVE DE SOL (Treble)
    const staveTreble = new Stave(10, trebleY, this.staveWidth);
    staveTreble.addClef('treble');
    staveTreble.setContext(ctx).draw();

    // 2. Crear Pentagrama de CLAVE DE FA (Bass)
    const staveBass = new Stave(10, bassY, this.staveWidth);
    staveBass.addClef('bass');
    staveBass.setContext(ctx).draw();

    // 3. Línea de unión vertical izquierda
    ctx.beginPath();
    ctx.moveTo(10, trebleY);
    ctx.lineTo(10, bassY + this.staveHeight);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000';
    ctx.stroke();

    // 4. Determinar dónde dibujar la nota
    let targetStave, targetClef;
    
    if (clef) {
      targetClef = clef;
      targetStave = clef === 'treble' ? staveTreble : staveBass;
    } else {
      // Autodetección por octava
      const isBass = noteKey.includes('/3') || noteKey.includes('/2') || noteKey.includes('/1');
      targetClef = isBass ? 'bass' : 'treble';
      targetStave = isBass ? staveBass : staveTreble;
    }

    // 5. Crear y dibujar la nota
    const vfNote = new StaveNote({ 
      keys: [noteKey], 
      duration: "q",
      clef: targetClef
    });

    const voice = new Voice({ num_beats: 1, beat_value: 4 });
    voice.addTickables([vfNote]);
    
    const formatter = new Formatter().joinVoices([voice]).format([voice], this.staveWidth - 50);
    
    voice.draw(ctx, targetStave);
  }

  clear() {
    if (!this.context) return;
    const ctx = this.context;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Redibujar solo los pentagramas vacíos
    const trebleY = 40;
    const bassY = trebleY + this.staveHeight + this.gap;
    
    const staveTreble = new Stave(10, trebleY, this.staveWidth);
    staveTreble.addClef('treble');
    staveTreble.setContext(ctx).draw();

    const staveBass = new Stave(10, bassY, this.staveWidth);
    staveBass.addClef('bass');
    staveBass.setContext(ctx).draw();
    
    // Línea de unión
    ctx.beginPath();
    ctx.moveTo(10, trebleY);
    ctx.lineTo(10, bassY + this.staveHeight);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000';
    ctx.stroke();
  }
}