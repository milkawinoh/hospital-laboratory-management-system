import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod"; // Import Zod for validation

const prisma = new PrismaClient();

// Define Validation Schema (Allow Partial Updates)
const updateTestSchema = z.object({
  patientName: z.string().min(2).optional(),
  testType: z.string().min(3).optional(),
  result: z.string().min(2).optional(),
  testDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format.",
  }).optional(),
  notes: z.string().optional(),
});
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params; //  Extract the ID from the dynamic route

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid test ID" }, { status: 400 });
    }

    const test = await prisma.diagnosticTest.findUnique({
      where: { id: Number(id) },
    });

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    return NextResponse.json(test, { status: 200 });
  } catch (error) {
    console.error("Error fetching test by ID:", error);
    return NextResponse.json({ error: "Failed to fetch test" }, { status: 500 });
  }
}

// PUT `/api/tests/:id` → Update an Existing Test
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json(); // Parse request body

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid test ID" }, { status: 400 });
    }

    //  Validate Input (Partial Updates Allowed)
    const validatedData = updateTestSchema.parse(body);

    //  Convert testDate (if provided) to ISO format
    if (validatedData.testDate) {
      validatedData.testDate = new Date(validatedData.testDate).toISOString();
    }

    //  Update test result in the database
    const updatedTest = await prisma.diagnosticTest.update({
      where: { id: Number(id) },
      data: validatedData,
    });

    return NextResponse.json(updatedTest, { status: 200 });
  } catch (error) {
    console.error("Error updating test:", error);
    return NextResponse.json(
      { error: error instanceof z.ZodError ? error.errors : "Failed to update test" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid test ID" }, { status: 400 });
    }

    // Check if the test exists before deleting
    const existingTest = await prisma.diagnosticTest.findUnique({
      where: { id: Number(id) },
    });

    if (!existingTest) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    await prisma.diagnosticTest.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Test deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting test:", error);
    return NextResponse.json({ error: "Failed to delete test" }, { status: 500 });
  }
}
