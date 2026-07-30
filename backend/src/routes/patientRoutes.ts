import express, { Request, Response } from "express";
const router = express.Router();

let controller: unknown;

try {
  controller = require("../controllers/patientController");
  console.log("Controller loaded successfully");
  console.log(controller);
} catch (error) {
  console.error("Controller import failed:");
  console.error(error);
}

router.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Routes are working."
  });
});

export default router;
