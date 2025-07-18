import ReactToPrint from 'react-to-print';
import React, { forwardRef } from "react";

const PreviewResume = forwardRef(({ data }, ref) => {
 
  return (
    
    <div

    ref={ref} 
      id="resume-preview"
      className="text-left text-black font-sans text-sm leading-relaxed bg-white p-4"
      style={{ color: "#000" }} 
    >
      <h1 className="text-2xl font-bold mb-1">{data.name || "Your Name"}</h1>

      <p className="text-base font-medium text-[#1F2937] mb-2">
        {data.jobTitle}
      </p>

      <p className="mb-5 text-sm flex flex-wrap gap-x-2 text-[#374151]">
        {data.email && <span>{data.email}</span>}
        {data.phone && <span>| {data.phone}</span>}
        {data.location && <span>| {data.location}</span>}
        {data.socialLinks?.length > 0 &&
          data.socialLinks.map((link, i) => (
            <span key={i}>
              | {link.platform}:{" "}
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="underline"
                style={{ color: "#1a0dab" }} // safe link color
              >
                {link.url}
              </a>
            </span>
          ))}
      </p>

      {/* Summary */}
      {data.summary && (
        <section className="mb-3">
          <h2 className="font-semibold mb-1 text-base underline">Summary</h2>
          <ul className="p-1 space-y-2">
            {data.summary.split("\n").map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Skills */}
      {data.skill?.length > 0 && (
        <section className="mb-3">
          <h2 className="font-semibold text-base underline">Skills</h2>
          <ul className="skills-list flex flex-wrap gap-2 mt-2">
            {data.skill.map((skill, i) => (
              <li
                key={i}
                className="bg-gray-200 px-2 py-1 flex items-center justify-center rounded"
                style={{ color: "#000" }}
              >
                {skill}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Projects */}
      {data.projects && (
        <section className="mb-3">
          <h2 className="font-semibold mb-1 mt-5 text-base underline">Projects</h2>
          <p className="mb-5">{data.projects}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <section className="mb-4">
          <h2 className="font-semibold mb-1 text-base underline">Experience</h2>
          {data.experience.map((exp, i) => (
            <div key={i}>
              <p className="font-medium">
                {exp.role} {exp.company}
              </p>
              <p className="text-xs mb-5 italic">{exp.duration}</p>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-3">
          <h2 className="font-semibold text-base underline">Education</h2>
          {data.education.map((edu, i) => (
            <div key={i}>
              <p>
                {edu.degree} - {edu.institution}
              </p>
              <p className="text-xs italic">{edu.year}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
});
export default PreviewResume;