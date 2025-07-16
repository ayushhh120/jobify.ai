// summaryController.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const generateSummary = async (req, res) => {
  try {
    const { jobTitle, skills } = req.body;

   
const skillsString = Array.isArray(skills) ? skills.join(", ") : skills;

if (!jobTitle || !skillsString || jobTitle.trim() === "" || skillsString.trim() === "") {
  return res.status(400).json({
    error: "Please fill Job Title and Skills before generating summary."
  });
}


    
    const prompt = `Generate a 4-5 line professional resume summary for a candidate applying for the position of "${jobTitle}". The candidate has the following key skills: ${skillsString}, ensure that summary should be in bullet points and ATS friendly and do not use Here's a 4-5 line professional resume summary for a candidate applying for the position of these kindof lines strictly avoid them just pure summary.`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "anthropic/claude-3-haiku",
        messages: [
          { role: "system", content: "You are an expert resume summarizer." },
          { role: "user", content: prompt }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:5173/" ,
          "Content-Type": "application/json"
        }
      }
    );

    const summary = response.data.choices[0].message.content;
    res.json({ summary });

  }  catch (error) {
  console.error("OpenRouter API Error:", error?.response?.data || error.message || error);
  res.status(500).json({ error: "Summary generation failed" });
}

};
