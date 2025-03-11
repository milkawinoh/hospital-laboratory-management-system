import { NextResponse } from "next/server";

import { PrismaClient, Prisma } from '@prisma/client';// Import Prisma Client

import { z } from "zod"; // Import Zod for validation

const testSchema = z.object({
    patientName: z.string().min(2, "Patient name must be at least 2 characters."),
    testType: z.string().min(3, "Test type must be at least 3 characters."),
    result: z.string().min(2, "Result must be at least 2 characters."),
    testDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format.",
    }),
    notes: z.string().optional(),
  });
  