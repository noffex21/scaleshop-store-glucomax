import React from "react";

export function CartPlusIcon({ className = "", strokeWidth = 2 }: { className?: string, strokeWidth?: number | string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M3 5h2.5L8 15h9.5l2-8" />
      <path d="M10 9h4M12 7v4" />
      <circle cx="8.5" cy="19" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="19" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
