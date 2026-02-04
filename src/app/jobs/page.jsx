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
} from "react-icons/md";
import Navbar from "@/components/Navbar";
import axiosInstance from "@/lib/axios";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Stack,
  alpha,
  Tooltip,
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

        {/* Jobs Table */}
        <TableContainer
          component={Paper}
          sx={{
            background: "rgba(30, 41, 59, 0.4)",
            backdropFilter: "blur(16px)",
            borderRadius: 3,
            border: "1px solid rgba(255, 255, 255, 0.05)",
            overflow: "hidden",
          }}
        >
          {loadingJobs ? (
            <Box sx={{ p: 12, textAlign: "center" }}>
              <CircularProgress size={32} />
            </Box>
          ) : jobs.length === 0 ? (
            <Box sx={{ p: 12, textAlign: "center" }}>
              <Box
                sx={{ fontSize: "4rem", color: alpha("#94a3b8", 0.2), mb: 3 }}
              >
                <LuBriefcaseBusiness />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                No jobs tracked yet
              </Typography>
              <Typography sx={{ color: "var(--text-muted)", mb: 4 }}>
                Start mapping your career journey today!
              </Typography>
              <Button onClick={() => setShowForm(true)}>
                Add Your First Job
              </Button>
            </Box>
          ) : (
            <Table>
              <TableHead sx={{ background: "rgba(255, 255, 255, 0.02)" }}>
                <TableRow>
                  <TableCell
                    sx={{
                      color: "var(--text-muted)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      fontSize: "0.75rem",
                      py: 3,
                    }}
                  >
                    Company & Position
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "var(--text-muted)",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      fontSize: "0.75rem",
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "var(--text-muted)",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      fontSize: "0.75rem",
                    }}
                  >
                    Match
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "var(--text-muted)",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      fontSize: "0.75rem",
                    }}
                  >
                    Applied Date
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: "var(--text-muted)",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      fontSize: "0.75rem",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow
                    key={job._id}
                    sx={{
                      "&:hover": { background: "rgba(255, 255, 255, 0.02)" },
                      transition: "background 0.2s",
                    }}
                  >
                    <TableCell>
                      <Typography sx={{ fontWeight: 800, color: "white" }}>
                        {job.company}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "var(--text-muted)" }}
                      >
                        {job.position}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={job.status}
                        color={getStatusColor(job.status)}
                        size="small"
                        sx={{ fontWeight: 700, borderRadius: 2 }}
                      />
                    </TableCell>
                    <TableCell>
                      {analyzingJobId === job._id ? (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <CircularProgress size={12} thickness={6} />
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 600, color: "var(--primary)" }}
                          >
                            Analyzing...
                          </Typography>
                        </Box>
                      ) : job.compatibilityScore ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedAnalysis(job);
                            setShowAnalysisModal(true);
                          }}
                          sx={{
                            background: "rgba(129, 140, 248, 0.1) !important",
                            color: "var(--primary)",
                            gap: 1,
                            minWidth: "auto",
                            px: 1.5,
                          }}
                        >
                          {job.compatibilityScore}% <MdAnalytics />
                        </Button>
                      ) : (
                        <Typography
                          variant="caption"
                          sx={{
                            color: "var(--text-muted)",
                            cursor: job.jobDescription ? "pointer" : "default",
                            "&:hover": job.jobDescription
                              ? { color: "var(--primary)" }
                              : {},
                          }}
                          onClick={() =>
                            job.jobDescription &&
                            analyzeJob(job._id, job.jobDescription)
                          }
                        >
                          {job.jobDescription ? "Click to Analyze" : "No Desc"}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell
                      sx={{ color: "var(--text-muted)", fontSize: "0.9rem" }}
                    >
                      {job.appliedDate
                        ? new Date(job.appliedDate).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => startEdit(job)}
                            sx={{
                              color: "var(--text-muted)",
                              "&:hover": { color: "var(--primary)" },
                            }}
                          >
                            <MdEdit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => deleteJob(job._id)}
                            sx={{
                              color: "var(--text-muted)",
                              "&:hover": { color: "#ef4444" },
                            }}
                          >
                            <MdDelete />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        {/* Stats Summary */}
        {jobs.length > 0 && (
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {[
              {
                label: "Total",
                value: jobs.length,
                color: "var(--text-muted)",
              },
              {
                label: "Applied",
                value: jobs.filter((j) => j.status === "Applied").length,
                color: "var(--primary)",
              },
              {
                label: "Interviewing",
                value: jobs.filter((j) => j.status === "Interviewing").length,
                color: "var(--secondary)",
              },
              {
                label: "Offered",
                value: jobs.filter((j) => j.status === "Offered").length,
                color: "#10b981",
              },
            ].map((stat, i) => (
              <Grid item xs={6} md={3} key={i}>
                <Paper
                  sx={{
                    p: 4,
                    textAlign: "center",
                    background: "rgba(255, 255, 255, 0.02)",
                    borderRadius: 2,
                    border: "1px solid rgba(255, 255, 255, 0.03)",
                  }}
                >
                  <Typography
                    sx={{
                      color: stat.color,
                      textTransform: "uppercase",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      mb: 1,
                      tracking: "0.1em",
                    }}
                  >
                    {stat.label}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    {stat.value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
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
            AI Job Analysis Result
            <IconButton
              onClick={() => setShowAnalysisModal(false)}
              sx={{ color: "var(--text-muted)" }}
            >
              <MdClose />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 4, pt: 2 }}>
            {selectedAnalysis && (
              <Stack spacing={4}>
                <Box
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    background: alpha("#818cf8", 0.1),
                    border: "1px solid rgba(129, 140, 248, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        color: "var(--primary)",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        fontSize: "0.75rem",
                        mb: 1,
                      }}
                    >
                      Compatibility Score
                    </Typography>
                    <Typography
                      variant="h2"
                      sx={{ fontWeight: 900, color: "var(--primary)" }}
                    >
                      {selectedAnalysis.compatibilityScore}%
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      border: "8px solid rgba(129, 140, 248, 0.1)",
                      borderTopColor: "var(--primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography sx={{ fontWeight: 900, fontSize: "1.2rem" }}>
                      {selectedAnalysis.compatibilityScore}
                    </Typography>
                  </Box>
                </Box>

                {selectedAnalysis.analysis && (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography
                        sx={{ fontWeight: 800, mb: 1, fontSize: "0.9rem" }}
                      >
                        Matching Skills
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {selectedAnalysis.analysis.matchingSkills?.map(
                          (skill, i) => (
                            <Chip
                              key={i}
                              label={skill}
                              size="small"
                              sx={{
                                background: alpha("#10b981", 0.1),
                                color: "#10b981",
                                fontWeight: 600,
                                border: "1px solid rgba(16, 185, 129, 0.1)",
                              }}
                            />
                          ),
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography
                        sx={{ fontWeight: 800, mb: 1, fontSize: "0.9rem" }}
                      >
                        Missing Skills
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {selectedAnalysis.analysis.missingSkills?.map(
                          (skill, i) => (
                            <Chip
                              key={i}
                              label={skill}
                              size="small"
                              sx={{
                                background: alpha("#ef4444", 0.1),
                                color: "#ef4444",
                                fontWeight: 600,
                                border: "1px solid rgba(239, 68, 68, 0.1)",
                              }}
                            />
                          ),
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                )}

                {selectedAnalysis.analysis?.recommendations && (
                  <Box>
                    <Typography sx={{ fontWeight: 800, mb: 2 }}>
                      Strategic Recommendations
                    </Typography>
                    <Stack spacing={2}>
                      {selectedAnalysis.analysis.recommendations.map(
                        (rec, i) => (
                          <Box
                            key={i}
                            sx={{
                              p: 2,
                              background: "rgba(255, 255, 255, 0.03)",
                              borderRadius: 2,
                              display: "flex",
                              gap: 2,
                            }}
                          >
                            <Typography
                              sx={{ color: "var(--primary)", fontWeight: 900 }}
                            >
                              {i + 1}.
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "var(--text-muted)",
                                lineHeight: 1.6,
                              }}
                            >
                              {rec}
                            </Typography>
                          </Box>
                        ),
                      )}
                    </Stack>
                  </Box>
                )}

                {selectedAnalysis.polishedResume && (
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography sx={{ fontWeight: 800 }}>
                        Tailored Resume Content
                      </Typography>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            selectedAnalysis.polishedResume,
                          );
                          alert("Copied to clipboard!");
                        }}
                      >
                        <MdContentCopy style={{ marginRight: 6 }} /> Copy Result
                      </Button>
                    </Box>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 3,
                        background: "#1e293b",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                        maxHeight: 400,
                        overflowY: "auto",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "monospace",
                          whiteSpace: "pre-wrap",
                          color: "var(--text-muted)",
                        }}
                      >
                        {selectedAnalysis.polishedResume}
                      </Typography>
                    </Paper>
                  </Box>
                )}
              </Stack>
            )}
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
}
