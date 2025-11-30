import React from 'react';

export default function Card({ children, className = '', glass = false, ...props }) {
  return (
    <div 
      className={`
        rounded-2xl 
        ${glass ? 'glass' : 'bg-white'} 
        shadow-xl shadow-gray-200/50 
        border border-gray-300
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
