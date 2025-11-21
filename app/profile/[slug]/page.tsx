import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "../../../lib/prisma";
import Wrapper from "../../../components/Wrapper";
import ProfileActions from "../../../components/ProfileActions";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return {
    title: `Profile ${slug} - Profile App`,
    description: `View details for profile ${slug}`,
  };
}

async function getProfile(id: string) {
  if (!id) {
    console.error('Profile ID is required');
    return null;
  }

 
  const isNumericId = !isNaN(parseInt(id)) && isFinite(parseInt(id));
  
  if (isNumericId) {
    try {
      const profileId = parseInt(id);
      const dbProfile = await prisma.profiles.findUnique({
        where: { id: profileId }
      });
      
      if (dbProfile) {
        console.log(`Found profile ${id} in database`);
        return {
          id: dbProfile.id.toString(),
          name: dbProfile.name,
          title: dbProfile.title,
          email: dbProfile.email,
          bio: dbProfile.bio,
          image_url: dbProfile.image_url,
          isDatabaseProfile: true
        };
      }
      console.log(`Profile ${id} not found in database, trying external API...`);
    } catch (err: any) {
      console.error(`Error fetching profile ${id} from database:`, err.message || err);
     
    }
  }
  
 
  try {
   
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
        image_url: profile.image_url,
        isDatabaseProfile: true
      }));
    } catch (dbErr) {
      console.error('Error fetching database profiles:', dbErr);
    }
    
   
    const allProfiles = [...dbProfiles, ...externalProfiles];
    
    console.log(`Searching for profile with ID: ${id} in ${allProfiles.length} profiles`);
    
    const profile = allProfiles.find((p: any) => {
      if (!p || !p.id) return false;
      const pId = p.id?.toString();
      const searchId = id.toString();
      
     
      if (pId === searchId) return true;
      
     
      const pIdNum = parseInt(pId);
      const searchIdNum = parseInt(searchId);
      if (!isNaN(pIdNum) && !isNaN(searchIdNum) && pIdNum === searchIdNum) return true;
      
      return false;
    });
    
    if (profile && profile.id) {
      console.log(`Found profile: ${profile.name} (ID: ${profile.id})`);
     
      return {
        ...profile,
        isDatabaseProfile: (profile as any).isDatabaseProfile === true
      };
    }
    
    console.log(`Profile with ID ${id} not found. Available IDs (first 5):`, allProfiles.slice(0, 5).map((p: any) => p.id));
    return null;
  } catch (err: any) {
    console.error('Error fetching profiles:', err.message || err);
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
                <Image 
                  src={profile.image_url} 
                  alt={profile.name} 
                  width={200}
                  height={200}
                  style={{ objectFit: "cover" }}
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
            
            {profile.id && (
              <ProfileActions profileId={profile.id.toString()} />
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
}


