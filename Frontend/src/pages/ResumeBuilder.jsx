
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import ResumeForm from '@/components/ResumeForm';
import { useNavigate } from 'react-router-dom';

const ResumeBuilder = () => {

  const printRef = useRef();

const [downloading, setDownloading] = useState(false);




  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    jobTitle: '',
    location: '',
    skill: [],
    summary: '',
    experience: [],
    education: [],
    projects: '',
    socialLinks: []
  });

  const navigate = useNavigate()

  const handleHome = ()=>{
    navigate('/')
  }

  
  return (
    <div className="min-h-screen w-full gradient-hero p-5 sm:p-5 overflow-x-hidden">
      <div className='homeButton flex ml-[1%] items-center h-auto animate-fade-in'>
                              <Button
                                onClick={handleHome}
                                className="card-glow bg-gradient-to-r from-indigo-400 
                                h-9 to-blue-800 hover:scale-105 
                                gradient-button transition-smooth border-0 font-bold text-gray-200 w-10 shadow-xl cursor-pointer"
                                size="lg"
                              >
                              <i className="ri-home-line"></i>
                              </Button>
                              </div>
      <div className="w-full mx-auto">
        <div className="text-center w-full mb-8 animate-fade-in">
          
          <h1 className="text-4xl font-bold text-gray-200 mb-2">
            📄 AI Resume Builder
          </h1>
          <p className="text-gray-400">
            Create your professional resume with AI assistance
          </p>
        </div>

        <div className="resumeBuilder grid grid-cols-2 sm:grid-cols-1 gap-8 w-full max-w-[1300px] mx-auto">
          <div className='w-full'>
          <ResumeForm formData={formData} setFormData={setFormData} printRef={printRef} downloading={downloading} />
          </div>
  
          <div className="glassmorphic h-fit card-glow animate-fade-in rounded-3xl">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-300 mb-4">📋 Resume Preview</h2>
              
              <div ref={printRef} className="print-area bg-white text-black rounded-xl p-6 min-h-[600px] border border-white/10">
                {/* Resume Preview Content (same as yours) */}
                <div className="space-y-4">
                  {formData.name && (
                    <div className="text-center border-b border-gray-700 pb-4">
                      <h1 className="text-2xl font-bold">{formData.name}</h1>
                      {formData.jobTitle && <p className="text-medium mb-2 text-gray-800">{formData.jobTitle}</p>}
                      <div className="flex justify-center gap-4 text-sm text-gray-600 mt-2">
                        {formData.email && <span>{formData.email}</span>}
                        {formData.phone && <span>{formData.phone}</span>}
                        {formData.location && <span>{formData.location}</span>}
                        {formData.socialLinks?.length > 0 && (
                          <div className="flex flex-wrap justify-center text-sm text-gray-600">
                            {formData.socialLinks.map((link, i) => (
                              <span key={i}>
                                {link.platform}:{" "}
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="underline"
                                  style={{ color: "#1a0dab" }}
                                >
                                  {link.url}
                                </a>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {formData.summary && (
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Summary</h2>
                      <div className="text-sm text-muted-foreground space-y-1">
                        {formData.summary
                          .split(/\n|\. /)
                          .filter(line => line.trim() !== "")
                          .map((line, idx) => (
                            <p key={idx}>{line.trim().replace(/\.$/, "")}</p>
                          ))}
                      </div>
                    </div>
                  )}

                  {formData.skill.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Skills</h2>
                      <div className="flex flex-wrap gap-2">
                        {formData.skill.map((skill, index) => (
                          <span key={index} className="bg-gray-200 text-black px-2 py-1 rounded text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}


                  {formData.projects && (
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Projects</h2>
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{formData.projects}</p>
                    </div>
                  )}
                  {formData.experience.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Experience</h2>
                      {formData.experience.map((exp, index) => (
                        <div key={index} className="mb-3">
                          <h3 className="font-medium">{exp.role}</h3>
                          <p className="text-sm text-muted-foreground">{exp.company} • {exp.duration}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {formData.education.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Education</h2>
                      {formData.education.map((edu, index) => (
                        <div key={index} className="mb-2">
                          <h3 className="font-medium">{edu.degree}</h3>
                          <p className="text-sm text-muted-foreground">{edu.institution} • {edu.year}</p>
                        </div>
                      ))}
                    </div>
                  )}

                
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default ResumeBuilder;
