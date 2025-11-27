import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Job from "@/models/Job";
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

// --------- GET (already done) ---------
export async function GET(req: NextRequest) {
  await connectDB();

  const { searchTerm, location, company, role, skills } =
    Object.fromEntries(req.nextUrl.searchParams);

  const query: any = {};

  if (searchTerm) {
    query.$or = [
      { role: { $regex: searchTerm, $options: "i" } },
      { company: { $regex: searchTerm, $options: "i" } },
      { skills: { $in: [new RegExp(searchTerm, "i")] } },
    ];
  }

  if (location) query.location = { $regex: location, $options: "i" };
  if (company) query.company = company;
  if (role) query.role = role;
  if (skills) query.skills = { $in: [skills] };

  const jobs = await Job.find(query).sort({ createdAt: -1 });

  return NextResponse.json(jobs);
}

// --------- POST (create a new job) ---------
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = (await req.json()) as JobType;

    // Ensure required fields exist
    if (!body.id || !body.role || !body.company) {
      return NextResponse.json(
        { error: "Missing required fields: id, role, company" },
        { status: 400 }
      );
    }

    const newJob = await Job.create(body);

    return NextResponse.json(
      { message: "Job created successfully", job: newJob },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/jobs error:", error);

    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
