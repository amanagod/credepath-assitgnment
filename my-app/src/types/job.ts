// types/job.ts

export interface Job {
  id: number;
  role: string;
  company: string;
  experience: string; // e.g., '2-4 yrs'
  location: string; // e.g., 'Delhi'
  salary: string; // e.g., 'INR 12-18 LPA'
  skills: string[]; // e.g., ['React', 'Node', 'TypeScript']
  description: {
    heading1: string;
    heading2: string;
    heading3: string;
  };
  aboutCompany: string;
  postedDaysAgo: number;
  applicants: number;
}

