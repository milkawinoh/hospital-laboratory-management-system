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
      const validatedData = testSchema.parse(body); // Validate input
  
      const newTest = await prisma.diagnosticTest.create({
        data: validatedData,
      });
  
      return NextResponse.json(newTest, { status: 201 });
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof z.ZodError ? error.errors : "Failed to create test" },
        { status: 400 }
      );
    }
  }
  