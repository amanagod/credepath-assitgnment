import mongoose, { Schema, Model } from "mongoose";
// import { JobType } from "@/types/Job";


export interface JobDescription {
  responsibilities: string;
  requirements: string;
  niceToHave: string;
}

export interface JobType {
  id: number;
  role: string;
  company: string;
  experience: string;
  location: string;
  salary: string;
  skills: string[];
  description: JobDescription;
  aboutCompany: string;
  postedDaysAgo: number;
  applicants: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const JobSchema = new Schema<JobType>(
  {
    id: { type: Number, required: true, unique: true },
    role: { type: String, required: true },
    company: { type: String, required: true },
    experience: String,
    location: String,
    salary: String,
    skills: [String],
    description: {
      responsibilities: String,
      requirements: String,
      niceToHave: String,
    },
    aboutCompany: String,
    postedDaysAgo: Number,
    applicants: Number,
  },
  { timestamps: true }
);

const Job: Model<JobType> =
  mongoose.models.Job || mongoose.model<JobType>("Job", JobSchema);

export default Job;
