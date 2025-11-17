export type JourneyType = 'poetic' | 'direct' | 'visual' | 'wildcard';

export interface QuoteOptions {
  source: 'generate' | 'own';
  usePhilosopher: boolean;
  useModernThinker: boolean;
  useLuminary: boolean;
  useRebel: boolean;
  useMystic: boolean;
  useStrategicMind: boolean;
  useAuthor: boolean;
  mood: string;
  philosopher: string;
  modernThinker: string;
  luminary: string;
  rebel: string;
  mystic: string;
  strategicMind: string;
  author: string;
  ownQuote: string;
  generatedQuote: string;
  inspirationSources: string[];
}

export interface ImageOptions {
  colorScheme: string;
  backdrop: string;
  prompt: string;
  uploadedImage: File | null;
  aspectRatio: string;
}

export interface StyleOptions {
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  fontWeight: string;
  isBold: boolean;
  isItalic: boolean;
  position: 'topLeft' | 'topCenter' | 'topRight' | 'centerLeft' | 'center' | 'centerRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight';
  textAlign: 'left' | 'center' | 'right';
  textOutlineEnabled: boolean;
  textOutlineColor: string;
  textOutlineWidth: number;
  textBackgroundEnabled: boolean;
  textBackgroundColor: string;
  textBackgroundOpacity: number;
  textBackgroundPadding: number;
  textBackgroundBorderRadius: number;
}

export interface WatermarkOptions {
  image: File | null;
  enabled: boolean;
  position: 'topLeft' | 'topCenter' | 'topRight' | 'centerLeft' | 'center' | 'centerRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight';
  opacity: number;
  size: number; // as a percentage of canvas width
}

export interface LoadingStates {
  quote: boolean;
  image: boolean;
  journey: boolean;
}

export interface JourneyItem {
  quote: string;
  image: string;
  inspirationSources?: string[];
  style: StyleOptions;
}

export interface ImageTransform {
  x: number;
  y: number;
  scale: number;
}

export interface AppState {
  quote: QuoteOptions;
  image: ImageOptions;
  style: StyleOptions;
  watermark: WatermarkOptions;
  generatedImage: string | null;
  loading: LoadingStates;
  journey: JourneyItem[];
  selectedJourneyItemIndex: number | null;
  imageTransform: ImageTransform;
}