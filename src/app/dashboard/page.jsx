"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { IoRocket } from "react-icons/io5";
import { GrDocumentText } from "react-icons/gr";
import { FaRegCalendarAlt } from "react-icons/fa";
import { LuBriefcaseBusiness } from "react-icons/lu";

import Navbar from "@/components/Navbar";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button as MuiButton,
  CircularProgress,
  Stack,
  alpha,
} from "@mui/material";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

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
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress color="primary" size={48} />
          <Typography
            sx={{ color: "var(--text-muted)", mt: 2, fontWeight: 500 }}
          >
            Loading your career dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!user) return null;

  const stats = [
    {
      label: "Total Resumes",
      value: "0",
      icon: <GrDocumentText />,
      color: "var(--primary)",
    },
    {
      label: "Jobs Tracked",
      value: "0",
      icon: <LuBriefcaseBusiness />,
      color: "var(--secondary)",
    },
    {
      label: "Interviews",
      value: "0",
      icon: <FaRegCalendarAlt />,
      color: "#a855f7",
    },
  ];

  const guideSteps = [
    {
      id: 1,
      title: "Upload Resume",
      desc: "Paste your resume text into our analyzer.",
      color: "#3b82f6",
    },
    {
      id: 2,
      title: "Get AI Feedback",
      desc: "Receive instant scoring and improvement tips.",
      color: "#2dd4bf",
    },
    {
      id: 3,
      title: "Track Jobs",
      desc: "Log every application and its current status.",
      color: "#a855f7",
    },
    {
      id: 4,
      title: "Improve Skills",
      desc: "Identify gaps based on job descriptions.",
      color: "#f59e0b",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "var(--background)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Navbar />

      {/* Background Decorative Elements */}
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
          top: "10%",
          left: "5%",
          width: "50%",
          height: "50%",
          borderRadius: "50%",
          background: "rgba(129, 140, 248, 0.05)",
          filter: "blur(130px)",
          zIndex: 0,
          animation: "pulse 10s infinite ease-in-out",
        }}
      />

      <Container
        maxWidth="lg"
        sx={{ pt: 16, pb: 12, position: "relative", zIndex: 1 }}
      >
        {/* Welcome Section */}
        <Box sx={{ mb: 8, textAlign: "center" }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 800, mb: 1, tracking: "-0.05em" }}
          >
            Welcome, {user.name.split(" ")[0]}!
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "var(--text-muted)", fontWeight: 500 }}
          >
            Ready to take the next step in your career journey?
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Quick Actions */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 5,
                height: "100%",
                borderRadius: 4,
                background: "rgba(30, 41, 59, 0.4)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "rgba(129, 140, 248, 0.2)",
                  background: "rgba(30, 41, 59, 0.6)",
                },
              }}
            >
              <Box
                sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    background: alpha("#818cf8", 0.1),
                    color: "#818cf8",
                    fontSize: "1.5rem",
                  }}
                >
                  <GrDocumentText />
                </Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, tracking: "-0.02em" }}
                >
                  Resume Analyzer
                </Typography>
              </Box>
              <Typography
                sx={{ color: "var(--text-muted)", mb: 4, lineHeight: 1.7 }}
              >
                Get professional, AI-powered feedback on your resume. We'll
                score your content and provide actionable tips to help you stand
                out.
              </Typography>
              <Link href="/resume" style={{ textDecoration: "none" }}>
                <Button size="lg" fullWidth>
                  Analyze New Resume
                </Button>
              </Link>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 5,
                height: "100%",
                borderRadius: 4,
                background: "rgba(30, 41, 59, 0.4)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "rgba(45, 212, 191, 0.2)",
                  background: "rgba(30, 41, 59, 0.6)",
                },
              }}
            >
              <Box
                sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    background: alpha("#2dd4bf", 0.1),
                    color: "#2dd4bf",
                    fontSize: "1.5rem",
                  }}
                >
                  <LuBriefcaseBusiness />
                </Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, tracking: "-0.02em" }}
                >
                  Job Tracker
                </Typography>
              </Box>
              <Typography
                sx={{ color: "var(--text-muted)", mb: 4, lineHeight: 1.7 }}
              >
                Stay organized throughout your job search. Track applications,
                interviews, and offers in one centralized, intelligent
                dashboard.
              </Typography>
              <Link href="/jobs" style={{ textDecoration: "none" }}>
                <Button variant="outline" size="lg" fullWidth>
                  Manage Applications
                </Button>
              </Link>
            </Paper>
          </Grid>

          {/* Quick Guide */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 6,
                borderRadius: 4,
                background: "rgba(30, 41, 59, 0.3)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: 800, mb: 6, tracking: "-0.02em" }}
              >
                Quick Getting Started Guide
              </Typography>
              <Grid container spacing={4}>
                {guideSteps.map((step) => (
                  <Grid item xs={12} sm={6} md={3} key={step.id}>
                    <Box sx={{ display: "flex", gap: 3 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          background: alpha(step.color, 0.1),
                          color: step.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 900,
                          fontSize: "1.2rem",
                          flexShrink: 0,
                        }}
                      >
                        {step.id}
                      </Box>
                      <Box>
                        <Typography
                          sx={{ fontWeight: 800, mb: 0.5, fontSize: "1.1rem" }}
                        >
                          {step.title}
                        </Typography>
                        <Typography
                          sx={{
                            color: "var(--text-muted)",
                            fontSize: "0.9rem",
                            lineHeight: 1.5,
                          }}
                        >
                          {step.desc}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* Mini Stats (Optional/Bottom) */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              {stats.map((stat, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      borderRadius: 4,
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.03)",
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: "1.8rem",
                        color: stat.color,
                        display: "flex",
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 900 }}>
                        {stat.value}
                      </Typography>
                      <Typography
                        sx={{
                          color: "var(--text-muted)",
                          fontSize: "0.85rem",
                          textTransform: "uppercase",
                          tracking: "0.1em",
                          fontWeight: 600,
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
