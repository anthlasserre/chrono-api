import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Chrono, ChronoStatus } from "../types/chrono";
import { DatabaseService } from "../services/database";
import { AblyService } from "../services/ably";
import { formatDuration } from "../utils/date";

export class ChronoController {
  private db: DatabaseService;
  private ably: AblyService;

  constructor() {
    this.db = new DatabaseService();
    this.ably = new AblyService();
  }

  private async publishUpdate(chrono: Chrono) {
    await this.ably.publishChronoUpdate(chrono);
  }

  async createChrono(req: Request, res: Response) {
    try {
      const { origin } = req.body;
      const now = new Date().toISOString();

      const chrono: Chrono = {
        id: uuidv4(),
        origin,
        status: ChronoStatus.RUNNING,
        duration: 0,
        startTime: now,
        createdAt: now,
        updatedAt: now,
        getCurrentDuration: () => {
          return 0;
        },
      };

      await this.db.createChrono(chrono);

      const currentDurationMs = chrono.getCurrentDuration();
      const response = {
        ...chrono,
        currentDurationMs,
        currentDurationFormatted: formatDuration(currentDurationMs),
      };
      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({ error: "Failed to create chrono" });
    }
  }

  async startChrono(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const chrono = await this.db.getChrono(id);

      if (!chrono) {
        return res.status(404).json({ error: "Chrono not found" });
      }

      if (chrono.status === ChronoStatus.RUNNING) {
        return res.status(400).json({ error: "Chrono is already running" });
      }

      await this.db.updateChronoStatus(id, ChronoStatus.RUNNING);
      const updatedChrono = await this.db.getChrono(id);
      if (updatedChrono) {
        await this.publishUpdate(updatedChrono);
      }
      res.json(updatedChrono);
    } catch (error) {
      res.status(500).json({ error: "Failed to start chrono" });
    }
  }

  async pauseChrono(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const chrono = await this.db.getChrono(id);

      if (!chrono) {
        return res.status(404).json({ error: "Chrono not found" });
      }

      if (chrono.status !== ChronoStatus.RUNNING) {
        return res.status(400).json({ error: "Chrono is not running" });
      }

      await this.db.updateChronoStatus(id, ChronoStatus.PAUSED);
      const updatedChrono = await this.db.getChrono(id);
      if (updatedChrono) {
        await this.publishUpdate(updatedChrono);
      }
      res.json(updatedChrono);
    } catch (error) {
      res.status(500).json({ error: "Failed to pause chrono" });
    }
  }

  async stopChrono(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const chrono = await this.db.getChrono(id);

      if (!chrono) {
        return res.status(404).json({ error: "Chrono not found" });
      }

      if (chrono.status === ChronoStatus.STOPPED) {
        return res.status(400).json({ error: "Chrono is already stopped" });
      }

      await this.db.updateChronoStatus(id, ChronoStatus.STOPPED);
      const updatedChrono = await this.db.getChrono(id);
      if (updatedChrono) {
        await this.publishUpdate(updatedChrono);
      }
      res.json(updatedChrono);
    } catch (error) {
      res.status(500).json({ error: "Failed to stop chrono" });
    }
  }

  async getChrono(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const chrono = await this.db.getChrono(id);

      if (!chrono) {
        return res.status(404).json({ error: "Chrono not found" });
      }

      // Calculate current duration if the chrono is running
      const currentDurationMs = chrono.getCurrentDuration();
      const response = {
        ...chrono,
        currentDurationMs,
        currentDurationFormatted: formatDuration(currentDurationMs),
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({ error: "Failed to get chrono" });
    }
  }

  async getAllChronos(req: Request, res: Response) {
    try {
      const chronos = await this.db.getAllChronos();
      // Calculate current duration for all running chronos
      const response = chronos.map((chrono) => {
        const currentDurationMs = chrono.getCurrentDuration();
        return {
          ...chrono,
          currentDurationMs,
          currentDurationFormatted: formatDuration(currentDurationMs),
        };
      });
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: "Failed to get chronos" });
    }
  }

  async setChronoDuration(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { duration } = req.body;
      const chrono = await this.db.getChrono(id);

      if (!chrono) {
        return res.status(404).json({ error: "Chrono not found" });
      }

      await this.db.setChronoDuration(id, duration);
      const updatedChrono = await this.db.getChrono(id);
      if (updatedChrono) {
        await this.publishUpdate(updatedChrono);
      }
      res.json(updatedChrono);
    } catch (error) {
      res.status(500).json({ error: "Failed to set chrono" });
    }
  }

  async clearChronos(req: Request, res: Response) {
    try {
      const { origin } = req.body;
      await this.db.clearChronos(origin);
      res.json({ message: "Chronos cleared" });
    } catch (error) {
      res.status(500).json({ error: "Failed to clear chronos" });
    }
  }
}
