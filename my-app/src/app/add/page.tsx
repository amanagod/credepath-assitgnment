"use client";

import React, { useState } from "react";

const filterOptions = {
  Company: ["CredePath Tech", "DataFlow Systems", "WebCrafters LLC", "CloudWorks"],
  Jobs: ["Frontend Engineer", "Backend Developer", "Full Stack Developer", "DevOps Engineer"],
  Skills: ["React", "Node.js", "TypeScript", "AWS", "Docker"],
  Location: ["New Delhi", "Bengaluru", "Remote", "Hyderabad"],
  Salary: ["< 15 LPA", "15-25 LPA", "> 25 LPA"],
};

const JobForm: React.FC = () => {
  const [job, setJob] = useState<any>({
    id: Date.now(),
    role: "",
    company: "",
    experience: "",
    location: "",
    salary: "",
    skills: [] as string[],
    description: { responsibilities: "", requirements: "", niceToHave: "" },
    aboutCompany: "",
    postedDaysAgo: 0,
    applicants: 0,
  });

  const [message, setMessage] = useState("");

  const handleChange = (field: keyof any, value: any) => {
    setJob((prev) => ({ ...prev, [field]: value }));
  };

  const handleDescriptionChange = (field: keyof any["description"], value: string) => {
    setJob((prev) => ({ ...prev, description: { ...prev.description, [field]: value } }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create job");

      setMessage("Job created successfully!");
      // Reset form
      setJob({
        id: Date.now(),
        role: "",
        company: "",
        experience: "",
        location: "",
        salary: "",
        skills: [],
        description: { responsibilities: "", requirements: "", niceToHave: "" },
        aboutCompany: "",
        postedDaysAgo: 0,
        applicants: 0,
      });
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-bold">Create Job</h2>

      {/* Dropdown: Company */}
      <select
        value={job.company}
        onChange={(e) => handleChange("company", e.target.value)}
        className="w-full border px-3 py-2 rounded"
        required
      >
        <option value="">Select Company</option>
        {filterOptions.Company.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {/* Dropdown: Role */}
      <select
        value={job.role}
        onChange={(e) => handleChange("role", e.target.value)}
        className="w-full border px-3 py-2 rounded"
        required
      >
        <option value="">Select Role</option>
        {filterOptions.Jobs.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>

      {/* Input: Experience */}
      <input
        type="text"
        placeholder="Experience"
        value={job.experience}
        onChange={(e) => handleChange("experience", e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      {/* Dropdown: Location */}
      <select
        value={job.location}
        onChange={(e) => handleChange("location", e.target.value)}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="">Select Location</option>
        {filterOptions.Location.map((l) => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>

      {/* Dropdown: Salary */}
      <select
        value={job.salary}
        onChange={(e) => handleChange("salary", e.target.value)}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="">Select Salary</option>
        {filterOptions.Salary.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Multi-select for Skills */}
      <select
        multiple
        value={job.skills}
        onChange={(e) =>
          handleChange(
            "skills",
            Array.from(e.target.selectedOptions, (option) => option.value)
          )
        }
        className="w-full border px-3 py-2 rounded h-24"
      >
        {filterOptions.Skills.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Textareas */}
      <textarea
        placeholder="Responsibilities"
        value={job.description.responsibilities}
        onChange={(e) => handleDescriptionChange("responsibilities", e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      <textarea
        placeholder="Requirements"
        value={job.description.requirements}
        onChange={(e) => handleDescriptionChange("requirements", e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      <textarea
        placeholder="About Company"
        value={job.aboutCompany}
        onChange={(e) => handleChange("aboutCompany", e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Create Job
      </button>

      {message && <p className="text-green-600">{message}</p>}
    </form>
  );
};

export default JobForm;
