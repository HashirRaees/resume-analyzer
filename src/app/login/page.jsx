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
} from "@mui/material";
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100-vh",
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
          background: "rgba(129, 140, 248, 0.08)",
          filter: "blur(130px)",
          zIndex: 0,
          animation: "pulse 8s infinite ease-in-out",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-20%",
          right: "-10%",
          width: "70%",
          height: "70%",
          borderRadius: "50%",
          background: "rgba(45, 212, 191, 0.08)",
          filter: "blur(130px)",
          zIndex: 0,
          animation: "pulse 8s infinite ease-in-out reverse",
        }}
      />

      <Container maxWidth="xs" sx={{ position: "relative", zIndex: 1, py: 8 }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Box
            sx={{
              display: "inline-flex",
              p: 2,
              borderRadius: 4,
              background:
                "linear-gradient(135deg, var(--primary), var(--primary-dark))",
              boxShadow: "0 20px 40px -10px rgba(129, 140, 248, 0.3)",
              mb: 3,
              transform: "rotate(5deg)",
            }}
          >
            <Typography variant="h4" sx={{ color: "white", fontWeight: 800 }}>
              RM
            </Typography>
          </Box>
          <Typography variant="h3" sx={{ mb: 1, tracking: "0.05em" }}>
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign in to continue to your dashboard
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
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{ tracking: '2em',  mb: 1, fontWeight: 400 }}
              >
                Email Address
              </Typography>
              <TextField
                fullWidth
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                // InputProps={{
                //   startAdornment: (
                //     <InputAdornment position="start">
                //       <MdEmail style={{ color: "var(--text-muted)" }} />
                //     </InputAdornment>
                //   ),
                // }}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: 400 }}
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
                // InputProps={{
                  // startAdornment: (
                  //   <InputAdornment position="start">
                  //     <MdLock style={{ color: "var(--text-muted)" }} />
                  //   </InputAdornment>
                  // ),
                //   endAdornment: (
                //     <InputAdornment position="end">
                //       <IconButton
                //         size="small"
                //         onClick={() => setShowPassword(!showPassword)}
                //         edge="end"
                //       >
                //         {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                //       </IconButton>
                //     </InputAdornment>
                //   ),
                // }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ py: 2, fontSize: "1.1rem" }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>
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
              Don't have an account?{" "}
              <Link
                href="/register"
                style={{
                  color: "var(--primary)",
                  fontWeight: 400,
                  textDecoration: "none",
                }}
              >
                Create account
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
