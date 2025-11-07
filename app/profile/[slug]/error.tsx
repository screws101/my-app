"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '2rem',
      maxWidth: '600px',
      margin: '2rem auto'
    }}>
      <h2 style={{ color: '#d32f2f', marginBottom: '1rem' }}>Failed to load profile</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>{error.message}</p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button
          onClick={() => reset()}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#6c63ff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Try again
        </button>
        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "0.5rem 1rem",
            backgroundColor: "#6c757d",
            color: "white",
            textDecoration: "none",
            borderRadius: "6px",
          }}
        >
          Back to Profiles
        </Link>
      </div>
    </div>
  );
}


