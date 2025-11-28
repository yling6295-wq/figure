export interface ImageFile {
  data: string; // Base64 string
  mimeType: string;
  previewUrl: string;
}

export interface GenerationResult {
  imageUrl?: string;
  text?: string;
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}