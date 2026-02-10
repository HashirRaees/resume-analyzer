"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LuBriefcaseBusiness } from "react-icons/lu";
import { HiSparkles, HiInformationCircle } from "react-icons/hi2";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MdAdd,
  MdDelete,
  MdEdit,
  MdAnalytics,
  MdContentCopy,
  MdClose,
  MdEmail,
  MdArrowForward,
  MdExpandMore,
  MdExpandLess,
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
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [collapsedIds, setCollapsedIds] = useState(new Set());

  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  const statsRef = useRef(null);

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
      const fetchedJobs = response.data.data || [];
      setJobs(fetchedJobs);
      // Default all fetched jobs to collapsed
      setCollapsedIds(new Set(fetchedJobs.map((j) => j._id)));
    } catch (err) {
      console.error("Failed to fetch jobs");
      setError("Failed to load jobs");
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    if (loadingJobs || jobs.length === 0) return;

    gsap.registerPlugin(ScrollTrigger);

    // Header Reveal
    gsap.fromTo(
      headerRef.current,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
    );

    // Staggered Cards Reveal
    gsap.fromTo(
      cardsRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 20%",
        },
      },
    );

    // Stats Reveal
    if (statsRef.current) {
      gsap.fromTo(
        statsRef.current.children,
        { y: 40, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 90%",
          },
        },
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [loadingJobs, jobs.length]);

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

  const toggleCollapse = (id) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
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
          ref={headerRef}
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
          <div className="p-12 md:p-20 text-center rounded-[3rem] bg-white/2 border border-white/5 backdrop-blur-3xl">
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
          <div className="grid grid-cols-1 gap-8 mb-12 relative z-10">
            {jobs.map((job, index) => {
              const isCollapsed = collapsedIds.has(job._id);
              return (
                <div
                  key={job._id}
                  ref={(el) => (cardsRef.current[index] = el)}
                  className="group relative"
                >
                  {/* Dynamic Border Beam Effect */}
                  <div
                    className={`absolute -inset-px rounded-3xl bg-linear-to-r transition-all duration-500
                      ${
                        job.status === "Accepted"
                          ? "from-emerald-500/50 to-teal-500/50"
                          : job.status === "Rejected"
                            ? "from-rose-500/50 to-orange-500/50"
                            : "from-primary/50 to-secondary/50"
                      } ${isCollapsed ? "opacity-30" : "opacity-100"}`}
                  />

                  <div className="relative p-6 md:p-8 rounded-3xl bg-[#0f172a]/95 backdrop-blur-3xl border border-white/5 flex flex-col transition-all duration-500">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl text-white border border-white/10 group-hover:border-primary/30 transition-colors">
                          <LuBriefcaseBusiness />
                        </div>
                        <div>
                          <h3 className="text-xl font-extrabold tracking-tighter text-white">
                            {job.company}
                          </h3>
                          <p className="text-text-muted font-medium text-xs tracking-tight">
                            {job.position}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div
                          className={`px-3 py-1.5 rounded-full text-[0.65rem] font-medium uppercase tracking-widest border transition-all duration-300
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
                        <IconButton
                          onClick={() => toggleCollapse(job._id)}
                          className="w-10 h-10 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 border border-white/5 transition-all"
                        >
                          {isCollapsed ? (
                            <MdExpandMore size={24} />
                          ) : (
                            <MdExpandLess size={24} />
                          )}
                        </IconButton>
                      </div>
                    </div>

                    {/* Collapsible Content Section */}
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${isCollapsed ? "max-h-0 opacity-0" : "max-h-[1000px] opacity-100 mt-2"}`}
                    >
                      <div className="space-y-6 pt-6 border-t border-white/5">
                        <div className="bg-white/2 border border-white/5 rounded-4xl p-6 transition-all duration-500 hover:bg-white/4 relative overflow-hidden">
                          {/* Subtl Background Glow */}
                          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-20" />

                          <div className="flex justify-between items-center mb-4">
                            <div className="text-xs font-medium text-text-muted uppercase tracking-wider flex items-center gap-2">
                              AI Compatibility
                            </div>
                            {job.compatibilityScore && (
                              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                                <span className="text-xs font-medium text-primary tracking-tighter">
                                  LIVE SYNC
                                </span>
                              </div>
                            )}
                          </div>

                          {analyzingJobId === job._id ? (
                            <div className="flex flex-col items-center gap-3 py-4">
                              <div className="relative">
                                <CircularProgress
                                  size={32}
                                  thickness={4}
                                  className="text-primary"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <HiSparkles className="text-primary animate-pulse" />
                                </div>
                              </div>
                              <span className="text-[0.6rem] font-medium text-primary uppercase tracking-widest animate-pulse">
                                AI Analyzing...
                              </span>
                            </div>
                          ) : job.compatibilityScore ? (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-6">
                                <div>
                                  <span className="text-4xl font-medium text-white tracking-tighter">
                                    {job.compatibilityScore}%
                                  </span>
                                  <span className="text-[0.6rem] font-medium text-text-muted uppercase tracking-widest block mt-1">
                                    Match Quality
                                  </span>
                                </div>
                                <div className="h-10 w-px bg-white/5" />
                                <div>
                                  <span className="text-xs font-medium text-text-muted leading-relaxed max-w-[200px] block opacity-60">
                                    Deep resonance analysis complete.
                                  </span>
                                </div>
                              </div>
                              <Button
                                onClick={() => {
                                  setSelectedJobId(job._id);
                                  setShowAnalysisModal(true);
                                }}
                                size="sm"
                                className="px-6 h-10 border border-primary/20 hover:border-primary/50 transition-all font-medium uppercase tracking-widest text-[0.65rem] bg-primary/5"
                              >
                                View Job Analysis
                                <MdArrowForward className="ml-2" />
                              </Button>
                            </div>
                          ) : (
                            <div className="py-2">
                              {job.jobDescription ? (
                                <div className="flex items-center justify-between gap-4">
                                  <p className="text-[0.7rem] font-medium text-text-muted leading-relaxed opacity-60">
                                    Analysis ready for deep neural comparison.
                                  </p>
                                  <Button
                                    onClick={() =>
                                      analyzeJob(job._id, job.jobDescription)
                                    }
                                    size="sm"
                                    variant="outline"
                                    className="h-10 border-primary/30 hover:border-primary text-primary hover:bg-primary/5 font-medium uppercase tracking-widest text-[0.65rem] flex items-center gap-2 whitespace-nowrap"
                                  >
                                    <HiSparkles />
                                    Start Match Analysis
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 text-text-muted/30">
                                    <MdAnalytics size={16} />
                                  </div>
                                  <p className="text-[0.6rem] font-medium text-text-muted/40 uppercase tracking-widest">
                                    Missing Description for Analysis
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-center py-4 px-6 rounded-3xl bg-white/1 border border-white/5">
                          <div className="flex items-center gap-4 text-xs font-medium text-text-muted">
                            <span className="flex items-center gap-2">
                              Applied on{" "}
                              {job.appliedDate
                                ? new Date(job.appliedDate).toLocaleDateString()
                                : "N/A"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <IconButton
                              size="small"
                              onClick={() => startEdit(job)}
                              className="text-white/20 hover:text-white hover:bg-white/10 transition-all rounded-xl p-2"
                            >
                              <MdEdit size={16} />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => deleteJob(job._id)}
                              className="text-white/20 hover:text-rose-400 hover:bg-rose-500/10 transition-all rounded-xl p-2"
                            >
                              <MdDelete size={16} />
                            </IconButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Stats Summary - Custom Minimal Cards */}
        {jobs.length > 0 && (
          <div
            ref={statsRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8"
          >
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
                className="p-6 rounded-3xl bg-white/2 border border-white/5 backdrop-blur-lg flex flex-col items-center justify-center text-center"
              >
                <div className="text-xs font-medium text-text-muted uppercase tracking-[0.2em] mb-2">
                  {stat.label}
                </div>
                <div
                  className="text-3xl font-medium text-white"
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
            <DialogContent sx={{ p: 4, pt: 4 }}>
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

        {/* AI Analysis Modal - MISSION CONTROL REDESIGN */}
        <Dialog
          open={showAnalysisModal}
          onClose={() => setShowAnalysisModal(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              background: "#020617",
              borderRadius: 8,
              backgroundImage: "none",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              boxShadow: "0 0 100px rgba(0, 0, 0, 0.8)",
              overflow: "hidden",
            },
          }}
        >
          {(() => {
            const selectedJob = jobs.find((j) => j._id === selectedJobId);
            if (!selectedJob) return null;

            return (
              <div className="relative min-h-[80vh] flex flex-col">
                {/* Immersive Background Effects */}
                <div className="absolute top-0 inset-x-0 h-[500px] bg-linear-to-b from-primary/10 via-background/5 to-transparent -z-10" />
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
                <div className="absolute top-1/2 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] -z-10 animate-pulse delay-700" />

                <div className="flex justify-between items-center p-8 md:p-10 border-b border-white/5 bg-white/1 backdrop-blur-md">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-2 rounded-full bg-primary/10 border border-primary/20 text-[0.6rem] font-medium text-primary uppercase tracking-[0.2em] glass-badge">
                        Resume Match Analysis
                      </span>
                      <span className="px-3 py-2 rounded-full bg-white/5 border border-white/10 text-[0.6rem] font-medium text-text-muted uppercase tracking-[0.2em]">
                        AI Insights
                      </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-medium text-white tracking-tighter flex items-center gap-4">
                      {selectedJob.company}{" "}
                      <span className="w-2 h-2 rounded-full bg-white/20" />{" "}
                      <span className="text-primary">
                        {selectedJob.position}
                      </span>
                    </h2>
                  </div>
                  <IconButton
                    onClick={() => setShowAnalysisModal(false)}
                    className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-rose-500/20 text-white/40 hover:text-rose-400 border border-white/10 transition-all"
                  >
                    <MdClose size={24} />
                  </IconButton>
                </div>

                <DialogContent className="p-0 scrollbar-hide">
                  <div className="flex flex-col lg:flex-row h-full">
                    {/* LEFT PANEL: DATA VISUALS */}
                    <div className="w-full lg:w-[450px] p-8 md:p-10 border-r border-white/5 space-y-10 bg-black/20">
                      {/* Main Compatibility Gauge */}
                      <div className="relative flex flex-col items-center">
                        <div className="relative group/gauge">
                          <svg className="w-56 h-56 transform -rotate-90">
                            <circle
                              cx="112"
                              cy="112"
                              r="104"
                              stroke="currentColor"
                              strokeWidth="12"
                              fill="transparent"
                              className="text-white/3"
                            />
                            <circle
                              cx="112"
                              cy="112"
                              r="104"
                              stroke="currentColor"
                              strokeWidth="12"
                              fill="transparent"
                              strokeDasharray={653}
                              strokeDashoffset={
                                653 -
                                (653 * selectedJob.compatibilityScore) / 100
                              }
                              className="text-primary transition-all duration-1000 ease-out"
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-6xl font-medium text-white tracking-tighter">
                              {selectedJob.compatibilityScore}
                              <span className="text-2xl text-primary/50">
                                %
                              </span>
                            </span>
                            <span className="text-[0.65rem] font-medium text-text-muted uppercase tracking-[0.3em] mt-1">
                              Match Score
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 rounded-3xl bg-white/2 border border-white/5 flex flex-col gap-1 items-center justify-center text-center">
                          <span className="text-2xl font-medium text-white">
                            {selectedJob.analysis?.matchingSkills?.length || 0}
                          </span>
                          <span className="text-[0.55rem] font-medium text-emerald-400 uppercase tracking-widest">
                            Matched Assets
                          </span>
                        </div>
                        <div className="p-5 rounded-3xl bg-white/2 border border-white/5 flex flex-col gap-1 items-center justify-center text-center">
                          <span className="text-2xl font-medium text-white">
                            {selectedJob.analysis?.missingSkills?.length || 0}
                          </span>
                          <span className="text-[0.55rem] font-medium text-rose-400 uppercase tracking-widest">
                            Growth Gaps
                          </span>
                        </div>
                      </div>

                      {/* Skills Heatmap */}
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between px-1">
                            <span className="text-[0.6rem] font-medium text-emerald-400 uppercase tracking-widest">
                              Matching Skills
                            </span>
                            <div className="h-px flex-1 bg-emerald-500/10 mx-4" />
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {selectedJob.analysis?.matchingSkills?.map(
                              (skill, i) => (
                                <div
                                  key={i}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[0.65rem] font-medium uppercase tracking-tight"
                                >
                                  {skill}
                                </div>
                              ),
                            )}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between px-1">
                            <span className="text-[0.6rem] font-medium text-rose-400 uppercase tracking-widest">
                              Missing Skills
                            </span>
                            <div className="h-px flex-1 bg-rose-500/10 mx-4" />
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {selectedJob.analysis?.missingSkills?.map(
                              (skill, i) => (
                                <div
                                  key={i}
                                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[0.65rem] font-medium uppercase tracking-tight"
                                >
                                  {skill}
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT PANEL: STRATEGIC & POLISHED ASSETS */}
                    <div className="flex-1 overflow-y-auto max-h-screen p-8 md:p-10 space-y-12">
                      {/* Strategic Recommendations Section */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <MdAnalytics size={20} />
                          </div>
                          <h4 className="text-xl font-medium text-white tracking-tight">
                            AI Recommendations
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedJob.analysis?.recommendations?.map(
                            (rec, i) => (
                              <div
                                key={i}
                                className="group p-5 rounded-3xl bg-white/2 border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all flex gap-4 items-start"
                              >
                                <span className="shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-[0.6rem] font-medium flex items-center justify-center border border-primary/20">
                                  0{i + 1}
                                </span>
                                <p className="text-sm font-medium text-text-muted leading-relaxed group-hover:text-text-main transition-colors">
                                  {rec}
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                      </div>

                      {/* THE POLISHED ASSET - IMPACT-DRIVEN VIEW */}
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                              <HiSparkles size={20} />
                            </div>
                            <h4 className="text-xl font-medium text-white tracking-tight">
                              Tailored Resume Content
                            </h4>
                          </div>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                selectedJob.polishedResume || "",
                              );
                            }}
                            className="bg-secondary/10 text-secondary border-none hover:bg-secondary/20 font-medium tracking-widest text-[0.6rem] uppercase"
                          >
                            <MdContentCopy className="mr-2" /> Copy Polished
                            Version
                          </Button>
                        </div>

                        <div className="relative group/asset">
                          {/* Decorative Corner Lights */}
                          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/40 rounded-tl-xl" />
                          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/40 rounded-tr-xl" />
                          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/40 rounded-bl-xl" />
                          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/40 rounded-br-xl" />

                          <div className="bg-[#020617] p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                            {/* Subtle scanline effect */}
                            <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/1 to-transparent pointer-events-none animate-scan opacity-20" />

                            {selectedJob.polishedResume ? (
                              <div className="prose prose-invert prose-emerald max-w-none text-text-muted font-medium leading-loose text-sm markdown-content">
                                <ReactMarkdown>
                                  {selectedJob.polishedResume}
                                </ReactMarkdown>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20">
                                  <MdAnalytics size={32} />
                                </div>
                                <p className="text-text-muted font-medium uppercase tracking-widest text-[0.6rem] opacity-50">
                                  Your tailored resume will appear here after
                                  analysis.
                                </p>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    analyzeJob(
                                      selectedJob._id,
                                      selectedJob.jobDescription,
                                    )
                                  }
                                  className="text-[0.6rem] font-medium uppercase tracking-widest px-6"
                                >
                                  Re-run Analysis
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </div>
            );
          })()}
        </Dialog>
      </Container>
    </Box>
  );
}
