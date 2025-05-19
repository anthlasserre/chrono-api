import { DataSource } from "typeorm";
import { Chrono } from "../entities/Chrono";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "chronos.db",
  synchronize: true,
  logging: true,
  entities: [Chrono],
  migrations: [],
  subscribers: [],
});
