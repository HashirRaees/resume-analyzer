"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GrDocumentText } from "react-icons/gr";
import { FaRegCalendarAlt } from "react-icons/fa";
import { LuBriefcaseBusiness } from "react-icons/lu";

import Navbar from "@/components/Navbar";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button as MuiButton,
  CircularProgress,
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

  const welcomeRef = useRef(null);
  const mainCardsRef = useRef([]);
  const guideRef = useRef(null);

  useEffect(() => {
    if (loading || !user) return;

    gsap.registerPlugin(ScrollTrigger);

    // Welcome Header Animation
    gsap.fromTo(
      welcomeRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
    );

    // Main Action Cards Reveal
    gsap.fromTo(
      mainCardsRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.3,
      },
    );

    // Guide Steps Stagger
    if (guideRef.current) {
      gsap.fromTo(
        guideRef.current.children,
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: guideRef.current,
            start: "top 90%",
          },
        },
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [loading, user]);

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
        <Box sx={{ mb: 8, textAlign: "center" }} ref={welcomeRef}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 800, mb: 1, tracking: "-0.05em" }}
          >
            Welcome, {user.name.split(" ")[0]}!
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "var(--text-muted)", fontWeight: 400 }}
          >
            Ready to take the next step in your career journey?
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Quick Actions */}
          <Grid item xs={12} md={6}>
            <div
              ref={(el) => (mainCardsRef.current[0] = el)}
              className="group relative h-full"
            >
              {/* Animated Light Beam Border Effect */}
              <div className="absolute -inset-px bg-linear-to-r from-primary/50 to-secondary/50 rounded-3xl" />

              <div className="relative h-full p-8 md:p-10 rounded-3xl bg-[#0f172a]/80 backdrop-blur-3xl border border-white/5 flex flex-col">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl text-primary border border-primary/20">
                    <GrDocumentText />
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold tracking-tighter text-white">
                      Resume Analyzer
                    </h3>
                    <p className="text-sm text-text-muted font-medium">
                      AI-powered feedback
                    </p>
                  </div>
                </div>

                <p className="text-text-muted text-lg leading-relaxed mb-auto">
                  Get professional, AI-powered feedback on your resume. We'll
                  score your content and provide actionable tips to help you
                  stand out.
                </p>

                <div className="mt-10">
                  <Link href="/resume" className="no-underline">
                    <Button
                      size="lg"
                      fullWidth
                      className="group-hover:shadow-[0_0_20px_rgba(129,140,248,0.4)] transition-all duration-500"
                    >
                      Analyze New Resume
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Grid>

          <Grid item xs={12} md={6}>
            <div
              ref={(el) => (mainCardsRef.current[1] = el)}
              className="group relative h-full"
            >
              {/* Animated Light Beam Border Effect */}
              <div className="absolute -inset-px bg-linear-to-r from-secondary/50 to-primary/50 rounded-3xl" />

              <div className="relative h-full p-8 md:p-10 rounded-3xl bg-[#0f172a]/80 backdrop-blur-3xl border border-white/5 flex flex-col">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-3xl text-secondary border border-secondary/20">
                    <LuBriefcaseBusiness />
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold tracking-tighter text-white">
                      Job Tracker
                    </h3>
                    <p className="text-sm text-text-muted font-medium">
                      Career management
                    </p>
                  </div>
                </div>

                <p className="text-text-muted text-lg leading-relaxed mb-auto">
                  Stay organized throughout your job search. Track applications,
                  interviews, and offers in one centralized, intelligent
                  dashboard.
                </p>

                <div className="mt-10">
                  <Link href="/jobs" className="no-underline">
                    <Button
                      variant="outline"
                      size="lg"
                      fullWidth
                      className="group-hover:border-secondary/50 group-hover:text-secondary group-hover:shadow-[0_0_20px_rgba(45,212,191,0.2)] transition-all duration-500"
                    >
                      Manage Applications
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Grid>

          <Grid item xs={12}>
            <div className="relative p-8 md:p-12 rounded-3xl bg-[#0f172a]/40 backdrop-blur-2xl border border-white/5 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10" />

              <h3 className="text-3xl font-extrabold tracking-tighter text-white mb-10 text-center">
                Quick <span className="text-gradient">Getting Started</span>{" "}
                Guide
              </h3>

              <div
                ref={guideRef}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {guideSteps.map((step) => (
                  <div
                    key={step.id}
                    className="group flex items-center text-center flex-col gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all duration-300"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl"
                      style={{
                        backgroundColor: alpha(step.color, 0.1),
                        color: step.color,
                        border: `1px solid ${alpha(step.color, 0.2)}`,
                      }}
                    >
                      {step.id}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-white mb-1 transition-colors group-hover:text-primary">
                        {step.title}
                      </h4>
                      <p className="text-sm text-text-muted leading-relaxed font-medium group-hover:text-text-main transition-colors">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Grid>

          {/* <Grid item xs={12}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="group relative">
                  <div className="absolute -inset-[1px] bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-6 transition-all duration-300 group-hover:bg-white/[0.05] group-hover:-translate-y-1">
                    <div className="text-3xl transition-transform duration-500 group-hover:scale-125" style={{ color: stat.color }}>
                      {stat.icon}
                    </div>
                    <div>
                      <div className="text-3xl font-black text-white mb-0.5">{stat.value}</div>
                      <div className="text-[0.7rem] font-bold text-text-muted uppercase tracking-[0.2em]">{stat.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Grid> */}
        </Grid>
      </Container>
    </Box>
  );
}
