'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { IoBriefcaseSharp,IoRocket  } from "react-icons/io5";
import { GrDocumentText } from "react-icons/gr";

import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="md:text-2xl text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ResumeAI
              </span>
            </div>
            <div className="flex items-center md:space-x-4">
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative border-b border-gray-200 pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight">
              Craft the Perfect Resume with <span className="text-primary">AI Power</span>
            </h1>
            <p className="md:text-xl text-gray-500 mb-10 leading-relaxed">
              Analyze your resume, track job applications, and land your dream job faster with our intelligent career assistant.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg shadow-xl shadow-primary/20">
                  Start Analyzing for Free
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg">
                  Existing User? Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50 animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to succeed</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Our platform provides comprehensive tools to streamline your job search process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 border">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6">
                <GrDocumentText />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Resume Analysis</h3>
              <p className="text-gray-500 leading-relaxed">
                Get instant, AI-driven feedback on your resume. Identify weak spots, improve wording, and optimize for ATS systems.
              </p>
            </Card>

            <Card className="p-8 border">
              <div className="w-14 h-14 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center text-3xl mb-6">
                <IoBriefcaseSharp />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Job Tracker</h3>
              <p className="text-gray-500 leading-relaxed">
                Keep all your applications organized in one place. Track status, interview dates, and notes for every opportunity.
              </p>
            </Card>

            <Card className="p-8 border">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-6">
                <IoRocket/>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Career Growth</h3>
              <p className="text-gray-500 leading-relaxed">
                Identify skill gaps based on job descriptions and get personalized recommendations to boost your career.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-200 border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-bold text-gray-900">ResumeAI</span>
            <p className="text-gray-500 text-sm mt-1">© 2024 ResumeAI. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-blue-400 hover:text-gray-600 transition-colors">Privacy Policy</a>
            <a href="#" className="text-blue-400 hover:text-gray-600 transition-colors">Terms of Service</a>
            <a href="#" className="text-blue-400 hover:text-gray-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
