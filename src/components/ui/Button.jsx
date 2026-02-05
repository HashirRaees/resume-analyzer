"use client";

import React from "react";
import { Button as MuiButton, CircularProgress } from "@mui/material";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  isLoading = false,
  ...props
}) {
  // Map our custom variants to MUI variants
  const muiVariantMap = {
    primary: "contained",
    secondary: "outlined",
    outline: "outlined",
    ghost: "text",
    danger: "contained",
  };

  // Map our custom sizes to MUI sizes
  const muiSizeMap = {
    sm: "small",
    md: "medium",
    lg: "large",
  };

  return (
    <MuiButton
      variant={muiVariantMap[variant] || "contained"}
      size={muiSizeMap[size] || "medium"}
      className={`${className} transition-all duration-300 active:scale-95`}
      disabled={isLoading || props.disabled}
      color={variant === "danger" ? "error" : "primary"}
      sx={{
        borderRadius: "1rem",
        textTransform: "none",
        fontWeight: 800,
        letterSpacing: "0.025em",
        px: size === "lg" ? 6 : size === "md" ? 4 : 3,
        py: size === "lg" ? 2 : size === "md" ? 1.5 : 1,
        ...(variant === "ghost" && {
          color: "rgba(255, 255, 255, 0.4)",
          "&:hover": {
            color: "white",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.05)",
          },
        }),
        ...(variant === "outline" && {
          borderColor: "rgba(255, 255, 255, 0.1)",
          color: "white",
          "&:hover": {
            borderColor: "white",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            boxShadow: "0 0 25px rgba(255, 255, 255, 0.1)",
          },
        }),
        ...(variant === "primary" && {
          background:
            "linear-gradient(135deg, var(--primary), var(--primary-dark))",
          boxShadow: "0 10px 20px -10px rgba(99, 102, 241, 0.5)",
          "&:hover": {
            background: "linear-gradient(135deg, var(--primary), #4f46e5)",
            boxShadow: "0 15px 30px -12px rgba(99, 102, 241, 0.6)",
            transform: "translateY(-1px)",
          },
        }),
        ...(variant === "secondary" && {
          background: "rgba(255, 255, 255, 0.03)",
          color: "white",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          "&:hover": {
            background: "rgba(255, 255, 255, 0.07)",
            borderColor: "rgba(255, 255, 255, 0.2)",
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.05)",
          },
        }),
      }}
      {...props}
    >
      {isLoading ? (
        <CircularProgress size={20} color="inherit" strokeWidth={5} />
      ) : (
        children
      )}
    </MuiButton>
  );
}
