"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Grid,
} from "@mui/material";
import { MdEmail, MdLock, MdPerson } from "react-icons/md";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    // Password validation: 8+ characters, one numeric, and one special character
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters long and contain at least one numeric and one special character (!@#$%^&*)",
      );
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password, passwordConfirm);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
        position: "relative",
        overflow: "hidden",
        background: "var(--background)",
      }}
    >
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
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "70%",
          height: "70%",
          borderRadius: "50%",
          background: "rgba(45, 212, 191, 0.08)",
          filter: "blur(130px)",
          zIndex: 0,
          animation: "pulse 8s infinite ease-in-out",
        }}
      />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1, py: 6 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              display: "inline-flex",
              p: 2,
              borderRadius: 4,
              background: "linear-gradient(135deg, var(--secondary), #0d9488)",
              boxShadow: "0 20px 40px -10px rgba(45, 212, 191, 0.3)",
              mb: 3,
              transform: "rotate(-5deg)",
            }}
          >
            <Typography variant="h4" sx={{ color: "white", fontWeight: 800 }}>
              RM
            </Typography>
          </Box>
          <Typography variant="h3" sx={{ mb: 1, tracking: "-0.05em" }}>
            Create Account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Join Resume Analyzer today
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            background: "rgba(30, 41, 59, 0.5)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, ml: 1, fontWeight: 500 }}
                >
                  Full Name
                </Typography>
                <TextField
                  fullWidth
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MdPerson style={{ color: "var(--text-muted)" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, ml: 1, fontWeight: 500 }}
                >
                  Email Address
                </Typography>
                <TextField
                  fullWidth
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MdEmail style={{ color: "var(--text-muted)" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, ml: 1, fontWeight: 500 }}
                >
                  Password
                </Typography>
                <TextField
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MdLock style={{ color: "var(--text-muted)" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, ml: 1, fontWeight: 500 }}
                >
                  Confirm Password
                </Typography>
                <TextField
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MdLock style={{ color: "var(--text-muted)" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ py: 2, fontSize: "1.1rem", mt: 2 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>

          <Box
            sx={{
              mt: 4,
              pt: 3,
              textAlign: "center",
              borderTop: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Link
                href="/login"
                style={{
                  color: "var(--secondary)",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
