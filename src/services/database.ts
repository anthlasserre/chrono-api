import { Chrono } from "../entities/Chrono";
import { ChronoStatus } from "../types/chrono";
import { AppDataSource } from "../config/database";

export class DatabaseService {
  private chronoRepository;

  constructor() {
    this.chronoRepository = AppDataSource.getRepository(Chrono);
  }

  async createChrono(chrono: Chrono): Promise<void> {
    await this.chronoRepository.save(chrono);
  }

  async getChrono(id: string): Promise<Chrono | null> {
    return await this.chronoRepository.findOneBy({ id });
  }

  async updateChronoStatus(id: string, status: ChronoStatus): Promise<void> {
    const chrono = await this.getChrono(id);
    if (!chrono) return;

    const now = new Date().toISOString();
    let duration = chrono.duration;
    let startTime = chrono.startTime;

    if (status === ChronoStatus.RUNNING) {
      startTime = now;
    } else if (chrono.status === ChronoStatus.RUNNING) {
      // If we're stopping or pausing a running chrono, calculate the final duration
      const start = new Date(chrono.startTime!).getTime();
      const end = new Date().getTime();
      duration += end - start;
      startTime = null;
    }

    await this.chronoRepository.update(id, {
      status,
      duration,
      startTime,
      updatedAt: now,
    });
  }

  async getAllChronos(): Promise<Chrono[]> {
    return await this.chronoRepository.find();
  }

  async setChronoDuration(id: string, duration: number): Promise<void> {
    await this.chronoRepository.update(id, {
      status: ChronoStatus.PAUSED,
      duration,
    });
  }

  async clearChronos(origin: string): Promise<void> {
    await this.chronoRepository.delete({
      origin,
    });
  }
}
