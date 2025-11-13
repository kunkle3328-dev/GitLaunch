import React from 'react';

export const GitLaunchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15.5 13.5L18 21l-3-1.5L12 21l-3 1.5L6 21l2.5-7.5" />
    <path d="M9.5 13.5c-1.28-1.28-2-2.99-2-4.82 0-3.87 3.13-7 7-7 1.83 0 3.54.72 4.82 2" />
    <path d="M16 2.5c2.31 1.22 4 3.53 4 6.25" />
  </svg>
);
