import { prisma } from '../../../../lib/prisma';
import { put } from '@vercel/blob';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const profileId = parseInt(id);
    
    console.log("GET REQUEST FOR ID:", profileId, "(original:", id, ")");
    
    if (!isNaN(profileId)) {
      try {
        const dbProfile = await prisma.profiles.findUnique({
          where: { id: profileId }
        });
        
        if (dbProfile) {
          console.log(`Found profile ${id} in database`);
          return Response.json({
            data: {
              id: dbProfile.id.toString(),
              name: dbProfile.name,
              title: dbProfile.title,
              email: dbProfile.email,
              bio: dbProfile.bio,
              image_url: dbProfile.image_url
            }
          }, { status: 200 });
        }
        console.log(`Profile ${id} not found in database, trying external API...`);
      } catch (err) {
        console.error(`Error fetching profile ${id} from database:`, err.message || err);
      }
    }
    
    try {
      const externalResponse = await fetch(
        'https://web.ics.purdue.edu/~zong6/profile-app/fetch-data-with-filter.php?title=&name=&page=1&limit=100',
        { cache: 'no-store' }
      );
      
      let externalProfiles = [];
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
      
      let dbProfiles = [];
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
      
      const allProfiles = [...dbProfiles, ...externalProfiles];
      
      console.log(`Searching for profile with ID: ${id} in ${allProfiles.length} profiles`);
      
      const profile = allProfiles.find((p) => {
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
        return Response.json({
          data: {
            id: profile.id.toString(),
            name: profile.name,
            title: profile.title,
            email: profile.email,
            bio: profile.bio,
            image_url: profile.image_url
          }
        }, { status: 200 });
      }
      
      return Response.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    } catch (err) {
      console.error('Error fetching profiles from external API:', err.message || err);
      return Response.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    return Response.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const profileId = Number(id);
    
    console.log("UPDATE REQUEST FOR ID:", profileId, "(original:", id, ")");
    
    if (!id || isNaN(profileId)) {
      return Response.json(
        { error: "Invalid profile id." },
        { status: 400 }
      );
    }
    
    let data;
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      data = await request.json();
    } else {
      const formData = await request.formData();
      const imgFile = formData.get('img');
      
      data = {
        name: formData.get('name'),
        title: formData.get('title'),
        email: formData.get('email'),
        bio: formData.get('bio'),
        image_url: formData.get('image_url'),
      };
      
      if (imgFile && imgFile instanceof File && imgFile.size > 0) {
        const blob = await put(imgFile.name, imgFile, {
          access: 'public',
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        data.image_url = blob.url;
      }
    }
    
    let existing = await prisma.profiles.findUnique({
      where: { id: profileId },
    });
    
    console.log("FETCH RESULT:", existing ? `Found profile: ${existing.name}` : "Profile not found in database");
    
    let externalProfile = null;
    if (!existing) {
      try {
        const externalResponse = await fetch(
          'https://web.ics.purdue.edu/~zong6/profile-app/fetch-data-with-filter.php?title=&name=&page=1&limit=100',
          { cache: 'no-store' }
        );
        
        let externalProfiles = [];
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
        
        externalProfile = externalProfiles.find((p) => {
          if (!p || !p.id) return false;
          const pId = p.id?.toString();
          const searchId = profileId.toString();
          if (pId === searchId) return true;
          const pIdNum = parseInt(pId);
          const searchIdNum = parseInt(searchId);
          if (!isNaN(pIdNum) && !isNaN(searchIdNum) && pIdNum === searchIdNum) return true;
          return false;
        });
        
        if (externalProfile) {
          console.log(`Found profile ${profileId} in external API: ${externalProfile.name}`);
        }
      } catch (err) {
        console.error('Error fetching from external API:', err);
      }
    }
    
    const getValue = (formValue, existingValue) => {
      if (formValue !== null && formValue !== undefined) {
        const trimmed = formValue.toString().trim();
        if (trimmed) return trimmed;
      }
      return existingValue || '';
    };
    
    const sourceProfile = existing || externalProfile;
    const mergedData = {
      name: getValue(data.name, sourceProfile?.name),
      title: getValue(data.title, sourceProfile?.title),
      email: getValue(data.email, sourceProfile?.email),
      bio: getValue(data.bio, sourceProfile?.bio),
      image_url: data.image_url || sourceProfile?.image_url || '',
    };
    
    if (!mergedData.name || mergedData.name.trim() === "") {
      return Response.json(
        { error: "Name field cannot be empty." },
        { status: 400 }
      );
    }
    
    if (!mergedData.title || mergedData.title.trim() === "") {
      return Response.json(
        { error: "Title field cannot be empty." },
        { status: 400 }
      );
    }
    
    if (!mergedData.email || mergedData.email.trim() === "") {
      return Response.json(
        { error: "Email field cannot be empty." },
        { status: 400 }
      );
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mergedData.email.trim())) {
      return Response.json(
        { error: "Email must be a valid email address." },
        { status: 400 }
      );
    }
    
    if (!mergedData.bio || mergedData.bio.trim() === "") {
      return Response.json(
        { error: "Bio field cannot be empty." },
        { status: 400 }
      );
    }
    
    const profileData = {
      name: mergedData.name.trim(),
      title: mergedData.title.trim(),
      email: mergedData.email.trim(),
      bio: mergedData.bio.trim(),
      image_url: mergedData.image_url || '',
    };
    
    let result;
    if (existing) {
      result = await prisma.profiles.update({
        where: { id: profileId },
        data: profileData,
      });
      console.log(`Updated profile ${profileId} in database`);
    } else {
      try {
        result = await prisma.profiles.create({
          data: {
            ...profileData,
          },
        });
        console.log(`Created new profile in database (requested ID: ${profileId}, actual ID: ${result.id})`);
      } catch (createError) {
        if (createError.code === 'P2002') {
          result = await prisma.profiles.create({
            data: profileData,
          });
          console.log(`Created new profile with auto-generated ID: ${result.id}`);
        } else {
          throw createError;
        }
      }
    }
    
    return Response.json(
      { message: existing ? 'Profile updated!' : 'Profile created!', data: result },
      { status: existing ? 200 : 201 }
    );
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    
    if (error.code === 'P2002') {
      return Response.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }
    
    return Response.json(
      { error: "Server error while updating profile." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const profileId = parseInt(id);
    
    if (isNaN(profileId)) {
      return Response.json(
        { error: 'Invalid profile ID' },
        { status: 400 }
      );
    }
    
    const existingProfile = await prisma.profiles.findUnique({
      where: { id: profileId }
    });
    
    if (!existingProfile) {
      return Response.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }
    
    await prisma.profiles.delete({
      where: { id: profileId }
    });
    
    return Response.json(
      { message: 'Profile deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting profile:', error);
    return Response.json(
      { error: 'Failed to delete profile' },
      { status: 500 }
    );
  }
}

