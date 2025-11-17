import { notFound } from "next/navigation";
import Link from "next/link";
import { getBaseUrl } from "../../../../lib/getBaseUrl";
import Wrapper from "../../../../components/Wrapper";
import AddProfile from "../../../../components/AddProfile";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return {
    title: `Edit Profile ${slug} - Profile App`,
    description: `Edit profile ${slug}`,
  };
}

async function getProfile(id: string) {
  if (!id) {
    console.error('Profile ID is required');
    return null;
  }

  // First, try to fetch from database (for numeric IDs)
  const isNumericId = !isNaN(parseInt(id)) && isFinite(parseInt(id));
  
  if (isNumericId) {
    try {
      const profileId = parseInt(id);
      const dbProfile = await prisma.profiles.findUnique({
        where: { id: profileId }
      });
      
      if (dbProfile) {
        console.log(`Found profile ${id} in database for edit`);
        return {
          id: dbProfile.id.toString(),
          name: dbProfile.name,
          title: dbProfile.title,
          email: dbProfile.email,
          bio: dbProfile.bio,
          image_url: dbProfile.image_url
        };
      }
    } catch (err: any) {
      console.error(`Error fetching profile ${id} from database:`, err.message || err);
    }
  }
  
  // Fallback: fetch from external API and filter (for external profiles)
  try {
    // Fetch external profiles
    const externalResponse = await fetch(
      'https://web.ics.purdue.edu/~zong6/profile-app/fetch-data-with-filter.php?title=&name=&page=1&limit=100',
      { cache: 'no-store' }
    );
    
    let externalProfiles: any[] = [];
    if (externalResponse.ok) {
      const externalData = await externalResponse.json();
      if (externalData?.profiles && Array.isArray(externalData.profiles)) {
        externalProfiles = externalData.profiles;
      } else if (Array.isArray(externalData)) {
        externalProfiles = externalData;
      } else if (externalData?.data && Array.isArray(externalData.data)) {
        externalProfiles = externalData.data;
      }
    }
    
    // Also fetch database profiles
    let dbProfiles: any[] = [];
    try {
      const dbProfilesData = await prisma.profiles.findMany({
        orderBy: { createdAt: 'desc' }
      });
      dbProfiles = dbProfilesData.map(profile => ({
        id: profile.id.toString(),
        name: profile.name,
        title: profile.title,
        email: profile.email,
        bio: profile.bio,
        image_url: profile.image_url
      }));
    } catch (dbErr) {
      console.error('Error fetching database profiles:', dbErr);
    }
    
    // Combine both sources
    const allProfiles = [...dbProfiles, ...externalProfiles];
    
    const profile = allProfiles.find((p: any) => {
      if (!p || !p.id) return false;
      const pId = p.id?.toString();
      const searchId = id.toString();
      
      // Try exact match first
      if (pId === searchId) return true;
      
      // Try numeric comparison
      const pIdNum = parseInt(pId);
      const searchIdNum = parseInt(searchId);
      if (!isNaN(pIdNum) && !isNaN(searchIdNum) && pIdNum === searchIdNum) return true;
      
      return false;
    });
    
    if (profile && profile.id) {
      console.log(`Found profile for edit: ${profile.name} (ID: ${profile.id})`);
      return profile;
    }
    
    return null;
  } catch (err: any) {
    console.error('Error fetching profiles:', err.message || err);
    return null;
  }
}

export default async function EditProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  // Verify the profile ID is valid
  const id = Number(slug);
  if (!slug || isNaN(id)) {
    return (
      <Wrapper>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#d32f2f' }}>
          <h2>Invalid profile ID.</h2>
          <p>The profile ID must be a valid number.</p>
          <Link href="/" style={{ color: '#0077ff', textDecoration: 'underline' }}>
            Return to Home
          </Link>
        </div>
      </Wrapper>
    );
  }
  
  // Fetch profile from API to ensure we have the database ID
  let profile;
  try {
    const baseUrl = await getBaseUrl();
    const res = await fetch(`${baseUrl}/api/profiles/${id}`, {
      cache: "no-store"
    });
    
    if (!res.ok) {
      if (res.status === 404) {
        return (
          <Wrapper>
            <div style={{ textAlign: 'center', padding: '2rem', color: '#d32f2f' }}>
              <h2>Profile not found.</h2>
              <p>Could not load profile with ID {id}.</p>
              <Link href="/" style={{ color: '#0077ff', textDecoration: 'underline' }}>
                Return to Home
              </Link>
            </div>
          </Wrapper>
        );
      }
      throw new Error("Could not load profile.");
    }
    
    const data = await res.json();
    profile = data.data;
  } catch (error: any) {
    console.error('Error fetching profile for edit:', error);
    return (
      <Wrapper>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#d32f2f' }}>
          <h2>Error loading profile.</h2>
          <p>{error.message || 'Could not load profile.'}</p>
          <Link href="/" style={{ color: '#0077ff', textDecoration: 'underline' }}>
            Return to Home
          </Link>
        </div>
      </Wrapper>
    );
  }

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
          href={`/profile/${slug}`}
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
          ← Back to Profile
        </Link>
        <AddProfile 
          profileId={profile.id.toString()}
          initialData={{
            name: profile.name,
            title: profile.title,
            email: profile.email,
            bio: profile.bio,
            image_url: profile.image_url
          }}
        />
      </div>
    </Wrapper>
  );
}

