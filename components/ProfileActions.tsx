"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProfileActionsProps {
  profileId: string;
}

export default function ProfileActions({ profileId }: ProfileActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to delete this profile? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/profiles/${profileId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete profile");
      }

      // Redirect to home page after successful deletion
      router.push("/");
      router.refresh();
    } catch (error: any) {
      setError(error.message || "Failed to delete profile");
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
      <Link
        href={`/profile/${profileId}/edit`}
        style={{
          display: "inline-block",
          padding: "0.75rem 1.5rem",
          backgroundColor: "#0077ff",
          color: "white",
          textDecoration: "none",
          borderRadius: "8px",
          fontWeight: "500",
          transition: "background-color 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#005fcc";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#0077ff";
        }}
      >
        Edit Profile
      </Link>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: isDeleting ? "#ccc" : "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontWeight: "500",
          cursor: isDeleting ? "not-allowed" : "pointer",
          transition: "background-color 0.2s ease",
        }}
        onMouseEnter={(e) => {
          if (!isDeleting) {
            e.currentTarget.style.backgroundColor = "#c82333";
          }
        }}
        onMouseLeave={(e) => {
          if (!isDeleting) {
            e.currentTarget.style.backgroundColor = "#dc3545";
          }
        }}
      >
        {isDeleting ? "Deleting..." : "Delete Profile"}
      </button>
      {error && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "1rem",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            borderRadius: "8px",
            border: "1px solid #f5c6cb",
            zIndex: 1000,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

