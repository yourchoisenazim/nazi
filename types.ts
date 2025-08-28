export const AppStatus = {
  IDLE: 0,
  UPLOADING: 1,
  GENERATING: 2,
  SUCCESS: 3,
  ERROR: 4,
};

export interface VideoResult {
  url: string;
  blob: Blob;
}
