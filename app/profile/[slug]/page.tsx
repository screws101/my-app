import { notFound } from "next/navigation";
import Link from "next/link";
import Wrapper from "../../../components/Wrapper";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return {
    title: `Profile ${slug} - Profile App`,
    description: `View details for profile ${slug}`,
  };
}

async function getProfile(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/profiles`, { cache: 'no-store' });
    const data = await response.json();
    const profiles = data.data || data || [];
    
    const profile = Array.isArray(profiles) ? profiles.find((p: any) => 
      p.id === id || p.id === parseInt(id) || p.id?.toString() === id
    ) : null;
    
    if (profile && profile.id) {
      return profile;
    }
    return null;
  } catch (err) {
    return null;
  }
}

export default async function ProfileDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await getProfile(slug);

  if (!profile) {
    notFound();
  }

  return (
    <Wrapper>
      <div
        style={{
          maxWidth: "600px",
          margin: "2rem auto",
          padding: "2rem",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "0.5rem 1rem",
            backgroundColor: "#6c757d",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            marginBottom: "2rem",
          }}
        >
          ← Back to Profiles
        </Link>

        <div style={{ padding: "2rem" }}>
          <div style={{ textAlign: "center" }}>
            {profile.image_url && (
              <div style={{ marginBottom: "2rem", borderRadius: "8px", overflow: "hidden", display: "inline-block" }}>
                <img 
                  src={profile.image_url} 
                  alt={profile.name} 
                  style={{ width: "200px", height: "200px", objectFit: "cover" }}
                />
              </div>
            )}
            <h1 style={{ marginBottom: "0.5rem", color: "#333" }}>
              {profile.name}
            </h1>

            <div style={{ marginTop: "2rem", textAlign: "left", maxWidth: "400px", margin: "2rem auto" }}>
              <div style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                <strong>Title:</strong> {profile.title}
              </div>

              <div style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                <strong>Email:</strong> {profile.email}
              </div>

              <div style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                <strong>Bio:</strong> {profile.bio}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}


