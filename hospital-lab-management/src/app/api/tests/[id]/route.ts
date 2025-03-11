import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
