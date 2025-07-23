
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();


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

    const prompt = `Write only the professional resume summary for a candidate applying for the position of "${jobTitle}". The candidate has the following skills: ${skillsString}. 

Strictly follow these rules:
- Write 4 to 5 bullet points only.
- DO NOT write any introduction like "Here's a summary" or "Below is..."
- DO NOT repeat the job title or skills in the intro.
- DO NOT explain what you are doing.
- Just output pure summary bullet points, one per line.
- Keep it ATS-friendly, concise, and impactful.
- Start each bullet with a •`;

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
          "HTTP-Referer": "https://jobify-ai-lovat.vercel.app/",
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

// Logic for convert recorded audio answers into text
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

// Logic for generating AI feedback according to Answer
export const generateFeedback = async (req, res) => {
  try {
    const { answer } = req.body;

    if (!answer || answer.trim() === "") {
      return res.status(400).json({ error: "Answer is required for feedback." });
    }

    const prompt = `
Act like an AI interview coach. Analyze this answer: "${answer}".
Evaluate it in the following 3 categories:

1. **Confidence** – How confident and clear does the candidate sound?
2. **Clarity** – Is the answer well-structured and easy to understand?
3. **Relevance** – Does it address the interview question directly?

Return a JSON array with this format:

[
  {
    "category": "Confidence",
    "score": 3,
    "maxScore": 5,
    "feedback": "Your voice was steady, but avoid fillers like 'um'.",
    "color": "warning"
  },
  ...
]

Use score between 1 to 5 and color values: success, warning, or destructive.
No extra explanation or formatting – return only valid JSON array.
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "anthropic/claude-3-haiku",
        messages: [
          { role: "system", content: "You are a strict AI interview coach." },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173/",
        },
      }
    );

    const feedback = JSON.parse(response.data.choices[0].message.content);
    res.json({ feedback });
  } catch (error) {
    console.error("Feedback Generation Error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate AI feedback." });
  }
};

// Logic for generating final summary of overall interview 

export const generateFinalSummary = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: "Answers array is required." });
    }

    const combinedAnswers = answers.map((a, i) => `Q${i + 1} Answer: ${a}`).join("\n");

    const prompt = `
You are an AI interview coach. Here's a candidate's response to 5 interview questions:

${combinedAnswers}

Based on this, write a final performance summary. Cover:
- Overall communication style
- Relevance of answers
- Clarity and confidence
- Suggestions for improvement

Keep it short, professional, and in paragraph form (max 5 lines). Do not include "The candidate..." or "Overall..." just provide the summary directly.
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "anthropic/claude-3-haiku",
        messages: [
          { role: "system", content: "You are a professional AI interview evaluator." },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173/",
        },
      }
    );

    const summary = response.data.choices[0].message.content.trim();
    res.json({ summary });
  } catch (error) {
    console.error("Final Summary Gen Error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate final interview summary." });
  }
};
