
export interface Book {
  id: number;
  volume: string;
  title: string;
  summary: string;
  imagePrompt: string;
  imageAlt: string;
  pdfUrl: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}
