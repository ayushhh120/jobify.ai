const express = require("express");
const router = express.Router();
const { generateSummary } = require("../controllers/ai.controller");


console.log("✅ AI Routes file loaded successfully");

router.post("/summary", generateSummary);


module.exports = router;
