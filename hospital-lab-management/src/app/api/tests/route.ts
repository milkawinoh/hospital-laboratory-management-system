import { NextResponse } from "next/server";

import { PrismaClient } from '@prisma/client'; // Import Prisma Client

import { z } from "zod"; // Import Zod for validation
const prisma = new PrismaClient(); 

const testSchema = z.object({
    patientName: z.string().min(2, "Patient name must be at least 2 characters."),
    testType: z.string().min(3, "Test type must be at least 3 characters."),
    result: z.string().min(2, "Result must be at least 2 characters."),
    testDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format.",
    }),
    notes: z.string().optional(),
  });
  
  
  export async function POST(req: Request) {
    try {
      const body = await req.json(); // Parse JSON request body
      console.log("Received request body:", body); // ✅ Debugging log
  
      const validatedData = testSchema.parse(body); // Validate input
      console.log("Validated data:", validatedData); // ✅ Debugging log
  
      // ✅ Convert testDate to ISO-8601 format
      const formattedTestDate = new Date(validatedData.testDate).toISOString();
  
      const newTest = await prisma.diagnosticTest.create({
        data: {
          ...validatedData,
          testDate: formattedTestDate, // ✅ Use ISO format
        },
      });
  
      return NextResponse.json(newTest, { status: 201 });
    } catch (error: any) {
      console.error("Error creating test:", error); // ✅ Log full error in console
  
      return NextResponse.json(
        { error: error instanceof z.ZodError ? error.errors : error.message || "Failed to create test" },
        { status: 400 }
      );
    }
  }
  

  export async function GET(req: Request) {
    try {
      // ✅ Extract query parameters from URL
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get("page") || "1", 10); // Default page 1
      const limit = parseInt(searchParams.get("limit") || "5", 10); // Default 5 per page
      const searchQuery = searchParams.get("search") || ""; // Default empty search
  
      // ✅ Calculate pagination offset
      const offset = (page - 1) * limit;
  
      // ✅ Fetch total number of matching records
      const totalRecords = await prisma.diagnosticTest.count({
        where: {
          OR: [
            { patientName: { contains: searchQuery, mode: "insensitive" } },
            { testType: { contains: searchQuery, mode: "insensitive" } },
          ],
        },
      });
  
      // ✅ Fetch filtered test results with pagination
      const tests = await prisma.diagnosticTest.findMany({
        where: {
          OR: [
            { patientName: { contains: searchQuery, mode: "insensitive" } },
            { testType: { contains: searchQuery, mode: "insensitive" } },
          ],
        },
        skip: offset,
        take: limit,
        orderBy: { testDate: "desc" }, // Sort by latest testDate
      });
  
      return NextResponse.json({
        tests,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        currentPage: page,
      });
    } catch (error) {
      console.error("Error fetching test results:", error);
      return NextResponse.json({ error: "Failed to fetch test results" }, { status: 500 });
    }
  }