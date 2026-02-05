"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) {
    return null;
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/resume", label: "Resume" },
    { href: "/jobs", label: "Jobs" },
  ];

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${scrolled ? "glass border-b border-white/5 bg-background/50 backdrop-blur-xl shadow-2xl shadow-black/20" : "bg-transparent"}
      `}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2 group">
            <span className="text-xl md:text-2xl font-extrabold text-gradient font-heading tracking-tighter transition-all duration-300 group-hover:opacity-80">
              ResumeMind
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center space-x-2 px-6 py-2.5 rounded-full transition-all duration-300 text-sm font-medium font-heading tracking-wide
                  ${
                    pathname === item.href
                      ? "bg-primary/10 text-primary shadow-inner shadow-primary/5"
                      : "text-text-muted hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-4 pl-6 border-l border-white/10">
              <div className="flex flex-col items-end">
                <span className="text-sm font-extrabold text-white font-heading tracking-tight leading-none mb-1">
                  {user.name}
                </span>
                <span className="text-[0.65rem] font-semibold text-primary uppercase tracking-widest opacity-80 leading-none">
                  Neural Member
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-extrabold border border-primary/20 glass-badge">
                {user.name.charAt(0)}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-rose-400 hover:text-rose-300 font-black uppercase tracking-widest text-base py-2 px-4 ml-2"
            >
              Log out
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-text-muted hover:bg-white/5 transition-colors"
          >
            {mobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden glass border-t border-white/5 shadow-2xl absolute w-full backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors
                  ${
                    pathname === item.href
                      ? "bg-primary/10 text-primary font-semibold"
                      : "hover:bg-white/5 text-text-muted transition-colors"
                  }
                `}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="border-t flex justify-between border-white/10 my-2 pt-2">
              <div className="px-4 py-2">
                <p className="text-sm font-semibold text-text-main">
                  {user.name}
                </p>
                <p className="text-xs text-text-muted">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-left px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium flex items-center space-x-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
