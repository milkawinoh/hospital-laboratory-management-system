"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

// ✅ Define Validation Schema
const testSchema = z.object({
  patientName: z.string().min(2, "Patient name must be at least 2 characters."),
  testType: z.string().min(3, "Test type must be at least 3 characters."),
  result: z.string().min(2, "Result must be at least 2 characters."),
  testDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format.",
  }),
  notes: z.string().optional(),
});

export default function CreateTest() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Setup React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(testSchema),
  });

  // ✅ Handle Form Submission
  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      setErrorMessage("");
      console.log("Submitting Data:", data); // ✅ Debugging log

      // ✅ Send Data to API
      await axios.post("/api/tests", data);

      // ✅ Redirect to Dashboard After Success
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating test:", error);
      setErrorMessage("Failed to create test. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Create Test Result</h1>

      {/* ✅ Show Error Message */}
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Patient Name */}
        <div>
          <label className="block font-medium">Patient Name</label>
          <input {...register("patientName")} className="w-full p-2 border rounded" />
          {errors.patientName && <p className="text-red-500">{errors.patientName.message}</p>}
        </div>

        {/* Test Type */}
        <div>
          <label className="block font-medium">Test Type</label>
          <input {...register("testType")} className="w-full p-2 border rounded" />
          {errors.testType && <p className="text-red-500">{errors.testType.message}</p>}
        </div>

        {/* Result */}
        <div>
          <label className="block font-medium">Result</label>
          <input {...register("result")} className="w-full p-2 border rounded" />
          {errors.result && <p className="text-red-500">{errors.result.message}</p>}
        </div>

        {/* Test Date */}
        <div>
          <label className="block font-medium">Test Date</label>
          <input type="date" {...register("testDate")} className="w-full p-2 border rounded" />
          {errors.testDate && <p className="text-red-500">{errors.testDate.message}</p>}
        </div>

        {/* Notes */}
        <div>
          <label className="block font-medium">Notes</label>
          <textarea {...register("notes")} className="w-full p-2 border rounded"></textarea>
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
