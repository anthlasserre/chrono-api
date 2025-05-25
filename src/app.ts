import "reflect-metadata";
import express from "express";
import { ChronoController } from "./controllers/chronoController";
import { AppDataSource } from "./config/database";
import { apiKeyAuth } from "./middleware/apiKeyAuth";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
// Apply API key authentication to all routes
app.use(apiKeyAuth);

// Initialize TypeORM
AppDataSource.initialize()
  .then(() => {
    console.log("Database connection initialized");

    const chronoController = new ChronoController();

    // Routes
    app.post("/chronos", (req, res) => chronoController.createChrono(req, res));
    app.get("/chronos", (req, res) => chronoController.getAllChronos(req, res));
    app.get("/chronos/:id", (req, res) => chronoController.getChrono(req, res));
    app.post("/chronos/:id/start", (req, res) =>
      chronoController.startChrono(req, res)
    );
    app.post("/chronos/:id/pause", (req, res) =>
      chronoController.pauseChrono(req, res)
    );
    app.post("/chronos/:id/stop", (req, res) =>
      chronoController.stopChrono(req, res)
    );
    app.put("/chronos/:id", (req, res) =>
      chronoController.setChronoDuration(req, res)
    );
    app.delete("/chronos", (req, res) =>
      chronoController.clearChronos(req, res)
    );

    app.get("/", (req, res) =>
      res.json({ message: "Welcome to the Chrono API" })
    );

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => console.log("TypeORM connection error: ", error));
