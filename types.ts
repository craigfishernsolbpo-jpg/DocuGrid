export interface ExtractionResult {
  rawCsv: string;
  parsedData: string[][];
}

export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface ProcessingStats {
  startTime: number;
  endTime?: number;
  tokenCount?: number;
}