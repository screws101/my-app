import { prisma } from '../../../lib/prisma';
import { put } from '@vercel/blob';

export async function GET(request) {
  let dbProfiles = [];
  let externalProfiles = [];

  // Fetch profiles from database
  try {
    dbProfiles = await prisma.profiles.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (dbError) {
    console.error('Error fetching database profiles:', dbError);
    // Continue without database profiles if query fails
  }

  // Fetch profiles from external API
  try {
    const externalResponse = await fetch(
      'https://web.ics.purdue.edu/~zong6/profile-app/fetch-data-with-filter.php?title=&name=&page=1&limit=100',
      { 
        cache: 'no-store'
      }
    );
    
    if (externalResponse.ok) {
      const externalData = await externalResponse.json();
      // Handle different possible response formats
      if (externalData?.profiles && Array.isArray(externalData.profiles)) {
        externalProfiles = externalData.profiles;
      } else if (Array.isArray(externalData)) {
        externalProfiles = externalData;
      } else if (externalData?.data && Array.isArray(externalData.data)) {
        externalProfiles = externalData.data;
      }
    }
  } catch (externalError) {
    console.error('Error fetching external profiles:', externalError);
    // Continue without external profiles if fetch fails
  }

  // Merge profiles: database profiles first, then external profiles
  // Convert database profiles to match expected format
  const formattedDbProfiles = dbProfiles.map(profile => ({
    id: profile.id.toString(),
    name: profile.name,
    title: profile.title,
    email: profile.email,
    bio: profile.bio,
    image_url: profile.image_url
  }));

  // Combine both sources
  const allProfiles = [...formattedDbProfiles, ...externalProfiles];
  
  return Response.json({ data: allProfiles }, { status: 200 });
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name');
    const title = formData.get('title');
    const email = formData.get('email');
    const bio = formData.get('bio');
    const imgFile = formData.get('img');
    
    // Validation
    if (!name || !title || !email || !bio || !imgFile) {
      return Response.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Upload image to Vercel Blob
    let imageUrl = '';
    if (imgFile && imgFile instanceof File) {
      const blob = await put(imgFile.name, imgFile, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      imageUrl = blob.url;
    }
    
    // Create profile in database
    const newProfile = await prisma.profiles.create({
      data: {
        name: name.trim(),
        title: title.trim(),
        email: email.trim(),
        bio: bio.trim(),
        image_url: imageUrl,
      },
    });
    
    // Return the full record (must return the actual DB id)
    return Response.json(newProfile, { status: 201 });
  } catch (error) {
    console.error('Error creating profile:', error);
    
    // Handle unique constraint violation (duplicate email)
    if (error.code === 'P2002') {
      return Response.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }
    
    return Response.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    );
  }
}

