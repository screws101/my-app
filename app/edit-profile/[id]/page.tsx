import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { getBaseUrl } from "../../../lib/getBaseUrl";
import Wrapper from "../../../components/Wrapper";
import AddProfile from "../../../components/AddProfile";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return {
    title: `Edit Profile ${id} - Profile App`,
    description: `Edit profile ${id}`,
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
      console.log(`Profile ${id} not found in database`);
    } catch (err: any) {
      console.error(`Error fetching profile ${id} from database:`, err.message || err);
    }
  }
  
 
  try {
    const baseUrl = await getBaseUrl();
    const response = await fetch(`${baseUrl}/api/profiles/${id}`, { 
      cache: 'no-store' 
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.data) {
        console.log(`Found profile ${id} via API`);
        return data.data;
      }
    }
    
    console.log(`Profile ${id} not found via API: ${response.status}`);
    return null;
  } catch (err: any) {
    console.error(`Error fetching profile ${id} via API:`, err.message || err);
    return null;
  }
}

export default async function EditProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getProfile(id);

  if (!profile) {
    notFound();
  }

  return (
    <Wrapper>
      <AddProfile 
        profileId={id}
        initialData={{
          name: profile.name,
          title: profile.title,
          email: profile.email,
          bio: profile.bio,
          image_url: profile.image_url
        }}
      />
    </Wrapper>
  );
}

