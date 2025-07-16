import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from 'axios'
import jsPDF from "jspdf";
import html2pdf from 'html2pdf.js';
import { useRef } from "react";

const ResumeForm = ({ formData, setFormData,  }) => {
  const [socialLinks, setSocialLinks] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [currentPlatform, setCurrentPlatform] = useState("");
  const [currentLink, setCurrentLink] = useState("");
  const [summary, setSummary] = useState("");
  const [currentSkill, setCurrentSkill] = useState("");

  const [currentRole, setCurrentRole] = useState("");
  const [currentCompany, setCurrentCompany] = useState("");
  const [currentDuration, setCurrentDuration] = useState("");
  

  const [currentDegree, setCurrentDegree] = useState("");
  const [currentInstitution, setCurrentInstitution] = useState("");
  const [currentYear, setCurrentYear] = useState("");

  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);



const handleAddLink = () => {
  if (currentPlatform && currentLink) {
    const newLinks = [
      ...formData.socialLinks,
      { platform: currentPlatform, url: currentLink },
    ];

    setFormData({ ...formData, socialLinks: newLinks });

    setCurrentPlatform("");
    setCurrentLink("");
    setShowInput(false);
  }
};

const handleRemove = (idx) => {
  const updatedLinks = [...formData.socialLinks];
  updatedLinks.splice(idx, 1);
  setFormData({ ...formData, socialLinks: updatedLinks });
};


  const handleAddSkill = () => {
    if (currentSkill.trim() === "") return;

    setFormData({
      ...formData,
      skill: [...formData.skill, currentSkill.trim()],
    });
    setCurrentSkill("");
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = [...formData.skill];
    updatedSkills.splice(index, 1);

    setFormData({ ...formData, skill: updatedSkills });
  };

  const handleAddExperience = () => {
    if (!currentRole || !currentCompany || !currentDuration) return;

    const newExp = {
      role: currentRole,
      company: currentCompany,
      duration: currentDuration,
      points: [], // you can add bullet points later
    };

    setFormData({
      ...formData,
      experience: [...formData.experience, newExp],
    });

    setCurrentRole("");
    setCurrentCompany("");
    setCurrentDuration("");
  };

  const handleRemoveExperience = (index) => {
    const updated = [...formData.experience];
    updated.splice(index, 1);
    setFormData({ ...formData, experience: updated });
  };

  const handleAddEducation = () => {
    if (!currentDegree || !currentInstitution || !currentYear) return;

    const newEdu = {
      degree: currentDegree,
      institution: currentInstitution,
      year: currentYear,
    };

    setFormData({
      ...formData,
      education: [...formData.education, newEdu],
    });

    setCurrentDegree("");
    setCurrentInstitution("");
    setCurrentYear("");
  };

  const handleRemoveEducation = (index) => {
    const updated = [...formData.education];
    updated.splice(index, 1);
    setFormData({ ...formData, education: updated });
  };


  const skillSuggestions = [
  // Programming Languages
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C", "C#", "Go", "Rust", "Ruby", "PHP", "Swift", "Kotlin", "R", "Scala", "assembly",

  // Web Development
  "HTML", "CSS", "Tailwind", "Bootstrap", "React", "Next.js", "Angular", "Vue.js", "Svelte", 
  "Node.js", "Express", "Django", "Flask", "Spring Boot", "ASP.NET", "FastAPI",

  // Database & Backend
  "MongoDB", "MySQL", "PostgreSQL", "Firebase", "Redis", "GraphQL", "Supabase", "SQLite",

  // DevOps / Cloud
  "Docker", "Kubernetes", "Git", "GitHub Actions", "CI/CD", "AWS", "Azure", "Google Cloud", "Heroku", "Netlify", "Vercel",

  // AI / ML / Data Science
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Scikit-Learn", "Pandas", "NumPy", "OpenCV", "Matplotlib", "NLP", "Computer Vision", "Data Analysis", "Data Visualization", "Jupyter", "Hugging Face", "LLMs",

  // Cybersecurity
  "Network Security", "Penetration Testing", "Ethical Hacking", "Kali Linux", "Wireshark", "Burp Suite", "OWASP", "Information Security", "Cryptography",

  // Business / Soft Skills / PM
  "Agile", "Scrum", "Product Management", "Business Analysis", "Excel", "Power BI", "Tableau", "Project Management", "Communication", "Leadership", "Time Management",

  // Data Engineering
  "ETL", "Apache Kafka", "Apache Spark", "Airflow", "Hadoop", "BigQuery", "Snowflake", "Data Warehousing", "Data Pipelines",

  // Other Tools & Tech
  "Figma", "Jira", "Notion", "Postman", "REST API", "GraphQL", "Linux", "Shell Scripting", "Trello", "Slack", "Networking", "Operating system", "Canva", "Photoshop", "UI/UX Designing"
];


const [filteredSkills, setFilteredSkills] = useState([]);

const handleSkillInput = (e) => {
  const value = e.target.value;
  setCurrentSkill(value);

  if (value.trim() === "") {
    setFilteredSkills([]);
    return;
  }

  const filtered = skillSuggestions.filter((skill) =>
    skill.toLowerCase().includes(value.toLowerCase())
  );
  setFilteredSkills(filtered);
};

const generateSummary = async () => {
  if (!formData.jobTitle || !formData.skill.length) {
    alert("Please enter your job title and skills before generating summary.");
    return;
  }

   setLoading(true); 

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/ai/summary`,
      {
        jobTitle: formData.jobTitle,
        skills: formData.skill.join(", "), 
      }
    );

    setFormData({ ...formData, summary: response.data.summary });
  } catch (err) {
    console.error("AI Summary generation failed:", err);
    const errorMsg = err?.response?.data?.error || "Something went wrong while generating summary";
    alert(errorMsg);
  } finally {
    setLoading(false); 
  }
};



const handleDownloadPDF = () => {
  setDownloading(true);

  const element = document.getElementById('resume-preview');
  if (!element) {
    alert('Resume preview not found!');
    return;
  }


  element.querySelectorAll("*").forEach((el) => {
    const computedColor = getComputedStyle(el).color;
    if (computedColor.includes("oklch")) {
      el.style.color = "#000"; 
    }

    const bgColor = getComputedStyle(el).backgroundColor;
    if (bgColor.includes("oklch")) {
      el.style.backgroundColor = "#fff"; 
    }
  });

  const opt = {
    margin: 0.3,
    filename: 'resume.pdf',
    image: { type: 'jpeg', quality: 2 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save().then(() => {
    setDownloading(false);
  }).catch((err) => {
    console.error("PDF download failed", err);
    setDownloading(false);
  });
};



  return (
    <div className="h-screen">
      <div className="rounded-[18px] text-gray-200 placeholder:text-black mt-5 ml-2 w-125">
        <h2 className="flex ml-2 mb-3 text-[20px] font-semibold">
          Enter your personal details
        </h2>
        <h3 className="text-lg font-medium ml-3 mt-8">Enter your Fullname</h3>

        <input
          className="bg-[#eeeeee2d] w-100 h-10 px-1 py-1 mb-2 mt-2 ml-2 rounded-lg pl-3 text-[14px] placeholder:text-[12px] focus:outline-none focus:ring-2 focus:ring-[#43b3c7]"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Fullname"
        />

        <div className="flex items-center gap-1 mt-2">
          <h3 className="text-sm font-medium mr-1 ml-3 mt-2">Email:</h3>
          <input
            className="bg-[#eeeeee2d] w-35 h-10 mt-2 rounded-lg pl-3 pr-2 text-[14px] placeholder:text-[12px] focus:outline-none focus:ring-2 focus:ring-[#43b3c7]"
            type="text"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Email"
          />

          <h3 className="text-sm font-medium ml-3 mt-2">Phone:</h3>
          <input
            className="bg-[#eeeeee2d] w-35 h-10 ml-1 mt- rounded-lg pl-3 text-[14px] placeholder:text-[12px] focus:outline-none focus:ring-2 focus:ring-[#43b3c7]"
            type="text"
            required
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="Phone"
          />
        </div>

<h3 className="text-lg font-medium ml-3 mt-6">Job Title</h3>
        <input
          className="bg-[#eeeeee2d] w-100 h-10 px-1 py-1 ml-2 mt-2 rounded-lg pl-3 text-[14px] placeholder:text-[12px] focus:outline-none focus:ring-2 focus:ring-[#43b3c7]"
          type="text"
          required
          value={formData.jobTitle}
          onChange={(e) =>
            setFormData({ ...formData, jobTitle: e.target.value })
          }
          placeholder="Enter Job Title"
        />

        <h3 className="text-lg font-medium ml-3 mt-6">Location</h3>
        <input
          className="bg-[#eeeeee2d] w-100 h-10 px-1 py-1 ml-2 mt-2 rounded-lg pl-3 text-[14px] placeholder:text-[12px] focus:outline-none focus:ring-2 focus:ring-[#43b3c7]"
          type="text"
          required
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          placeholder="Location"
        />

        

         {/* Skills */}
        <h3 className="text-lg font-medium ml-3 mt-6">Skills</h3>

        <div className="ml-2 mt-2">
          <div className="flex relative gap-2 mb-2">
            <input
              type="text"
              placeholder="Enter a skill"
              value={currentSkill}
              onChange={handleSkillInput}
              className="w-64 h-10 px-3 py-1 rounded-lg bg-[#eeeeee2d]  text-sm placeholder:text-[12px]focus:outline-none placeholder:text-[12px] focus:ring-2 focus:ring-[#43b3c7]"
            />
            <button
              onClick={handleAddSkill}
              className="bg-gray-800 text-[#81d1df] px-3 py-1 rounded-xl hover:bg-gray-700 cursor-pointer text-[14px]"
            >
              + Add
            </button>
              
  {/* Suggestion Box */}
             {filteredSkills.length > 0 && (
    <ul className="absolute top-11 w-64 bg-gray-200 z-10 rounded-md shadow-md max-h-40 overflow-auto text-black">
      {filteredSkills.map((skill, idx) => (
        <li
          key={idx}
          onClick={() => {
            setFormData({
              ...formData,
              skill: [...formData.skill, skill],
            });
            setCurrentSkill("");
            setFilteredSkills([]);
          }}
          className="px-3 py-2 cursor-pointer hover:bg-gray-200 text-sm"
        >
          {skill}
        </li>
      ))}
    </ul>
  )}
          </div>

          {/* Display added skills */}
          <div className="flex flex-wrap gap-2">
            {formData.skill.map((sk, index) => (
              <div
                key={index}
                className="flex items-center gap-1 mt-2 bg-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {sk}
                <button
                  onClick={() => handleRemoveSkill(index)}
                  className="text-red-500 hover:text-red-700 cursor-pointer "
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

{/* Summary */}

        <h3 className="text-lg font-medium ml-3 mt-6">Summary</h3>
                <button
    onClick={generateSummary}
    className="text-sm bg-[#1b6679] cursor-pointer hover:bg-[#1b6679af] text-white py-1 px-3 ml-62 rounded-lg"
  >
    ✨ Generate with AI
  </button>
        <div className="relative w-100 h-52 ml-2 mt-2">
          {(loading || formData.summary.length === 0) && (
            <div className="absolute top-1/2 left-1/2 text-[12px] text-gray-500 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center px-6">
               {loading ? (
        <div className="flex items-center gap-2 text-sm">
          <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Generating summary with AI...
        </div>
      ) : (
              <p>Write your summary here or use AI to autogenerate summary</p>
                )}
            </div>
          )}

          <textarea
            value={formData.summary}
            onChange={(e) =>
              setFormData({ ...formData, summary: e.target.value })
            }
            className="bg-[#eeeeee2a] w-full h-full rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#43b3c7] overflow-auto
resize-none text-white"
          />
        </div>

       

        {/* Experiance */}

        <h3 className="text-lg font-medium ml-3 mt-6">
          Experience <span className="text-sm text-gray-500">(optional)</span>
        </h3>

        <div className="ml-2 mt-2">
          <div className="flex flex-col gap-2 mb-2">
            <input
              type="text"
              placeholder="Role (e.g. Frontend Developer)"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              className="w-64 h-10 px-3 py-1 rounded-lg bg-[#eeeeee2d]  text-sm placeholder:text-[12px] focus:outline-none focus:ring-2 focus:ring-[#43b3c7]"
            />
            <input
              type="text"
              placeholder="Company"
              value={currentCompany}
              onChange={(e) => setCurrentCompany(e.target.value)}
              className="w-64 h-10 px-3 py-1 placeholder:text-[12px] rounded-lg bg-[#eeeeee2d]  text-sm focus:outline-none focus:ring-2 focus:ring-[#43b3c7]"
            />
            <input
              type="text"
              placeholder="Duration (e.g. Jan 2022 - Dec 2023)"
              value={currentDuration}
              onChange={(e) => setCurrentDuration(e.target.value)}
              className="w-64 h-10 px-3 py-1 rounded-lg bg-[#eeeeee2d] text-sm placeholder:text-[12px] focus:outline-none focus:ring-2 focus:ring-[#43b3c7]"
            />
            <button
              onClick={handleAddExperience}
              className="bg-gray-800 text-[13px] font-medium text-[#81d1df] px-3 py-1 rounded-xl hover:bg-gray-700 cursor-pointer mt-3 mb-3 h-9 w-fit"
            >
              + Add Experience
            </button>
          </div>

          {/* Display Added Experiences */}
          <div className="flex w-100 flex-col gap-2">
            {formData.experience.map((exp, index) => (
              <div
                key={index}
                className="bg-gray-800 px-4 py-2 rounded-xl flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">
                    {exp.role} @ {exp.company}
                  </p>
                  <p className="text-sm text-gray-600">{exp.duration}</p>
                </div>
                <button
                  onClick={() => handleRemoveExperience(index)}
                  className="text-red-500 cursor-pointer  hover:text-red-700 text-lg"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        
        <h3 className="text-lg font-medium ml-3 mt-6">Education</h3>

        <div className="ml-2 mt-2">
          <div className="flex flex-col gap-2 mb-2">
            <input
              type="text"
              placeholder="Degree (e.g. B.Tech, M.Sc)"
              value={currentDegree}
              onChange={(e) => setCurrentDegree(e.target.value)}
              className="w-64 h-10 px-3 py-1 rounded-lg bg-[#eeeeee2d] text-sm placeholder:text-[12px] focus:outline-none focus:ring-2 focus:ring-[#43b3c7]"
            />
            <input
              type="text"
              placeholder="Institution Name"
              value={currentInstitution}
              onChange={(e) => setCurrentInstitution(e.target.value)}
              className="w-64 h-10 px-3 py-1 rounded-lg bg-[#eeeeee2d] text-sm placeholder:text-[12px] focus:outline-none focus:ring-2 focus:ring-[#43b3c7]"
            />
            <input
              type="text"
              placeholder="Year (e.g. 2024)"
              value={currentYear}
              onChange={(e) => setCurrentYear(e.target.value)}
              className="w-64 h-10 px-3 py-1 rounded-lg bg-[#eeeeee2d] text-sm placeholder:text-[12px] focus:outline-none focus:ring-2 focus:ring-[#43b3c7]"
            />
            <button
              onClick={handleAddEducation}
              className="bg-gray-800 text-[13px] font-medium text-[#81d1df] px-3 py-1 rounded-xl hover:bg-gray-700 cursor-pointer mt-3 mb-3  h-9 w-fit"
            >
              + Add Education
            </button>
          </div>

          {/* Show Added Educations */}
          <div className="flex w-100 flex-col gap-2">
            {formData.education.map((edu, index) => (
              <div
                key={index}
                className="bg-gray-800 px-4 py-2 rounded-md flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">
                    {edu.degree} - {edu.institution}
                  </p>
                  <p className="text-sm text-gray-600">{edu.year}</p>
                </div>
                <button
                  onClick={() => handleRemoveEducation(index)}
                  className="text-red-500  cursor-pointer hover:text-red-700 text-lg"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Project */}

        <h3 className="text-lg font-medium ml-3 mt-6">
          Projects <span className="text-sm text-gray-500">(optional)</span>
        </h3>

        <div className="relative w-100 h-45 ml-2 mt-2">
          {formData.projects.length === 0 && (
            <div className="absolute top-1/2 left-1/2 text-[12px] text-gray-500 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center px-6">
              Explain the projects if you have
            </div>
          )}

          <textarea
            value={formData.projects}
            onChange={(e) =>
              setFormData({ ...formData, projects: e.target.value })
            }
            className="bg-[#eeeeee2a] w-full h-full rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#43b3c7] overflow-auto
resize-none text-gray-200"
          />
        </div>

        {/* Social Links */}

        <h3 className="text-lg font-medium ml-3 mt-6 mb-2">Social Links</h3>

        <div className="ml-3">
          {formData.socialLinks.map((link, idx) => (
            <div key={idx} className="flex items-center mb-2 gap-2 text-sm">
              <span className="bg-gray-800 px-2 py-1 rounded">
                {link.platform}:
              </span>
              <a
                href={link.url}
                target="_blank"
                className="text-blue-600 underline truncate"
              >
                {link.url}
              </a>
              <button onClick={() => handleRemove(idx)} className="text-s ml-2">
                <i className="hover:bg-gray-800 cursor-pointer ri-delete-bin-6-fill"></i>
              </button>
            </div>
          ))}

          {showInput ? (
            <div className="flex items-center gap-2 mt-2">
              <select
                value={currentPlatform}
                onChange={(e) => setCurrentPlatform(e.target.value)}
                className="cursor-pointer bg-gray-800 relative inline-flex items-center justify-center gap-2 rounded-md text-[13px] font-medium ring-offset-background transition-colors
                disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-800 hover:text-[#81d1df] h-9 px-3"
              >
                <option value="">Platform</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="GitHub">GitHub</option>
                <option value="Portfolio">Project</option>
                <option value="Portfolio">Portfolio</option>
                <option value="Twitter">Twitter</option>
              </select>
              <input
                type="url"
                placeholder="Paste URL"
                className="px-2 py-1 border rounded w-56 text-sm"
                value={currentLink}
                onChange={(e) => setCurrentLink(e.target.value)}
              />
              <button
                onClick={handleAddLink}
                className="bg-gray-800 text-[#81d1df]  px-3 py-1 rounded-xl hover:bg-gray-700 cursor-pointer text-[15px]"
              >
                Add
              </button>
              <button onClick={() => setShowInput(false)}>
                {" "}
                <i className="ri-close-line hover:text-red-700 text-red-500 cursor-pointer"></i>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowInput(true)}
              className="text-sm mt-2 cursor-pointer text-blue-600 underline"
            >
              + Add Social Link
            </button>
          )}
        </div>

        <button
        disabled={downloading}

          onClick={handleDownloadPDF}
        className="mt-5 mb-10 ml-55 h-9 w-40 justify-center items-center group cursor-pointer relative inline-flex text-[14px] rounded-2xl bg-gray-700 px-8 py-3 font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-1 hover:shadow-gray-600/30">
          Save as PDF
        </button>
      </div>
    </div>
  );
};

export default ResumeForm;
