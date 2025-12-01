"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { IoBriefcaseSharp } from "react-icons/io5";
import Navbar from "@/components/Navbar";
import axiosInstance from "@/lib/axios";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function JobsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    jobDescription: "",
    status: "Applied",
    notes: "",
    appliedDate: new Date().toISOString().split("T")[0],
  });

  const statusOptions = ["Applied", "Interviewing", "Rejected", "Offered"];

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);
      const response = await axiosInstance.get("/api/jobs");
      setJobs(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch jobs");
      setError("Failed to load jobs");
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        await axiosInstance.put(`/api/jobs/${editingId}`, formData);
      } else {
        await axiosInstance.post("/api/jobs", formData);
      }

      resetForm();
      fetchJobs();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save job");
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm("Are you sure you want this job?")) return;
    console.log(id, 'wjkdhajwhdjkwahdjkwhdkjwahdkhwakjhdkjwa');
    try {
      await axiosInstance.delete(`/api/jobs/${id}`);
      fetchJobs();
    } catch (err) {
      setError("Failed to delete job");
    }
  };

  console.log(jobs);
  

  const startEdit = (job) => {
    setFormData(job);
    setEditingId(job.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      company: "",
      position: "",
      jobDescription: "",
      status: "Applied",
      notes: "",
      appliedDate: new Date().toISOString().split("T")[0],
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Interviewing":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Offered":
        return "bg-green-100 text-green-700 border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="text-gray-500 mt-4 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50/50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                Job Tracker
              </h1>
              <p className="text-gray-500 mt-2 text-lg">
                Track your job applications and interviews
              </p>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              size="lg"
              className="shadow-lg shadow-primary/25"
            >
              {showForm ? "Cancel" : "+ Add Job"}
            </Button>
          </div>

          {/* Form */}
          {showForm && (
            <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
              <Card className="p-8 border-primary/20 ring-4 ring-primary/5">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingId ? "Edit Job" : "Add New Job"}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Company Name"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      required
                      placeholder="Google"
                    />
                    <Input
                      label="Position"
                      value={formData.position}
                      onChange={(e) =>
                        setFormData({ ...formData, position: e.target.value })
                      }
                      required
                      placeholder="Senior Software Engineer"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Input
                      label="Applied Date"
                      type="date"
                      value={formData.appliedDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          appliedDate: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                      Job Description
                    </label>
                    <textarea
                      value={formData.jobDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          jobDescription: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all resize-y"
                      placeholder="Paste the job description here..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all resize-y"
                      placeholder="Add any notes about this application..."
                    />
                  </div>

                  <div className="flex space-x-4 pt-2">
                    <Button type="submit" className="flex-1" size="lg">
                      {editingId ? "Update Job" : "Add Job"}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={resetForm}
                      className="flex-1"
                      size="lg"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          )}

          {/* Jobs Table */}
          <Card className="overflow-hidden border-0 shadow-xl shadow-gray-200/40">
            {loadingJobs ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="p-16 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                  <IoBriefcaseSharp />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No jobs tracked yet
                </h3>
                <p className="text-gray-500 mb-8">
                  Start tracking your applications today!
                </p>
                <Button onClick={() => setShowForm(true)}>
                  Add Your First Job
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Company & Position
                      </th>
                      <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Applied Date
                      </th>
                      <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Notes
                      </th>
                      <th className="px-6 py-5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {jobs.map((job) => (
                      <tr
                        key={job._id}
                        className="hover:bg-gray-50/80 transition-colors group"
                      >
                        <td className="px-6 py-5">
                          <div>
                            <div className="font-bold text-gray-900">
                              {job.company}
                            </div>
                            <div className="text-sm text-gray-500">
                              {job.position}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                              job.status
                            )}`}
                          >
                            {job.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-600">
                          {job.appliedDate
                            ? new Date(job.appliedDate).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-600 max-w-xs truncate">
                          {job.notes || (
                            <span className="text-gray-400 italic">
                              No notes
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => startEdit(job)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => deleteJob(job._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Stats */}
          {jobs.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <Card className="p-6 text-center border-0 bg-white">
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                  Total
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {jobs.length}
                </p>
              </Card>
              <Card className="p-6 text-center border-0 bg-blue-50">
                <p className="text-blue-600 text-sm font-medium uppercase tracking-wide">
                  Applied
                </p>
                <p className="text-3xl font-bold text-blue-700 mt-2">
                  {jobs.filter((j) => j.status === "Applied").length}
                </p>
              </Card>
              <Card className="p-6 text-center border-0 bg-purple-50">
                <p className="text-purple-600 text-sm font-medium uppercase tracking-wide">
                  Interviewing
                </p>
                <p className="text-3xl font-bold text-purple-700 mt-2">
                  {jobs.filter((j) => j.status === "Interviewing").length}
                </p>
              </Card>
              <Card className="p-6 text-center border-0 bg-green-50">
                <p className="text-green-600 text-sm font-medium uppercase tracking-wide">
                  Offered
                </p>
                <p className="text-3xl font-bold text-green-700 mt-2">
                  {jobs.filter((j) => j.status === "Offered").length}
                </p>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
