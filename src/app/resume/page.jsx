"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LiaClipboardListSolid } from "react-icons/lia";
import { GoTrophy } from "react-icons/go";
import { IoStatsChartOutline, IoSparklesOutline } from "react-icons/io5";
import { FaRegLightbulb } from "react-icons/fa6";
import Navbar from "@/components/Navbar";
import axiosInstance from "@/lib/axios";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  TextField,
  CircularProgress,
  Stack,
  alpha,
  Divider,
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
          <Grid container spacing={4}>
            <Grid item xs={12} lg={8}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: "rgba(30, 41, 59, 0.4)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <form onSubmit={handleAnalyze}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                    Paste Your Resume Content
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={16}
                    variant="outlined"
                    placeholder="Paste your complete resume text here for deep AI analysis..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    error={!!error}
                    helperText={error || `${resumeText.length} characters`}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        fontFamily: "monospace",
                        fontSize: "0.9rem",
                        lineHeight: 1.6,
                        background: "rgba(0, 0, 0, 0.1)",
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    size="lg"
                    fullWidth
                    sx={{ mt: 4 }}
                    isLoading={analyzing}
                    disabled={analyzing || resumeText.length < 50}
                  >
                    Start AI Analysis
                  </Button>
                </form>
              </Paper>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Stack spacing={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 6,
                    background:
                      "linear-gradient(135deg, rgba(129, 140, 248, 0.05), rgba(45, 212, 191, 0.05))",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 900,
                      mb: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <FaRegLightbulb style={{ color: "#f59e0b" }} /> Expert Tips
                  </Typography>
                  <Stack spacing={3}>
                    {[
                      "Focus on measurable achievements (e.g. 'Reduced costs by 15%')",
                      "Use powerful action verbs (Managed, Spearheaded, Engineered)",
                      "Include keywords relevant to your target job titles",
                      "Keep formatting simple for better AI/ATS interpretation",
                    ].map((tip, i) => (
                      <Box key={i} sx={{ display: "flex", gap: 2 }}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            background: "rgba(16, 185, 129, 0.1)",
                            color: "#10b981",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.7rem",
                            fontWeight: 900,
                            flexShrink: 0,
                            mt: 0.3,
                          }}
                        >
                          ✓
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{ color: "var(--text-muted)", lineHeight: 1.5 }}
                        >
                          {tip}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 6,
              background: "rgba(30, 41, 59, 0.4)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            {loadingHistory ? (
              <Box sx={{ p: 8, textAlign: "center" }}>
                <CircularProgress size={32} />
              </Box>
            ) : history.length === 0 ? (
              <Box sx={{ p: 8, textAlign: "center" }}>
                <Box
                  sx={{ fontSize: "4rem", color: alpha("#94a3b8", 0.1), mb: 2 }}
                >
                  <LiaClipboardListSolid />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 4 }}>
                  No History Yet
                </Typography>
                <Button onClick={() => setActiveTab("analyze")}>
                  Start Analyzing
                </Button>
              </Box>
            ) : (
              <Stack spacing={3}>
                {history.map((item) => (
                  <Paper
                    key={item._id}
                    sx={{
                      p: 3,
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      borderRadius: 4,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        background: "rgba(255, 255, 255, 0.04)",
                        borderColor: "rgba(129, 140, 248, 0.2)",
                      },
                    }}
                  >
                    <Box>
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        sx={{ mb: 1 }}
                      >
                        <Typography sx={{ fontWeight: 800 }}>
                          Resume Analysis
                        </Typography>
                        <Chip
                          label={new Date(item.createdAt).toLocaleDateString()}
                          size="small"
                          variant="outlined"
                          sx={{
                            color: "var(--text-muted)",
                            borderColor: "rgba(255, 255, 255, 0.1)",
                            fontWeight: 700,
                          }}
                        />
                      </Stack>
                      <Stack direction="row" spacing={4}>
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "var(--text-muted)",
                              textTransform: "uppercase",
                              fontWeight: 700,
                              tracking: "0.05em",
                            }}
                          >
                            Overall
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: 900,
                              fontSize: "1.2rem",
                              color: "var(--primary)",
                            }}
                          >
                            {item.score}%
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "var(--text-muted)",
                              textTransform: "uppercase",
                              fontWeight: 700,
                              tracking: "0.05em",
                            }}
                          >
                            ATS Match
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: 900,
                              fontSize: "1.2rem",
                              color: "var(--secondary)",
                            }}
                          >
                            {item.atsScore}%
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteResume(item._id)}
                      sx={{
                        color: alpha("#ef4444", 0.6),
                        "&:hover": {
                          color: "#ef4444",
                          background: alpha("#ef4444", 0.1),
                        },
                      }}
                    >
                      Delete
                    </Button>
                  </Paper>
                ))}
              </Stack>
            )}
          </Paper>
        )}

        {/* Results Tab */}
        {activeTab === "results" && result && (
          <Stack spacing={4}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 5,
                    borderRadius: 6,
                    background:
                      "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: 200,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          textTransform: "uppercase",
                          fontSize: "0.75rem",
                          color: alpha("#fff", 0.8),
                          mb: 1,
                          tracking: "0.1em",
                        }}
                      >
                        Overall Content Score
                      </Typography>
                      <Typography variant="h2" sx={{ fontWeight: 900 }}>
                        {result.score}%
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        background: "rgba(255, 255, 255, 0.15)",
                        fontSize: "2rem",
                      }}
                    >
                      <GoTrophy />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      mt: 4,
                      height: 8,
                      borderRadius: 4,
                      background: "rgba(255, 255, 255, 0.2)",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        width: `${result.score}%`,
                        background: "white",
                        transition: "width 1s",
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 5,
                    borderRadius: 6,
                    background:
                      "linear-gradient(135deg, var(--secondary), #0d9488)",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: 200,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          textTransform: "uppercase",
                          fontSize: "0.75rem",
                          color: alpha("#fff", 0.8),
                          mb: 1,
                          tracking: "0.1em",
                        }}
                      >
                        ATS Score
                      </Typography>
                      <Typography variant="h2" sx={{ fontWeight: 900 }}>
                        {result.atsScore}%
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        background: "rgba(255, 255, 255, 0.15)",
                        fontSize: "2rem",
                      }}
                    >
                      <IoStatsChartOutline />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      mt: 4,
                      height: 8,
                      borderRadius: 4,
                      background: "rgba(255, 255, 255, 0.2)",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        width: `${result.atsScore}%`,
                        background: "white",
                        transition: "width 1s",
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            <Paper
              elevation={0}
              sx={{
                p: 5,
                borderRadius: 6,
                background: "rgba(30, 41, 59, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 900,
                  mb: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <FaRegLightbulb style={{ color: "#f59e0b" }} /> Improvement
                Suggestions
              </Typography>
              <Stack spacing={3}>
                {result.suggestions?.map((suggestion, i) => (
                  <Box
                    key={i}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background: "rgba(245, 158, 11, 0.05)",
                      border: "1px solid rgba(245, 158, 11, 0.1)",
                      display: "flex",
                      gap: 3,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#f59e0b",
                        fontWeight: 900,
                        fontSize: "1.2rem",
                      }}
                    >
                      {i + 1}.
                    </Typography>
                    <Typography
                      sx={{
                        color: "var(--text-muted)",
                        lineHeight: 1.7,
                        pt: 0.3,
                      }}
                    >
                      {suggestion}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>

            {result.grammarFixes && (
              <Paper
                elevation={0}
                sx={{
                  p: 5,
                  borderRadius: 6,
                  background: "rgba(30, 41, 59, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 900,
                    mb: 4,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <IoSparklesOutline style={{ color: "var(--primary)" }} />{" "}
                  Polished Resume Version
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 4,
                    background: "#1e293b",
                    borderRadius: 4,
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    maxHeight: 600,
                    overflowY: "auto",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "monospace",
                      whiteSpace: "pre-wrap",
                      color: "var(--text-muted)",
                      fontSize: "0.9rem",
                      lineHeight: 1.7,
                    }}
                  >
                    {result.grammarFixes}
                  </Typography>
                </Paper>
              </Paper>
            )}
          </Stack>
        )}
      </Container>
    </Box>
  );
}
