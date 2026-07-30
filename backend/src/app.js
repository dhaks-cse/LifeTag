const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const patientRoutes = require("./routes/patientRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());

app.use(express.json());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "LifeTag API is running."
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "Healthy"
  });
});

app.use("/api/patients", patientRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found."
  });
});

app.use(errorHandler);

module.exports = app;