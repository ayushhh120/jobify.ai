import ResumeForm from '../components/ResumeForm'
import PreviewResume from '../components/PreviewResume'
import { useState } from "react";
import ReactToPrint from "react-to-print";
import { useRef } from "react";


const Dashboard = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    jobTitle: "",
    summary: "",
    skill: [],
    experience: [],
    
    education: [],
    projects: "",
    socialLinks: [],
  });
const resumeRef = useRef();
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-700 p-4 gap-4">
      {/* Left: Form */}
      <div className="w-1/2 overflow-y-scroll bg-gray-900 rounded-xl shadow-xl p-5">
        <ResumeForm formData={formData} setFormData={setFormData} />
      </div>

      {/* Right: Live Preview */}
      <div className="w-1/2 overflow-y-scroll bg-white rounded-xl shadow-lg p-6">
        <PreviewResume  ref={resumeRef} data={formData} />
      </div>
    </div>
  );
};

export default Dashboard;
