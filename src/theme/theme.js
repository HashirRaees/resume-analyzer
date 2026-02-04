"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#818cf8", // --primary
      dark: "#4f46e5",
      light: "#a5b4fc",
    },
    secondary: {
      main: "#2dd4bf", // --secondary
      dark: "#0d9488",
      light: "#99f6e4",
    },
    background: {
      default: "#0f172a", // --background
      paper: "#1e293b", // --surface
    },
    text: {
      primary: "#f8fafc", // --text-main
      secondary: "#94a3b8", // --text-muted
    },
    divider: "rgba(255, 255, 255, 0.05)",
  },
  typography: {
    fontFamily: "var(--font-body), sans-serif",
    h1: { fontFamily: "var(--font-heading), sans-serif", fontWeight: 800 },
    h2: { fontFamily: "var(--font-heading), sans-serif", fontWeight: 800 },
    h3: { fontFamily: "var(--font-heading), sans-serif", fontWeight: 800 },
    h4: { fontFamily: "var(--font-heading), sans-serif", fontWeight: 500 },
    h5: { fontFamily: "var(--font-heading), sans-serif", fontWeight: 500 },
    h6: { fontFamily: "var(--font-heading), sans-serif", fontWeight: 500 },
    button: {
      textTransform: "none",
      fontWeight: 600,
      fontFamily: "var(--font-heading), sans-serif",
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 9999, // Pill shape
          padding: "10px 24px",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-1px)",
          },
        },
        contained: {
          boxShadow: "0 10px 20px -5px rgba(129, 140, 248, 0.3)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.05)",
            },
            "&.Mui-focused": {
              backgroundColor: "rgba(255, 255, 255, 0.05)",
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#1e293b",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        },
      },
    },
  },
});

export default theme;
