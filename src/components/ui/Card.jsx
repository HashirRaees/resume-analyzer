import React from "react";

export default function Card({
  children,
  className = "",
  glass = false,
  ...props
}) {
  return (
    <div
      className={`
        rounded-2xl 
        ${glass ? "glass" : "bg-surface border border-white/5"} 
        shadow-xl shadow-black/20 
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
