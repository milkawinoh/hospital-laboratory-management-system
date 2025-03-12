"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Import useRouter for navigation
import axios from "axios";

interface TestResult {
  id: number;
  patientName: string;
  testType: string;
  result: string;
  testDate: string;
  notes?: string;
}

export default function Dashboard() {
  const router = useRouter(); // ✅ Initialize Next.js router
  const [tests, setTests] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = () => {
    axios.get("/api/tests")
      .then((response) => {
        setTests(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching test results:", error);
        setLoading(false);
      });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this test result?")) {
      return;
    }

    setDeletingId(id);

    try {
      await axios.delete(`/api/tests/${id}`);
      setTests(tests.filter((test) => test.id !== id));
    } catch (error) {
      console.error("Error deleting test:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading test results...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 shadow-md bg-white rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="border border-gray-300 px-4 py-2 text-left">Patient Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Test Type</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Result</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Test Date</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test.id} className="border border-gray-300 hover:bg-gray-100">
                  <td className="px-4 py-2">{test.patientName}</td>
                  <td className="px-4 py-2">{test.testType}</td>
                  <td className="px-4 py-2">{test.result}</td>
                  <td className="px-4 py-2">{new Date(test.testDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2 flex space-x-4">
                    {/* ✅ Updated Edit button to navigate to Edit Page */}
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => router.push(`/tests/edit/${test.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(test.id)}
                      disabled={deletingId === test.id}
                    >
                      {deletingId === test.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
