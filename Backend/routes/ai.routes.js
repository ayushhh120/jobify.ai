const express = require("express");
const router = express.Router();
const { generateSummary } = require("../controllers/ai.controller");
const {generateInterviewQuestions} = require('../controllers/ai.controller.js')
const {transcribeAudio} = require('../controllers/ai.controller.js')
const multer = require('multer')
const upload = multer();


router.post("/summary", generateSummary);

router.post("/generate-questions", generateInterviewQuestions);

router.post("/transcribe-audio", upload.single("audio"), transcribeAudio);


module.exports = router;
