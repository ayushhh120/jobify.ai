// summaryController.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import { OpenAI } from "openai";
// Logic for AI generated Resume Summary
export const generateSummary = async (req, res) => {
  try {
    const { jobTitle, skills } = req.body;

    const skillsString = Array.isArray(skills) ? skills.join(", ") : skills;

    if (
      !jobTitle ||
      !skillsString ||
      jobTitle.trim() === "" ||
      skillsString.trim() === ""
    ) {
      return res.status(400).json({
        error: "Please fill Job Title and Skills before generating summary.",
      });
    }

    const prompt = `Generate a 4-5 line professional resume summary for a candidate applying for the position of "${jobTitle}". The candidate has the following key skills: ${skillsString}, ensure that summary should be in bullet points and ATS friendly and do not use Here's a 4-5 line professional resume summary for a candidate applying for the position of these kindof lines strictly avoid them just pure summary.`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "anthropic/claude-3-haiku",
        messages: [
          { role: "system", content: "You are an expert resume summarizer." },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:5173/",
          "Content-Type": "application/json",
        },
      }
    );

    const summary = response.data.choices[0].message.content;
    res.json({ summary });
  } catch (error) {
    console.error(
      "OpenRouter API Error:",
      error?.response?.data || error.message || error
    );
    res.status(500).json({ error: "Summary generation failed" });
  }
};

// Logic for AI question generation


export const generateInterviewQuestions = async (req, res) => {
  try {
    const { jobTitle, skills } = req.body;
    const skillsString = Array.isArray(skills) ? skills.join(", ") : skills;

    if (!jobTitle || !skillsString) {
      return res.status(400).json({
        error: "Please fill Job Title and Skills before generating questions.",
      });
    }

    const prompt = `Generate exactly 5 mock interview questions for a candidate applying for the role of "${jobTitle}". The candidate has the following skills: ${skillsString}. Return only the 5 questions as a numbered list. Do not include any introductory or explanatory text.`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "anthropic/claude-3-haiku",
        messages: [
          { role: "system", content: "You are a helpful interview coach." },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:5173/",
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.choices[0].message.content;

    const questions = content
      .split("\n")
      .map((line) => line.replace(/^\d+\.\s*/, "").trim())
      .filter((q) => q.length > 0);

    res.json({ questions });
  } catch (error) {
    console.error("OpenRouter Question Gen Error:", error?.response?.data || error.message || error);
    res.status(500).json({ error: "Failed to generate interview questions." });
  }
};

export const transcribeAudio = async (req, res) => {
  try {
  
     const audioBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    const response = await axios.post("https://api.deepgram.com/v1/listen", audioBuffer, {
      headers: {
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
        "Content-Type": mimeType,
      },
    });

    const transcript = response.data?.results?.channels?.[0]?.alternatives?.[0]?.transcript;
    res.json({ transcript });
  } catch (error) {
    console.error("Deepgram Error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Transcription failed" });
  }
};