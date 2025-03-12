"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

//  1. Define the validation schema for form inputs
const testSchema = z.object({
  patientName: z.string().min(2, "Patient name must be at least 2 characters."),
  testType: z.string().min(3, "Test type must be at least 3 characters."),
  result: z.string().min(2, "Result must be at least 2 characters."),
  testDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format.",
  }),
  notes: z.string().optional(),
});

export default function EditTestPage() {
  const router = useRouter();
  const { id } = useParams(); // ✅ 2. Get test ID from the URL
  const [loading, setLoading] = useState(true);

  // ✅ 3. Initialize React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(testSchema),
  });

  // ✅ 4. Fetch test details when the page loads
  useEffect(() => {
    axios.get(`/api/tests/${id}`)
      .then((response) => {
        const test = response.data;
        setValue("patientName", test.patientName);
        setValue("testType", test.testType);
        setValue("result", test.result);
        setValue("testDate", test.testDate.split("T")[0]); // Format date
        setValue("notes", test.notes || "");
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching test details:", error);
        setLoading(false);
      });
  }, [id, setValue]);

  // ✅ 5. Handle form submission to update test
  const onSubmit = async (data: any) => {
    try {
      await axios.put(`/api/tests/${id}`, {
        ...data,
        testDate: new Date(data.testDate).toISOString(), // Convert date format
      });

      router.push("/dashboard"); // ✅ Redirect to dashboard after updating
    } catch (error) {
      console.error("Error updating test:", error);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Edit Test Result</h1>

      {loading ? (
        <p className="text-center">Loading test details...</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-lg p-6">
          {/* ✅ Input: Patient Name */}
          <div className="mb-4">
            <label className="block font-medium">Patient Name</label>
            <input {...register("patientName")} className="w-full border p-2 rounded" />
            {errors.patientName && <p className="text-red-500">{errors.patientName.message as string}</p>}
          </div>

          {/* ✅ Input: Test Type */}
          <div className="mb-4">
            <label className="block font-medium">Test Type</label>
            <input {...register("testType")} className="w-full border p-2 rounded" />
            {errors.testType && <p className="text-red-500">{errors.testType.message as string}</p>}
          </div>

          {/* ✅ Input: Result */}
          <div className="mb-4">
            <label className="block font-medium">Result</label>
            <input {...register("result")} className="w-full border p-2 rounded" />
            {errors.result && <p className="text-red-500">{errors.result.message as string}</p>}
          </div>

          {/* ✅ Input: Test Date */}
          <div className="mb-4">
            <label className="block font-medium">Test Date</label>
            <input type="date" {...register("testDate")} className="w-full border p-2 rounded" />
            {errors.testDate && <p className="text-red-500">{errors.testDate.message as string}</p>}
          </div>

          {/* ✅ Input: Notes */}
          <div className="mb-4">
            <label className="block font-medium">Notes</label>
            <textarea {...register("notes")} className="w-full border p-2 rounded"></textarea>
          </div>

          {/* ✅ Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      )}
    </div>
  );
}
