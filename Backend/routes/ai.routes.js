const express = require("express");
const router = express.Router();
const { generateSummary, generateInterviewQuestions, transcribeAudio, generateFeedback, generateFinalSummary } = require("../controllers/ai.controller");
const multer = require('multer')
const upload = multer();


router.post("/summary", generateSummary);

router.post("/generate-questions", generateInterviewQuestions);

router.post("/transcribe-audio", upload.single("audio"), transcribeAudio);

router.post("/generate-feedback", generateFeedback)

router.post("/generate-summary", generateFeedback)


module.exports = router;
