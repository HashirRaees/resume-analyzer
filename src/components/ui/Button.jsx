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
      className={className}
      disabled={isLoading || props.disabled}
      color={variant === "danger" ? "error" : "primary"}
      sx={{
        ...(variant === "ghost" && {
          color: "var(--text-muted)",
          "&:hover": {
            color: "white",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
          },
        }),
        ...(variant === "outline" && {
          borderColor: "rgba(255, 255, 255, 0.1)",
          color: "white",
          "&:hover": {
            borderColor: "white",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
          },
        }),
        ...(variant === "primary" && {
          background: "var(--primary)",
          "&:hover": {
            background: "var(--primary-dark)",
          },
        }),
      }}
      {...props}
    >
      {isLoading ? <CircularProgress size={24} color="inherit" /> : children}
    </MuiButton>
  );
}
