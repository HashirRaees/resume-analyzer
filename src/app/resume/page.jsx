"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LiaClipboardListSolid } from "react-icons/lia";

import Navbar from "@/components/Navbar";
import axiosInstance from "@/lib/axios";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function ResumePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [resumeText, setResumeText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [activeTab, setActiveTab] = useState("analyze");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchResumeHistory();
    }
  }, [user]);

  const fetchResumeHistory = async () => {
    try {
      setLoadingHistory(true);
      const response = await axiosInstance.get("/api/resume");
      console.log("Fetched history:", response.data);
      setHistory(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch resume history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!resumeText.trim()) {
      setError("Please enter your resume text");
      return;
    }

    if (resumeText.trim().length < 50) {
      setError("Resume text must be at least 50 characters");
      return;
    }

    setError("");
    setAnalyzing(true);

    try {
      console.log("=== Starting Analysis ===");
      console.log("Sending request with text length:", resumeText.length);
      
      const response = await axiosInstance.post("/api/resume/analyze", {
        resumeText: resumeText.trim(),
      });
      
      console.log("=== Response Received ===");
      console.log("Full response:", response);
      console.log("Response data:", response.data);
      console.log("Response data.data:", response.data.data);
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Analysis failed");
      }

      if (!response.data.data) {
        throw new Error("No data received from server");
      }
      
      setResult(response.data.data);
      setResumeText("");
      setActiveTab("results");
      
      // Refresh history
      await fetchResumeHistory();
      
      console.log("=== Analysis Complete ===");
      
    } catch (err) {
      console.error("=== Analysis Error ===");
      console.error("Full error object:", err);
      console.error("Error response:", err.response);
      console.error("Error response data:", err.response?.data);
      
      const errorMessage = err.response?.data?.message 
        || err.message 
        || "Failed to analyze resume. Please try again.";
      
      setError(errorMessage);
    } finally {
      setAnalyzing(false);
    }
  };

  const deleteResume = async (id) => {
    try {
      console.log("Deleting resume with ID:", id);
      
      await axiosInstance.delete(`/api/resume/${id}`);
      
      console.log("Delete successful");
      
      // Clear result if it's the one being deleted
      if (result && result._id === id) {
        setResult(null);
        setActiveTab("history");
      }
      
      // Refresh history
      await fetchResumeHistory();
      
      // Clear error
      setError("");
      
    } catch (err) {
      console.error("Delete error:", err);
      console.error("Error details:", err.response?.data);
      setError(err.response?.data?.message || "Failed to delete resume");
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
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Resume Analyzer
            </h1>
            <p className="text-gray-500 mt-2 text-lg">
              Get AI-powered feedback to improve your resume
            </p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-8 bg-white p-1 rounded-xl shadow-sm border border-gray-200 w-fit">
            <button
              onClick={() => setActiveTab("analyze")}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                activeTab === "analyze"
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              Analyze Resume
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                activeTab === "history"
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              History
            </button>
            {result && (
              <button
                onClick={() => setActiveTab("results")}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === "results"
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                Latest Results
              </button>
            )}
          </div>

          {/* Analyze Tab */}
          {activeTab === "analyze" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="p-8">
                  <form onSubmit={handleAnalyze} className="space-y-6">
                    {error && (
                      <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {error}
                      </div>
                    )}

                    <div>
                      <label className="block text-lg font-semibold text-gray-900 mb-3">
                        Paste Your Resume
                      </label>
                      <div className="relative">
                        <textarea
                          value={resumeText}
                          onChange={(e) => setResumeText(e.target.value)}
                          placeholder="Paste your complete resume text here..."
                          rows={15}
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none font-mono text-sm leading-relaxed resize-y transition-all"
                        />
                        <div className="absolute bottom-4 right-4 text-xs text-gray-400 pointer-events-none">
                          {resumeText.length} characters
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      isLoading={analyzing}
                      disabled={analyzing || resumeText.trim().length < 50}
                    >
                      {analyzing ? "Analyzing..." : "Analyze Resume"}
                    </Button>
                  </form>
                </Card>
              </div>

              <div className="h-fit sticky top-24">
                <Card className="p-8 bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mr-3 text-sm">
                      💡
                    </span>
                    Tips for Best Results
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start space-x-3 text-sm text-gray-600">
                      <svg
                        className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>
                        Include measurable achievements (e.g., "Increased sales
                        by 20%")
                      </span>
                    </li>
                    <li className="flex items-start space-x-3 text-sm text-gray-600">
                      <svg
                        className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>
                        Use strong action verbs to describe your
                        responsibilities
                      </span>
                    </li>
                    <li className="flex items-start space-x-3 text-sm text-gray-600">
                      <svg
                        className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>
                        List relevant technical skills and certifications
                      </span>
                    </li>
                    <li className="flex items-start space-x-3 text-sm text-gray-600">
                      <svg
                        className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>
                        Keep formatting clean and simple for better AI parsing
                      </span>
                    </li>
                  </ul>
                </Card>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <Card className="p-8">
              {loadingHistory ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                  <p className="text-gray-500 mt-4">Loading history...</p>
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                    <LiaClipboardListSolid />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No History Yet
                  </h3>
                  <p className="text-gray-500 mb-8">
                    Start by analyzing your first resume!
                  </p>
                  <Button onClick={() => setActiveTab("analyze")}>
                    Analyze Now
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {history.map((resume) => (
                    <div
                      key={resume._id}
                      className="group border border-gray-100 rounded-xl p-6 hover:shadow-lg hover:border-primary/20 transition-all bg-white"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              Resume Analysis
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              {new Date(resume.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-6 text-sm">
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-500">
                                Overall Score:
                              </span>
                              <span
                                className={`font-bold text-lg ${
                                  resume.score >= 80
                                    ? "text-green-600"
                                    : resume.score >= 60
                                    ? "text-yellow-600"
                                    : "text-red-600"
                                }`}
                              >
                                {resume.score}/100
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-500">ATS Score:</span>
                              <span
                                className={`font-bold text-lg ${
                                  resume.atsScore >= 80
                                    ? "text-green-600"
                                    : resume.atsScore >= 60
                                    ? "text-yellow-600"
                                    : "text-red-600"
                                }`}
                              >
                                {resume.atsScore}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteResume(resume._id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Results Tab */}
          {activeTab === "results" && result && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Score Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-8 bg-gradient-to-br from-primary to-primary-dark text-white border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-indigo-100 font-medium mb-1">
                        Overall Score
                      </p>
                      <h3 className="text-5xl font-bold tracking-tight">
                        {result.score || 0}
                      </h3>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <span className="text-2xl">🏆</span>
                    </div>
                  </div>
                  <div className="mt-6 w-full bg-black/20 rounded-full h-2">
                    <div
                      className="bg-white h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${result.score || 0}%` }}
                    ></div>
                  </div>
                </Card>

                <Card className="p-8 bg-gradient-to-br from-teal-500 to-teal-600 text-white border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-teal-100 font-medium mb-1">
                        ATS Compatibility
                      </p>
                      <h3 className="text-5xl font-bold tracking-tight">
                        {result.atsScore || 0}
                      </h3>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <span className="text-2xl">🤖</span>
                    </div>
                  </div>
                  <div className="mt-6 w-full bg-black/20 rounded-full h-2">
                    <div
                      className="bg-white h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${result.atsScore || 0}%` }}
                    ></div>
                  </div>
                </Card>
              </div>

              {/* Suggestions */}
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-3 text-yellow-500">💡</span>
                  Improvement Suggestions
                </h2>
                <div className="space-y-4">
                  {result.suggestions && result.suggestions.length > 0 ? (
                    result.suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 bg-yellow-50 p-5 rounded-xl border border-yellow-100"
                      >
                        <div className="flex-shrink-0 w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-gray-800 leading-relaxed">
                          {suggestion}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">
                      No specific suggestions found. Great job!
                    </p>
                  )}
                </div>
              </Card>

              {/* Grammar Fixes */}
              {result.grammarFixes && (
                <Card className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="mr-3 text-blue-500">✨</span>
                    Polished Version
                  </h2>
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 font-mono text-sm text-gray-700 leading-relaxed whitespace-pre-wrap max-h-[600px] overflow-y-auto shadow-inner">
                    {result.grammarFixes}
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}