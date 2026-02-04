"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { IoRocket } from "react-icons/io5";
import { GrDocumentText } from "react-icons/gr";
import { LuBriefcaseBusiness } from "react-icons/lu";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

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

  return (
    <div className="min-h-screen bg-background text-text-main overflow-x-hidden selection:bg-primary/30 relative">
      {/* Global Background Image Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/bg-image.png')] opacity-[0.02] bg-cover bg-fixed pointer-events-none z-0"></div>

      {/* Navigation */}
      <nav className="fixed w-full z-50 glass border-b border-white/5 bg-background/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between h-24 items-center">
            <div className="shrink-0 flex items-center">
              <span className="text-xl md:text-2xl font-black text-gradient font-heading tracking-tighter">
                ResumeMind
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/login">
                <Button variant="ghost" className="font-heading text-sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button className="font-heading">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-40 pb-40 lg:pt-60 lg:pb-48 overflow-hidden">
        {/* Modern Dark Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-primary/10 blur-[130px] animate-pulse"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-secondary/10 blur-[130px] animate-pulse delay-1000"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-[0.02] bg-center"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-10 leading-[0.95] animate-fade-up opacity-0">
              Craft the Perfect Resume <br className="hidden md:block" />
              with <span className="text-gradient">AI Power</span>
            </h1>
            <p className="md:text-xl text-text-muted mb-16 leading-relaxed max-w-3xl mx-auto animate-fade-up delay-100 opacity-0 font-body">
              Analyze your resume, track job applications, and land your dream
              job faster with our intelligent career assistant.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-8 animate-fade-up delay-200 opacity-0">
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto font-heading font-semibold"
                >
                  Start Analyzing for Free
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto font-heading font-semibold"
                >
                  Existing User? Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-40 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-32 animate-fade-up delay-300 opacity-0">
            <h2 className="text-3xl md:text-4xl font-black mb-8 tracking-tighter">
              Everything you need to succeed
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto text-xl font-body leading-relaxed">
              Our platform provides comprehensive tools to streamline your job
              search process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            <Card
              className="p-12 border border-white/5 bg-surface/20 hover:bg-surface/40 transition-all duration-700 hover:scale-[1.03] hover:border-primary/20 group animate-fade-up delay-300 opacity-0 relative overflow-hidden"
              glass
            >
              <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-blue-500/10 text-blue-400 rounded-[2.5rem] flex items-center justify-center text-5xl mb-10 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-700 shadow-inner">
                  <GrDocumentText />
                </div>
                <h3 className="text-2xl font-black text-white mb-6 group-hover:text-blue-200 transition-colors tracking-tighter">
                  Resume Analysis
                </h3>
                <p className="text-text-muted leading-relaxed text-xl font-body opacity-80 group-hover:opacity-100 transition-opacity">
                  Get instant, AI-driven feedback on your resume. Identify weak
                  spots, improve wording, and optimize for ATS systems.
                </p>
              </div>
            </Card>

            <Card
              className="p-12 border border-white/5 bg-surface/20 hover:bg-surface/40 transition-all duration-700 hover:scale-[1.03] hover:border-secondary/20 group animate-fade-up delay-500 opacity-0 relative overflow-hidden"
              glass
            >
              <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-teal-500/10 text-teal-400 rounded-[2.5rem] flex items-center justify-center text-5xl mb-10 group-hover:scale-110 group-hover:bg-teal-500/20 transition-all duration-700 shadow-inner">
                  <LuBriefcaseBusiness />
                </div>
                <h3 className="text-2xl font-black text-white mb-6 group-hover:text-teal-200 transition-colors tracking-tighter">
                  Job Tracker
                </h3>
                <p className="text-text-muted leading-relaxed text-xl font-body opacity-80 group-hover:opacity-100 transition-opacity">
                  Keep all your applications organized in one place. Track
                  status, interview dates, and notes for every opportunity.
                </p>
              </div>
            </Card>

            <Card
              className="p-12 border border-white/5 bg-surface/20 hover:bg-surface/40 transition-all duration-700 hover:scale-[1.03] hover:border-indigo/20 group animate-fade-up delay-500 opacity-0 relative overflow-hidden"
              glass
            >
              <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-indigo/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-indigo-500/10 text-indigo-400 rounded-[2.5rem] flex items-center justify-center text-5xl mb-10 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-700 shadow-inner">
                  <IoRocket />
                </div>
                <h3 className="text-2xl font-black text-white mb-6 group-hover:text-indigo-200 transition-colors tracking-tighter">
                  Career Growth
                </h3>
                <p className="text-text-muted leading-relaxed text-xl font-body opacity-80 group-hover:opacity-100 transition-opacity">
                  Identify skill gaps based on job descriptions and get
                  personalized recommendations to boost your career.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-surface/30 backdrop-blur-md border-t border-white/5 py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center md:text-left">
            <span className="text-xl font-bold text-gradient font-heading tracking-tight">
              ResumeMind
            </span>
            <p className="text-text-muted text-lg mt-4 font-body opacity-60">
              Crafting careers with the precision of AI.
            </p>
            <p className="text-text-muted text-sm mt-8 font-body opacity-40">
              © 2026 ResumeMind. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-10">
            <a
              href="#"
              className="text-text-muted hover:text-white transition-all text-sm font-heading font-medium tracking-wide"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-text-muted hover:text-white transition-all text-sm font-heading font-medium tracking-wide"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-text-muted hover:text-white transition-all text-sm font-heading font-medium tracking-wide"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
