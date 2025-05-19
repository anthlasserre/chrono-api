export enum ChronoStatus {
  CREATED = "CREATED",
  RUNNING = "RUNNING",
  PAUSED = "PAUSED",
  STOPPED = "STOPPED",
}

export interface Chrono {
  id: string;
  origin: string;
  status: ChronoStatus;
  duration: number;
  startTime: string | null;
  createdAt: string;
  updatedAt: string;
  getCurrentDuration(): number;
}
