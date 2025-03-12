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
  

  export async function GET(req: Request, context: { params: { id: string } }) {
    try {
      const { id } = await context.params; // ✅ Await the params
  
      if (!id || isNaN(Number(id))) {
        return NextResponse.json({ error: "Invalid test ID" }, { status: 400 });
      }
  
      const test = await prisma.diagnosticTest.findUnique({
        where: { id: Number(id) },
      });
  
      if (!test) {
        return NextResponse.json({ error: "Test not found" }, { status: 404 });
      }
  
      return NextResponse.json(test);
    } catch (error) {
      return NextResponse.json({ error: "Failed to fetch test" }, { status: 500 });
    }
  }