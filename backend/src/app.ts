import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";

import patientRoutes from "./routes/patientRoutes";
import errorHandler from "./middleware/errorHandler";

const app = express();

app.use(cors());

app.use(express.json());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "LifeTag API is running."
  });
});

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: "Healthy"
  });
});

app.use("/api/patients", patientRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found."
  });
});

app.use(errorHandler);

export default app;
