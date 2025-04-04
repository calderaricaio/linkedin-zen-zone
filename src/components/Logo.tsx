
import React from 'react';

const Logo: React.FC<{ size?: number }> = ({ size = 128 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="24" fill="#0A66C2" />
      <path d="M86 64C86 76.1503 76.1503 86 64 86C51.8497 86 42 76.1503 42 64C42 51.8497 51.8497 42 64 42C76.1503 42 86 51.8497 86 64Z" fill="white" />
      <path d="M101 64C101 53.5066 94.4934 47 84 47H44C33.5066 47 27 53.5066 27 64C27 74.4934 33.5066 81 44 81H84C94.4934 81 101 74.4934 101 64Z" fill="white" />
      <path d="M90 64C90 57.3726 84.6274 52 78 52H50C43.3726 52 38 57.3726 38 64C38 70.6274 43.3726 76 50 76H78C84.6274 76 90 70.6274 90 64Z" fill="#0A66C2" />
    </svg>
  );
};

export default Logo;
