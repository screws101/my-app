import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '2rem',
      maxWidth: '600px',
      margin: '2rem auto'
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#333' }}>404</h2>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#666' }}>
        The page you're looking for doesn't exist.
      </p>
      <Link
        href="/"
        style={{
          display: "inline-block",
          padding: "0.5rem 1rem",
          backgroundColor: "#6c63ff",
          color: "white",
          textDecoration: "none",
          borderRadius: "6px",
        }}
      >
        Return Home
      </Link>
    </div>
  );
}

