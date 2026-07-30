const express = require("express");
const router = express.Router();

let controller;

try {
  controller = require("../controllers/patientController");
  console.log("Controller loaded successfully");
  console.log(controller);
} catch (error) {
  console.error("Controller import failed:");
  console.error(error);
}

router.get("/", (req, res) => {
  res.json({
    message: "Routes are working."
  });
});

module.exports = router;