import "dotenv/config";

import app from "./src/app";
import connectDB from "./src/config/db";
import { closeExpiredSessions } from "./src/services/emergencySessionService";

const PORT = process.env.PORT || 5001;
const SESSION_SWEEP_INTERVAL_MS = 60 * 1000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });

  setInterval(() => {
    closeExpiredSessions().catch((error) => {
      console.error("Failed to close expired emergency sessions.");
      console.error(error);
    });
  }, SESSION_SWEEP_INTERVAL_MS);
};

startServer();
