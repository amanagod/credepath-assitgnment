"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import JobSearchBar, { SearchFormData } from "./Searchbar";

/** Job type */
interface Job {
  id: number;
  role: string;
  company: string;
  experience: string;
  location: string;
  salary: string;
  skills: string[];
  description: Record<string, string>;
  aboutCompany: string;
  postedDaysAgo: number;
  applicants: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/** filter options */
const filterOptions = {
  Company: ["CredePath Tech", "DataFlow Systems", "WebCrafters LLC", "CloudWorks"],
  Jobs: ["Frontend Engineer", "Backend Developer", "Full Stack Developer", "DevOps Engineer"],
  Skills: ["React", "Node.js", "TypeScript", "AWS", "Docker"],
  Location: ["New Delhi", "Bengaluru", "Remote", "Hyderabad"],
  Salary: ["< 15 LPA", "15-25 LPA", "> 25 LPA"],
};

type Filters = {
  Company: string;
  Jobs: string;
  Skills: string;
  Location: string;
  Salary: string;
};

const JobBoard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeTab, setActiveTab] = useState<"Recommended" | "Applied" | "Saved">("Recommended");
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [filters, setFilters] = useState<Filters>({
    Company: "",
    Jobs: "",
    Skills: "",
    Location: "",
    Salary: "",
  });

  /** Fetch jobs from backend API */
  const fetchJobs = async (searchData?: SearchFormData) => {
    const params = new URLSearchParams();
    if (searchData?.searchTerm) params.append("searchTerm", searchData.searchTerm);
    if (searchData?.location) params.append("location", searchData.location);

    if (filters.Company) params.append("company", filters.Company);
    if (filters.Jobs) params.append("role", filters.Jobs);
    if (filters.Skills) params.append("skills", filters.Skills);

    try {
      const res = await fetch(`/api?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data: Job[] = await res.json();
      setJobs(data);
      if (data.length > 0) setActiveJob(data[0]);
      else setActiveJob(null);
    } catch (err) {
      console.error(err);
      setJobs([]);
      setActiveJob(null);
    }
  };

  /** Handle filter changes */
  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: prev[key] === value ? "" : value }));
    setActiveJob(null);
  };

  /** Handle tab change */
  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
  };

  /** Filter jobs locally for tabs & filter consistency */
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (filters.Company && job.company !== filters.Company) return false;
      if (filters.Jobs && !job.role.toLowerCase().includes(filters.Jobs.toLowerCase())) return false;
      if (filters.Location && job.location !== filters.Location) return false;
      if (filters.Skills && !job.skills.map(s => s.toLowerCase()).includes(filters.Skills.toLowerCase())) return false;
      return true;
    });
  }, [jobs, filters, activeTab]);

  /** Ensure an active job is always selected */
  useEffect(() => {
    if (!activeJob && filteredJobs.length > 0) {
      setActiveJob(filteredJobs[0]);
    }
    if (filteredJobs.length === 0) {
      setActiveJob(null);
    }
  }, [filteredJobs, activeJob]);

  /** Fetch all jobs initially */
  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <JobSearchBar onSearch={(data) => fetchJobs(data)} />

      <JobFilterBar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        filters={filters}
        setFilter={handleFilterChange}
        filterOptions={filterOptions}
      />

      <div className="flex mt-6 space-x-6">
        <div className="w-1/3 space-y-4 max-h-[80vh] overflow-y-auto pr-2">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isActive={activeJob?.id === job.id}
                onClick={() => setActiveJob(job)}
              />
            ))
          ) : (
            <p className="text-gray-500">No jobs match your current filters.</p>
          )}
        </div>

        <div className="w-2/3">
          {activeJob ? (
            <JobDetails job={activeJob} />
          ) : (
            <div className="p-8 border border-gray-200 rounded-lg h-full flex items-center justify-center text-gray-500">
              Select a job card to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobBoard;

/* -------------------- FilterDropdown -------------------- */
const FilterDropdown: React.FC<{
  name: keyof Filters;
  options: string[];
  selected: string;
  onSelect: (name: keyof Filters, value: string) => void;
}> = ({ name, options, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{selected || name}</span>
        <ChevronDownIcon className="-mr-1 ml-2 h-4 w-4" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1 max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option}
                className={`w-full text-left block px-4 py-2 text-sm ${
                  selected === option ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => {
                  onSelect(name, option);
                  setIsOpen(false);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* -------------------- JobFilterBar -------------------- */
interface JobFilterBarProps {
  activeTab: "Recommended" | "Applied" | "Saved";
  setActiveTab: (tab: "Recommended" | "Applied" | "Saved") => void;
  filters: Filters;
  setFilter: (key: keyof Filters, value: string) => void;
  filterOptions: typeof filterOptions;
}

const JobFilterBar: React.FC<JobFilterBarProps> = ({
  activeTab,
  setActiveTab,
  filters,
  setFilter,
  filterOptions,
}) => {
  const tabs: ("Recommended" | "Applied" | "Saved")[] = ["Recommended", "Applied", "Saved"];

  return (
    <div className="border-b border-gray-200 pb-3">
      <div className="flex items-center justify-between">
        <div className="flex space-x-6 text-lg font-medium">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 transition duration-150 ease-in-out ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-600">Sort by:</div>
          <div className="text-sm">
            <button className="px-3 py-2 bg-white border rounded-md text-gray-700 text-sm hover:bg-gray-50">
              Most recent
            </button>
          </div>
        </div>
      </div>

      <div className="flex space-x-3 mt-4 items-center">
        {Object.keys(filterOptions).map((key) => {
          const filterKey = key as keyof Filters;
          return (
            <FilterDropdown
              key={key}
              name={filterKey}
              options={filterOptions[filterKey as keyof typeof filterOptions]}
              selected={filters[filterKey]}
              onSelect={setFilter}
            />
          );
        })}
        <button className="text-gray-500 hover:text-gray-700 text-sm flex items-center px-3 py-2 border rounded-md">
          All Filters
          <ChevronDownIcon className="ml-1 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

/* -------------------- JobCard -------------------- */
interface JobCardProps {
  job: Job;
  isActive: boolean;
  onClick: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, isActive, onClick }) => {
  const initials = job.company
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      role="button"
      onClick={onClick}
      className={`p-4 border rounded-lg cursor-pointer transition duration-150 ease-in-out ${
        isActive ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200 hover:border-gray-300 bg-white"
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{job.role}</h3>
          <p className="text-sm text-gray-600">{job.company} · {job.location}</p>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-600">{job.experience}</div>
          <div className="text-sm text-gray-700 font-semibold mt-2">{job.salary}</div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-gray-700">
            {initials}
          </div>

          <div className="flex space-x-2">
            {job.skills.slice(0, 3).map((s, i) => (
              <span key={i} className="px-2 py-0.5 bg-gray-100 text-xs rounded-full text-gray-700">
                {s}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-100 text-xs rounded-full text-gray-700">+{job.skills.length - 3}</span>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-500">
          <div>{job.applicants} applicants</div>
          <div className="mt-1">Posted {job.postedDaysAgo}d</div>
        </div>
      </div>

      <div className="mt-3">
        <button className="text-blue-600 text-sm hover:underline">View similar jobs</button>
      </div>
    </div>
  );
};

/* -------------------- JobDetails -------------------- */
const JobDetails: React.FC<{ job: Job }> = ({ job }) => {
  const initials = job.company
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="border border-gray-200 rounded-lg shadow-md p-6 bg-white max-h-[80vh] overflow-y-auto">
      <div className="flex items-center space-x-4 border-b pb-4 mb-4">
        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-800 text-lg">
          {initials}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{job.company}</h2>
          <h3 className="text-lg font-semibold text-gray-700">{job.role}</h3>
          <div className="text-sm text-gray-600 mt-1">{job.location} • {job.experience}</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <div>Posted {job.postedDaysAgo} days ago</div>
        <div>{job.applicants} applicants</div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills.map((skill, i) => (
          <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
            {skill}
          </span>
        ))}
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-bold text-gray-800 mb-2">Job Summary</h4>
        <p className="text-sm text-gray-600 leading-relaxed">
          {job.description.responsibilities}
        </p>
      </div>

      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-800 mb-2">Requirements</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{job.description.requirements}</p>
      </div>

      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-800 mb-2">About Company</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{job.aboutCompany}</p>
      </div>

      <div className="flex space-x-3 mb-4">
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">
          Apply Now
        </button>
        <button className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700">
          Save
        </button>
        <button className="border border-gray-300 px-3 py-2 rounded-lg text-gray-700">
          Share
        </button>
      </div>

      <div className="text-center">
        <button className="text-blue-600 underline text-sm">View similar jobs</button>
      </div>
    </div>
  );
};
