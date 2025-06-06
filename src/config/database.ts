import { DataSource } from "typeorm";
import { Chrono } from "../entities/Chrono";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "chrono_db",
  synchronize: true,
  ssl: { rejectUnauthorized: false },
  logging: true,
  entities: [Chrono],
  migrations: [],
  subscribers: [],
});
