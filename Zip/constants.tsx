
import { Book } from './types';

export const BOOKS: Book[] = [
  {
    id: 1,
    volume: "Volumen 1",
    title: "Introducción del Maestro Emilio",
    summary: "Relato del primer año de la expedición (1894). El encuentro con el Maestro Emilio y la observación de milagros como caminar sobre el agua y la superación del concepto mortal de la muerte.",
    imagePrompt: "19th century vintage sepia photograph, group of explorers in the Himalayas, mystical monk appearing in the snow, grainy texture, high contrast.",
    imageAlt: "Exploradores y monje místico en el Himalaya, 1894",
    pdfUrl: "#vol1"
  },
  {
    id: 2,
    volume: "Volumen 2",
    title: "El Templo de la Gran Cruz Tau",
    summary: "Encuentros trascendentales con el Maestro Jesús. Discusiones profundas sobre la naturaleza de Dios y cómo las vibraciones del pensamiento moldean nuestra realidad física.",
    imagePrompt: "Ancient stone temple interior, soft light filtering through a cross-shaped window, sepia tones, hyper-realistic old photograph style.",
    imageAlt: "Interior del Templo de la Gran Cruz Tau",
    pdfUrl: "#vol2"
  },
  {
    id: 3,
    volume: "Volumen 3",
    title: "La Cristo-Conciencia",
    summary: "Exploración de la creación de mundos a través de la mente. El viaje sagrado a Lhasa y el develamiento del misterio de la levitación como una facultad natural del hombre espiritual.",
    imagePrompt: "Levitating figure over a Tibetan valley, charcoal sketch over aged paper, 1890s expedition photography style.",
    imageAlt: "Figura levitando sobre un valle tibetano",
    pdfUrl: "#vol3"
  },
  {
    id: 4,
    volume: "Volumen 4",
    title: "El Legado de la Humanidad",
    summary: "Enseñanzas sobre la Gran Hermandad Blanca y la Uni-Mente. Un llamado a la paz mundial reconociendo que todos somos expresiones de una única fuente creativa.",
    imagePrompt: "Symbolic representation of the Great White Brotherhood, mountain peaks, rays of light, sepia and monochrome, vintage effect.",
    imageAlt: "Símbolos de la Gran Hermandad Blanca",
    pdfUrl: "#vol4"
  },
  {
    id: 5,
    volume: "Volumen 5",
    title: "Conferencias Finales",
    summary: "La maestría sobre la muerte, la ley del abastecimiento universal y el patrón divino. Spalding resume las lecciones finales de la expedición científica.",
    imagePrompt: "Portrait of an old master in the Far East, serene expression, vintage plate photography, sepia brown tones, highly detailed.",
    imageAlt: "Retrato de un Maestro del Lejano Oriente",
    pdfUrl: "#vol5"
  }
];

export const COLORS = {
  ocre: "#A67B5B",
  sepia: "#704214",
  crema: "#F5F5DC",
  black: "#1a1a1a"
};
