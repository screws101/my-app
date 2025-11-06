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
    const url = `https://web.ics.purdue.edu/~zong6/profile-app/fetch-data-with-id.php?id=${id}`;
    const response = await fetch(url, { cache: 'no-store' });
    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      return null;
    }

    if (data && data.id) {
      return data;
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
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <img
              src={profile.image_url}
              alt={profile.name}
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </div>

          <div style={{ textAlign: "center" }}>
            <h1 style={{ marginBottom: "0.5rem", color: "#333" }}>
              {profile.name}
            </h1>
            <h2 style={{ marginBottom: "1rem", color: "#666" }}>
              {profile.title}
            </h2>

            <div style={{ marginBottom: "1rem" }}>
              <strong>Email:</strong>
              <a
                href={`mailto:${profile.email}`}
                style={{
                  color: "#007bff",
                  textDecoration: "none",
                  marginLeft: "0.5rem",
                }}
              >
                {profile.email}
              </a>
            </div>

            {profile.bio && (
              <div style={{ marginTop: "1rem" }}>
                <strong>Bio:</strong>
                <p style={{ marginTop: "0.5rem", lineHeight: "1.6" }}>
                  {profile.bio}
                </p>
              </div>
            )}

            {profile.department && (
              <div style={{ marginTop: "1rem" }}>
                <strong>Department:</strong> {profile.department}
              </div>
            )}

            {profile.phone && (
              <div style={{ marginTop: "1rem" }}>
                <strong>Phone:</strong>
                <a
                  href={`tel:${profile.phone}`}
                  style={{
                    color: "#007bff",
                    textDecoration: "none",
                    marginLeft: "0.5rem",
                  }}
                >
                  {profile.phone}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

