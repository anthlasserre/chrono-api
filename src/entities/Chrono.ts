import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ChronoStatus } from "../types/chrono";

@Entity()
export class Chrono {
  @PrimaryColumn()
  id!: string;

  @Column()
  origin!: string;

  @Column({
    type: "simple-enum",
    enum: ChronoStatus,
    default: ChronoStatus.CREATED,
  })
  status!: ChronoStatus;

  @Column("integer", { default: 0 })
  duration!: number;

  @CreateDateColumn({ nullable: true })
  startTime!: string | null;

  @CreateDateColumn()
  createdAt!: string;

  @UpdateDateColumn()
  updatedAt!: string;

  constructor(partial: Partial<Chrono>) {
    Object.assign(this, partial);
  }

  getCurrentDuration(): number {
    if (this.status !== ChronoStatus.RUNNING || !this.startTime) {
      return this.duration;
    }

    const start = new Date(this.startTime).getTime();
    const now = new Date().getTime();
    return this.duration + (now - start);
  }
}
