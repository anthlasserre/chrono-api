import * as Ably from "ably";
import { Chrono } from "../types/chrono";

export class AblyService {
  private client: Ably.Realtime;
  private channel: Ably.RealtimeChannel;

  constructor() {
    if (!process.env.ABLY_API_KEY) {
      throw new Error("ABLY_API_KEY environment variable is not set");
    }

    this.client = new Ably.Realtime(process.env.ABLY_API_KEY);
    this.channel = this.client.channels.get("chrono-updates");
  }

  async publishChronoUpdate(chrono: Chrono): Promise<void> {
    try {
      await this.channel.publish(`chrono|${chrono.id}`, {
        id: chrono.id,
        status: chrono.status,
        duration: chrono.getCurrentDuration(),
        updatedAt: chrono.updatedAt,
        origin: chrono.origin,
        startTime: chrono.startTime,
      });
    } catch (error) {
      console.error("Error publishing chrono update:", error);
    }
  }

  async close(): Promise<void> {
    await this.client.close();
  }
}
