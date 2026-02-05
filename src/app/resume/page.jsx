"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LiaClipboardListSolid } from "react-icons/lia";
import { GoTrophy } from "react-icons/go";
import { IoStatsChartOutline, IoSparklesOutline } from "react-icons/io5";
import { FaRegLightbulb } from "react-icons/fa6";
import { MdDelete, MdContentCopy } from "react-icons/md";
import Navbar from "@/components/Navbar";
import axiosInstance from "@/lib/axios";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  IconButton,
} from "@mui/material";
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
      setHistory(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch resume history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!resumeText.trim() || resumeText.trim().length < 50) {
      setError("Please enter at least 50 characters of resume text");
      return;
    }

    setError("");
    setAnalyzing(true);

    try {
      const response = await axiosInstance.post("/api/resume/analyze", {
        resumeText: resumeText.trim(),
      });

      if (!response.data.success)
        throw new Error(response.data.message || "Analysis failed");

      setResult(response.data.data);
      setResumeText("");
      setActiveTab("results");
      await fetchResumeHistory();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to analyze resume.",
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const deleteResume = async (id) => {
    if (!window.confirm("Delete this analysis?")) return;
    try {
      await axiosInstance.delete(`/api/resume/${id}`);
      if (result && result._id === id) setResult(null);
      await fetchResumeHistory();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete resume");
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
        overflowX: "hidden",
      }}
    >
      <Navbar />

      {/* Global Background Overlay */}
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
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          right: "-10%",
          width: "60%",
          height: "60%",
          borderRadius: "50%",
          background: "rgba(129, 140, 248, 0.04)",
          filter: "blur(130px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <Container
        maxWidth="lg"
        sx={{ pt: 16, pb: 12, position: "relative", zIndex: 1 }}
      >
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 800, mb: 1, tracking: "-0.05em" }}
          >
            Resume Analyzer
          </Typography>
          <Typography sx={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
            AI-powered insights to help you land your dream job.
          </Typography>
        </Box>

        {/* Tabs */}
        <Box
          sx={{ mb: 6, borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}
        >
          <Tabs
            value={activeTab}
            onChange={(e, v) => setActiveTab(v)}
            textColor="primary"
            indicatorColor="primary"
            sx={{
              "& .MuiTab-root": {
                fontWeight: 700,
                fontSize: "0.95rem",
                textTransform: "none",
                minWidth: 120,
                color: "var(--text-muted)",
                "&.Mui-selected": { color: "white" },
              },
            }}
          >
            <Tab label="Analyze" value="analyze" />
            <Tab label="History" value="history" />
            {result && <Tab label="Latest Results" value="results" />}
          </Tabs>
        </Box>

        {/* Analyze Tab */}
        {activeTab === "analyze" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
            <div className="lg:col-span-8 group relative">      
              <div className="relative p-8 md:p-10 rounded-2xl bg-[#0f172a]/80 backdrop-blur-3xl border border-white/5 shadow-2xl">
                <form onSubmit={handleAnalyze} className="space-y-8">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl border border-primary/20">
                      <IoSparklesOutline />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-white tracking-tight">
                        Intelligence Input
                      </h3>
                      <p className="text-xs mt-1 font-semibold text-text-muted uppercase tracking-widest">
                        Paste your resume content for deep analysis
                      </p>
                    </div>
                  </div>

                  <div className="relative group/input">
                    <textarea
                      placeholder="Paste your complete resume text here... AI will handle the rest."
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      className="w-full h-96 p-8 rounded-3xl bg-black/20 border border-white/5 text-text-muted font-medium font-mono text-sm leading-relaxed focus:outline-none focus:border-primary/30 focus:bg-black/40 transition-all resize-none placeholder:text-white/10"
                    />
                    <div className="absolute bottom-4 right-6 text-xs font-semibold text-text-muted/30 uppercase tracking-widest">
                      {resumeText.length} Characters Detected
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-bold animate-shake">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    fullWidth
                    isLoading={analyzing}
                    disabled={analyzing || resumeText.length < 50}
                    className="h-16 text-lg tracking-widest uppercase font-black"
                  >
                    Initialize Neural Analysis
                  </Button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
                <h4 className="text-lg font-black text-white mb-6 flex items-center gap-3">
                  <FaRegLightbulb className="text-amber-400" /> Strategic
                  Protocol
                </h4>
                <div className="space-y-6">
                  {[
                    "Quantify your impact with raw data points",
                    "Prioritize high-value action terminologies",
                    "Optimize for algorithmic parsing (ATS)",
                    "Maintain semantic clarity and structure",
                  ].map((tip, i) => (
                    <div key={i} className="flex gap-4 group/tip">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xs shrink-0 border border-emerald-500/20 group-hover/tip:scale-110 transition-transform">
                        {i + 1}
                      </div>
                      <p className="text-sm font-medium text-text-muted leading-relaxed group-hover/tip:text-white transition-colors">
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 rounded-2xl bg-primary/5 border border-primary/10 backdrop-blur-xl">
                <h4 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-2">
                  Power Status
                </h4>
                <p className="text-sm text-text-muted leading-relaxed">
                  Our advanced neural model has been trained on 500k+
                  high-performing resumes across 14 industries.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="relative z-10">
            {loadingHistory ? (
              <Box sx={{ p: 12, textAlign: "center" }}>
                <CircularProgress size={32} />
              </Box>
            ) : history.length === 0 ? (
              <div className="p-32 text-center rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl">
                <div className="text-8xl text-white/5 mb-8 flex justify-center">
                  <LiaClipboardListSolid />
                </div>
                <h3 className="text-3xl font-black text-white mb-4 tracking-tighter">
                  Chronicle Empty
                </h3>
                <p className="text-text-muted mb-10 font-medium max-w-sm mx-auto">
                  Your analysis evolution hasn't begun. Feed the neural model
                  your first resume.
                </p>
                <Button onClick={() => setActiveTab("analyze")} size="lg">
                  Initialize First Scan
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {history.map((item) => (
                  <div key={item._id} className="group relative">
                    <div className="absolute -inset-px rounded-3xl bg-linear-to-r from-primary/20 via-primary/40 to-primary/20" />
                    <div className="relative p-6 rounded-3xl bg-[#0f172a]/90 backdrop-blur-3xl border border-white/5 flex items-center gap-6">
                      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex flex-col items-center justify-center border border-primary/20 shrink-0">
                        <span className="text-2xl font-black text-primary leading-none">
                          {item.score}%
                        </span>
                        <span className="text-xs font-semibold text-primary/60 tracking-widest mt-1">
                          Score
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-white tracking-tight truncate">
                            Neural Scan #{item._id.slice(-4)}
                          </h4>
                          <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-text-muted font-medium tracking-wider border border-white/10 uppercase tracking-tighter leading-none shrink-0">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex gap-4 items-center">
                          <div className="flex items-center gap-1.5">
                            <IoStatsChartOutline className="text-secondary text-base" />
                            <span className="text-xs font-medium text-text-muted">
                              ATS Compliance: {item.atsScore}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <IconButton
                          size="small"
                          onClick={() => deleteResume(item._id)}
                          className="text-white/20 hover:text-rose-400 hover:bg-rose-500/10 transition-all rounded-xl p-2"
                        >
                          <MdDelete size={20} />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Results Tab */}
        {activeTab === "results" && result && (
          <div className="space-y-12 relative z-10 animate-fade-in">
            {/* Master Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative group overflow-hidden rounded-[3rem]">
                <div className="absolute -inset-px bg-linear-to-r from-primary to-primary/50 opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative p-10 bg-[#0f172a]/80 backdrop-blur-3xl border border-white/5 flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <svg className="w-48 h-48 transform -rotate-90">
                      <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={552.9}
                        strokeDashoffset={552.9 - (552.9 * result.score) / 100}
                        className="text-primary transition-all duration-1000 ease-out"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-black text-white">{result.score}%</span>
                      <span className="text-[0.6rem] font-black text-primary uppercase tracking-[0.2em] mt-1">Foundational</span>
                    </div>
                  </div>
                  <h4 className="text-xl font-black text-white tracking-tighter mb-2">Neural Content Score</h4>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest max-w-[200px]">Overall evaluation of your professional narrative</p>
                </div>
              </div>

              <div className="relative group overflow-hidden rounded-[3rem]">
                <div className="absolute -inset-px bg-linear-to-r from-secondary to-secondary/50 opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative p-10 bg-[#0f172a]/80 backdrop-blur-3xl border border-white/5 flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <svg className="w-48 h-48 transform -rotate-90">
                      <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={552.9}
                        strokeDashoffset={552.9 - (552.9 * result.atsScore) / 100}
                        className="text-secondary transition-all duration-1000 ease-out"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-black text-white">{result.atsScore}%</span>
                      <span className="text-[0.6rem] font-black text-secondary uppercase tracking-[0.2em] mt-1">Compliance</span>
                    </div>
                  </div>
                  <h4 className="text-xl font-black text-white tracking-tighter mb-2">ATS Machine Score</h4>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest max-w-[200px]">Algorithmic parsing and keyword synchronization</p>
                </div>
              </div>
            </div>

            {/* Strategic Roadmap */}
            <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 text-2xl border border-amber-500/20">
                  <FaRegLightbulb />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tighter">Improvement Directives</h3>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Actionable items to elevate your career assets</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.suggestions?.map((suggestion, i) => (
                  <div key={i} className="flex gap-6 p-6 rounded-3xl bg-white/[0.01] border border-white/[0.03] hover:bg-white/5 transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-black text-lg shrink-0 border border-amber-500/10 group-hover:scale-110 transition-transform">
                      {i + 1}
                    </div>
                    <p className="text-sm font-medium text-text-muted leading-loose group-hover:text-white transition-colors">
                      {suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Neural Polish Result */}
            {result.grammarFixes && (
              <div className="space-y-6">
                <div className="flex justify-between items-center px-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl border border-primary/20">
                      <IoSparklesOutline />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-tighter">Refined Asset Version</h3>
                      <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Optimized narrative by our proprietary AI model</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(result.grammarFixes);
                    }}
                    className="text-primary hover:bg-primary/10 gap-2 font-black uppercase tracking-widest py-3 px-6"
                  >
                    <MdContentCopy /> Copy Version
                  </Button>
                </div>

                <div className="p-10 rounded-[3rem] bg-[#020617] border border-white/5 shadow-inner relative group/code overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/code:opacity-20 transition-opacity">
                    <IoSparklesOutline className="text-8xl text-primary" />
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none text-text-muted font-mono leading-loose tracking-tight whitespace-pre-wrap">
                    {result.grammarFixes}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Container>
    </Box>
  );
}
