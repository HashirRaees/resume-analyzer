'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { IoBriefcaseSharp,IoRocket  } from "react-icons/io5";
import { GrDocumentText } from "react-icons/gr";
import { FaRegCalendarAlt,FaUser } from "react-icons/fa";

import Navbar from '@/components/Navbar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="text-gray-500 mt-4 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const stats = [
    { label: 'Total Resumes', value: '0', icon: {GrDocumentText}, color: 'bg-blue-100 text-blue-600' },
    { label: 'Jobs Tracked', value: '0', icon: {IoBriefcaseSharp}, color: 'bg-teal-100 text-teal-600' },
    { label: 'Interviews', value: '0', icon: {FaRegCalendarAlt}, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50/50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-10 flex flex-col text-center justify-center">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Welcome, {user.name.split(' ')[0]}!
            </h1>
            <p className="text-gray-500 mt-2 text-lg">
              Here's what's happening with your job search today.
            </p>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Resume Analyzer Card */}
            <Card className="p-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border ring-gray-100">
              <div className="relative z-10">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-3xl">
                  <GrDocumentText/>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Resume Analyzer</h3>
                <p className="text-gray-500 mb-8 max-w-sm">
                  Get AI-powered feedback on your resume to increase your chances of getting hired.
                </p>
                <Link href="/resume">
                  <Button size="lg" className="w-full sm:w-auto shadow-primary/25">
                    Analyze Resume
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Job Tracker Card */}
            <Card className="p-8 relative overflow-hidden border-1 group hover:shadow-2xl transition-all duration-300 border-0 ring-1 ring-gray-100">
              <div className="relative z-10">
                <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 text-3xl">
                  <IoBriefcaseSharp/>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Job Tracker</h3>
                <p className="text-gray-500 mb-8 max-w-sm">
                  Keep track of your applications, interviews, and offers in one organized place.
                </p>
                <Link href="/jobs">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto border-secondary/20 text-secondary hover:bg-secondary/5">
                    Track Applications
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Quick Guide Section */}
          <div className="grid grid-cols-1 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-8 h-full">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Getting Started Guide</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Upload Resume</h4>
                      <p className="text-sm text-gray-500 mt-1">Paste your resume text into the analyzer.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                    <div className="flex-shrink-0 w-10 h-10 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center font-bold">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Get AI Feedback</h4>
                      <p className="text-sm text-gray-500 mt-1">Receive instant scoring and improvement tips.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Track Jobs</h4>
                      <p className="text-sm text-gray-500 mt-1">Log every application and its status.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                    <div className="flex-shrink-0 w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">4</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Improve Skills</h4>
                      <p className="text-sm text-gray-500 mt-1">Identify gaps based on job descriptions.</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Profile Summary */}
            {/* <div className="lg:col-span-1">
              <Card className="p-8 h-full bg-gradient-to-br from-primary to-secondary text-white border-0">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-2xl backdrop-blur-sm">
                    <FaUser/>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{user.name}</h3>
                    <p className="text-gray-100 text-sm">{user.email}</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-gray-100 text-sm mb-1">Account Status</p>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                      <span className="font-medium text-green-300">Active Member</span>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-white/10">
                    <p className="text-gray-100 text-sm mb-4">Quick Stats</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 p-3 rounded-lg text-center">
                        <span className="block text-2xl font-bold">0</span>
                        <span className="text-xs text-gray-100">Resumes</span>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg text-center">
                        <span className="block text-2xl font-bold">0</span>
                        <span className="text-xs text-gray-100">Jobs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

