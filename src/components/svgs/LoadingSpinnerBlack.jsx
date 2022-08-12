import React from "react";

const LoadingSpinner = () => {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="spinner-secondHalf">
          <stop offset="0%" stopOpacity="0" stopColor="#00000" />
          <stop offset="100%" stopOpacity="0.5" stopColor="#00000" />
        </linearGradient>
        <linearGradient id="spinner-firstHalf">
          <stop offset="0%" stopOpacity="1" stopColor="#00000" />
          <stop offset="100%" stopOpacity="0.5" stopColor="#00000" />
        </linearGradient>
      </defs>

      <g strokeWidth="10">
        <path
          stroke="url(#spinner-secondHalf)"
          d="M 4 100 A 96 96 0 0 1 196 100"
        />
        <path
          stroke="url(#spinner-firstHalf)"
          d="M 196 100 A 96 96 0 0 1 4 100"
        />

        <path
          stroke="#00EAEA"
          strokeLinecap="round"
          d="M 4 100 A 96 96 0 0 1 4 98"
        />
      </g>

      <animateTransform
        from="0 0 0"
        to="360 0 0"
        attributeName="transform"
        type="rotate"
        repeatCount="indefinite"
        dur="1300ms"
      />
    </svg>
  );
};

export default LoadingSpinner;
