import { Note, Chord } from '@tonaljs/tonal';

/**
 * Convierte una frecuencia en Hz a una nota en notación científica (ej: "A4").
 * @param {number} hz - Frecuencia en Hz
 * @returns {string|null} Nota detectada o null si está fuera de rango
 */
export function hzToNote(hz) {
  if (!hz || hz < 20 || hz > 5000) return null;
  const midi = 69 + 12 * Math.log2(hz / 440);
  return Note.fromMidi(Math.round(midi));
}

/**
 * Identifica un acorde a partir de un conjunto de notas.
 * @param {string[]} notes - Array de notas en formato científico (ej: ["C4","E4","G4"])
 * @returns {string|null} Nombre del acorde detectado o null si no se reconoce
 */
export function identifyChord(notes) {
  if (!notes || notes.length < 2) return null;

  // Tonal detecta acordes a partir de nombres de notas (sin octava)
  // Ejemplo: ["C", "E", "G"] → "C"
  const strippedNotes = notes.map(n => Note.pitchClass(n)).filter(Boolean);

  const detected = Chord.detect(strippedNotes);
  if (detected && detected.length > 0) {
    return detected[0]; // Devolver el primer acorde reconocido
  }

  return null;
}
