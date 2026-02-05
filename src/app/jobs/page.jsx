"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LuBriefcaseBusiness } from "react-icons/lu";
import {
  MdAdd,
  MdDelete,
  MdEdit,
  MdAnalytics,
  MdContentCopy,
  MdClose,
  MdEmail,
} from "react-icons/md";
import Navbar from "@/components/Navbar";
import axiosInstance from "@/lib/axios";
import {
  Box,
  Container,
  Typography,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import Button from "@/components/ui/Button";
import ReactMarkdown from "react-markdown";

export default function JobsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [analyzingJobId, setAnalyzingJobId] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

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

  const analyzeJob = async (jobId, jobDescription) => {
    try {
      setAnalyzingJobId(jobId);
      const response = await axiosInstance.post("/api/resume/analyze-job", {
        jobDescription,
        jobId,
      });

      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === jobId
            ? {
                ...job,
                compatibilityScore: response.data.data.matchScore,
                polishedResume: response.data.data.polishedResume,
                analysis: {
                  matchingSkills: response.data.data.matchingSkills,
                  missingSkills: response.data.data.missingSkills,
                  recommendations: response.data.data.recommendations,
                },
              }
            : job,
        ),
      );
    } catch (err) {
      console.error("Analysis failed", err);
    } finally {
      setAnalyzingJobId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let savedJob;
      if (editingId) {
        const res = await axiosInstance.put(`/api/jobs/${editingId}`, formData);
        savedJob = res.data.data;
      } else {
        const res = await axiosInstance.post("/api/jobs", formData);
        savedJob = res.data.data;
      }

      resetForm();
      fetchJobs();

      if (formData.jobDescription && formData.jobDescription.length > 20) {
        analyzeJob(savedJob._id, formData.jobDescription);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save job");
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axiosInstance.delete(`/api/jobs/${id}`);
      fetchJobs();
    } catch (err) {
      setError("Failed to delete job");
    }
  };

  const startEdit = (job) => {
    setFormData({
      company: job.company,
      position: job.position,
      jobDescription: job.jobDescription,
      status: job.status,
      notes: job.notes,
      appliedDate: job.appliedDate
        ? new Date(job.appliedDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    });
    setEditingId(job._id);
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
        return "primary";
      case "Interviewing":
        return "secondary";
      case "Offered":
        return "success";
      case "Rejected":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--background)",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!user) return null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "var(--background)",
        position: "relative",
      }}
    >
      <Navbar />

      {/* Global Background Image Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "url('/bg-image.png')",
          opacity: 0.02,
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <Container
        maxWidth="lg"
        sx={{ pt: 16, pb: 12, position: "relative", zIndex: 1 }}
      >
        <Box
          sx={{
            mb: 6,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 3,
          }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{ fontWeight: 800, mb: 1, tracking: "-0.05em" }}
            >
              Job Tracker
            </Typography>
            <Typography sx={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
              Track and manage all your career opportunities in one place.
            </Typography>
          </Box>
          <Button onClick={() => setShowForm(true)} size="lg">
            <MdAdd style={{ marginRight: 8, fontSize: "1.4rem" }} /> Add New Job
          </Button>
        </Box>

        {/* Jobs List Section */}
        {loadingJobs ? (
          <Box sx={{ p: 12, textAlign: "center" }}>
            <CircularProgress size={32} />
          </Box>
        ) : jobs.length === 0 ? (
          <div className="p-20 text-center rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl">
            <div className="text-6xl text-white/5 mb-6 flex justify-center">
              <LuBriefcaseBusiness />
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-2 tracking-tight">
              No jobs tracked yet
            </h3>
            <p className="text-text-muted mb-8 font-medium">
              Start mapping your career journey today!
            </p>
            <Button onClick={() => setShowForm(true)} size="lg">
              Add Your First Job
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 relative z-10">
            {jobs.map((job) => (
              <div key={job._id} className="group relative h-full">
                {/* Dynamic Border Beam Effect */}
                <div
                  className={`absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 blur-[2px] transition-opacity duration-500 bg-linear-to-r 
                    ${
                      job.status === "Accepted"
                        ? "from-emerald-500/50 to-teal-500/50"
                        : job.status === "Rejected"
                          ? "from-rose-500/50 to-orange-500/50"
                          : "from-primary/50 to-secondary/50"
                    }`}
                />

                <div className="relative h-full p-6 md:p-8 rounded-3xl bg-[#0f172a]/80 backdrop-blur-3xl border border-white/5 flex flex-col transition-all duration-500 group-hover:-translate-y-2 group-hover:bg-[#0f172a]/90 group-hover:shadow-2xl group-hover:shadow-black/50">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl text-white border border-white/10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner">
                      <LuBriefcaseBusiness />
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-[0.65rem] font-black uppercase tracking-widest border transition-all duration-300
                      ${
                        job.status === "Accepted"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : job.status === "Rejected"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            : job.status === "Interviewing"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-primary/10 text-primary border-primary/20"
                      }`}
                    >
                      {job.status}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-extrabold tracking-tighter text-white mb-1 group-hover:text-primary transition-colors">
                      {job.company}
                    </h3>
                    <p className="text-text-muted font-bold text-sm tracking-tight">
                      {job.position}
                    </p>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 transition-colors group-hover:bg-white/[0.04]">
                      <div className="text-[0.6rem] font-black text-text-muted uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <MdAnalytics className="text-primary text-xs" /> AI
                        Compatibility
                      </div>
                      {analyzingJobId === job._id ? (
                        <div className="flex items-center gap-2 text-primary font-bold text-sm py-1">
                          <CircularProgress
                            size={12}
                            thickness={8}
                            color="inherit"
                          />
                          <span className="animate-pulse">
                            Analyzing Requirements...
                          </span>
                        </div>
                      ) : job.compatibilityScore ? (
                        <div
                          onClick={() => {
                            setSelectedAnalysis(job);
                            setShowAnalysisModal(true);
                          }}
                          className="flex items-center justify-between cursor-pointer group/score"
                        >
                          <span className="text-primary font-black text-2xl tracking-tighter group-hover/score:scale-110 transition-transform">
                            {job.compatibilityScore}%
                          </span>
                          <div className="h-2 w-24 bg-white/10 rounded-full overflow-hidden block">
                            <div
                              className="h-full bg-linear-to-r from-primary to-secondary rounded-full"
                              style={{ width: `${job.compatibilityScore}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() =>
                            job.jobDescription &&
                            analyzeJob(job._id, job.jobDescription)
                          }
                          className={`text-xs font-bold transition-all py-1 ${job.jobDescription ? "text-primary hover:tracking-wide cursor-pointer flex items-center gap-1" : "text-text-muted/50 cursor-default"}`}
                        >
                          {job.jobDescription ? (
                            <>
                              Analyze Ready{" "}
                              <MdAnalytics className="animate-bounce" />
                            </>
                          ) : (
                            "Add description to unlock AI analysis"
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 px-1">
                      <MdEmail className="text-text-muted text-xs" />
                      <span className="text-[0.7rem] font-bold text-text-muted">
                        Applied{" "}
                        {job.appliedDate
                          ? new Date(job.appliedDate).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 mt-auto flex justify-end items-center gap-3">
                    <IconButton
                      size="small"
                      onClick={() => startEdit(job)}
                      className="text-white/20 hover:text-white hover:bg-white/10 transition-all rounded-xl p-2"
                    >
                      <MdEdit size={18} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => deleteJob(job._id)}
                      className="text-white/20 hover:text-rose-400 hover:bg-rose-500/10 transition-all rounded-xl p-2"
                    >
                      <MdDelete size={18} />
                    </IconButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Summary - Custom Minimal Cards */}
        {jobs.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {[
              {
                label: "Total Tracking",
                value: jobs.length,
                color: "#94a3b8",
              },
              {
                label: "Applications Sent",
                value: jobs.filter((j) => j.status === "Applied").length,
                color: "#818cf8",
              },
              {
                label: "Interviews Booked",
                value: jobs.filter((j) => j.status === "Interviewing").length,
                color: "#fbbf24",
              },
              {
                label: "Offers Received",
                value: jobs.filter((j) => j.status === "Offered").length,
                color: "#10b981",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-lg flex flex-col items-center justify-center text-center"
              >
                <div className="text-[0.6rem] font-bold text-text-muted uppercase tracking-[0.2em] mb-2">
                  {stat.label}
                </div>
                <div
                  className="text-3xl font-black text-white"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        <Dialog
          open={showForm}
          onClose={resetForm}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: "#1e293b",
              borderRadius: 4,
              backgroundImage: "none",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            },
          }}
        >
          <DialogTitle
            sx={{
              p: 4,
              pb: 2,
              fontWeight: 800,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {editingId ? "Edit Job Application" : "Track New Opportunity"}
            <IconButton onClick={resetForm} sx={{ color: "var(--text-muted)" }}>
              <MdClose />
            </IconButton>
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent sx={{ p: 4, pt: 0 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
                  {error}
                </Alert>
              )}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Company Name"
                    fullWidth
                    required
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    placeholder="e.g. Google"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Position"
                    fullWidth
                    required
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    placeholder="e.g. Senior Software Engineer"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Status"
                    select
                    fullWidth
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Applied Date"
                    type="date"
                    fullWidth
                    value={formData.appliedDate}
                    onChange={(e) =>
                      setFormData({ ...formData, appliedDate: e.target.value })
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Job Description"
                    multiline
                    rows={4}
                    fullWidth
                    value={formData.jobDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        jobDescription: e.target.value,
                      })
                    }
                    placeholder="Paste the job requirements here for AI analysis..."
                    helperText="AI analysis will trigger automatically if description is provided."
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Notes"
                    multiline
                    rows={3}
                    fullWidth
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Interview questions, contacts, etc."
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 4, pt: 0 }}>
              <Button type="submit" size="lg" fullWidth>
                {editingId ? "Save Changes" : "Add to Tracker"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* AI Analysis Modal */}
        <Dialog
          open={showAnalysisModal}
          onClose={() => setShowAnalysisModal(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: "#0f172a",
              borderRadius: 6,
              backgroundImage: "none",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              overflow: "hidden",
            },
          }}
        >
          <div className="relative">
            {/* Header Background Glow */}
            <div className="absolute top-0 inset-x-0 h-40 bg-linear-to-b from-primary/10 to-transparent -z-10" />

            <DialogTitle
              sx={{
                p: 4,
                pb: 0,
                fontWeight: 900,
                fontSize: "1.75rem",
                letterSpacing: "-0.04em",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "white",
              }}
            >
              Analysis <span className="text-primary ml-2">Command Center</span>
              <IconButton
                onClick={() => setShowAnalysisModal(false)}
                sx={{
                  color: "rgba(255,255,255,0.3)",
                  hover: { color: "white", bg: "white/10" },
                }}
              >
                <MdClose />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 4 }}>
              {selectedAnalysis && (
                <div className="space-y-8">
                  {/* Score & Hero Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 p-8 rounded-4xl bg-white/[0.03] border border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative mb-4">
                        <svg className="w-32 h-32 transform -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-white/5"
                          />
                          <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={364.4}
                            strokeDashoffset={
                              364.4 -
                              (364.4 * selectedAnalysis.compatibilityScore) /
                                100
                            }
                            className="text-primary transition-all duration-1000 ease-out"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl font-black text-white">
                            {selectedAnalysis.compatibilityScore}%
                          </span>
                        </div>
                      </div>
                      <div className="text-[0.6rem] font-black text-text-muted uppercase tracking-[0.2em]">
                        Match Quality
                      </div>
                    </div>

                    <div className="md:col-span-2 p-8 rounded-4xl bg-white/[0.03] border border-white/5 flex flex-col justify-center">
                      <h4 className="text-xl font-extrabold text-white mb-2 tracking-tight">
                        Key Evaluation
                      </h4>
                      <p className="text-text-muted font-medium leading-relaxed italic">
                        "
                        {selectedAnalysis.compatibilityScore > 80
                          ? "This role is a high-confidence match. Your skills align perfectly with the core requirements."
                          : selectedAnalysis.compatibilityScore > 50
                            ? "You have a solid foundation, but some key skill gaps need to be addressed in your pitch."
                            : "This role might be a stretch. Focus on highlighting transferable skills during the application."}
                        "
                      </p>
                    </div>
                  </div>

                  {/* Skills Heatmap */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-emerald-500/[0.02] border border-emerald-500/10">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">
                          Matching Proficiencies
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedAnalysis.analysis?.matchingSkills?.map(
                          (skill, i) => (
                            <div
                              key={i}
                              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold"
                            >
                              {skill}
                            </div>
                          ),
                        )}
                        {(!selectedAnalysis.analysis?.matchingSkills ||
                          selectedAnalysis.analysis.matchingSkills.length ===
                            0) && (
                          <span className="text-text-muted/50 text-xs italic">
                            No direct matches identified.
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-rose-500/[0.02] border border-rose-500/10">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-rose-400" />
                        <span className="text-xs font-black text-rose-400 uppercase tracking-widest">
                          Growth Opportunities
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedAnalysis.analysis?.missingSkills?.map(
                          (skill, i) => (
                            <div
                              key={i}
                              className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold"
                            >
                              {skill}
                            </div>
                          ),
                        )}
                        {(!selectedAnalysis.analysis?.missingSkills ||
                          selectedAnalysis.analysis.missingSkills.length ===
                            0) && (
                          <span className="text-text-muted/50 text-xs italic">
                            All required skills found!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="p-8 rounded-4xl bg-white/[0.02] border border-white/5">
                    <h4 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                      <MdAnalytics className="text-primary" /> Strategic Roadmap
                    </h4>
                    <div className="space-y-4">
                      {selectedAnalysis.analysis?.recommendations?.map(
                        (rec, i) => (
                          <div
                            key={i}
                            className="flex gap-4 p-4 rounded-2xl bg-white/[0.01] border border-white/[0.02] hover:bg-white/5 transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-sm shrink-0 group-hover:scale-110 transition-transform">
                              {i + 1}
                            </div>
                            <p className="text-sm text-text-muted font-medium leading-relaxed group-hover:text-text-main transition-colors">
                              {rec}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Tailored Content */}
                  {selectedAnalysis.polishedResume && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center px-2">
                        <h4 className="text-lg font-black text-white">
                          AI Tailored Summary
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              selectedAnalysis.polishedResume,
                            );
                          }}
                          className="text-primary hover:bg-primary/10 gap-2"
                        >
                          <MdContentCopy /> Copy Content
                        </Button>
                      </div>
                      <div className="p-8 rounded-4xl bg-[#020617] border border-white/5 shadow-inner">
                        <div className="prose prose-invert prose-sm max-w-none text-text-muted font-medium leading-loose">
                          <ReactMarkdown>
                            {selectedAnalysis.polishedResume}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>

            <DialogActions sx={{ p: 4, pt: 0 }}>
              <Button
                onClick={() => setShowAnalysisModal(false)}
                size="lg"
                fullWidth
                className="bg-white/5 hover:bg-white/10 text-white border-white/10"
              >
                Close Commander
              </Button>
            </DialogActions>
          </div>
        </Dialog>
      </Container>
    </Box>
  );
}
