import { prisma } from "../../../../lib/prisma";


import { put } from '@vercel/blob';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const profileId = parseInt(id);
    
    if (isNaN(profileId)) {
      return Response.json(
        { error: 'Invalid profile ID' },
        { status: 400 }
      );
    }
    
    const profile = await prisma.profiles.findUnique({
      where: { id: profileId }
    });
    
    if (!profile) {
      return Response.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }
    
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
        const { url } = await put(
          `profile-${Date.now()}.png`,
          imgFile,
          { access: "public" }
        );
        data.image_url = url;
      }
    }
    
    const existing = await prisma.profiles.findUnique({
      where: { id: profileId },
    });
    
    if (!existing) {
      return Response.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }
    
    const mergedData = {
      name: data.name?.trim() || existing.name,
      title: data.title?.trim() || existing.title,
      email: data.email?.trim() || existing.email,
      bio: data.bio?.trim() || existing.bio,
      image_url: data.image_url || existing.image_url || '',
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
    
    const result = await prisma.profiles.update({
      where: { id: profileId },
      data: profileData,
    });
    
    return Response.json(
      { message: 'Profile updated!', data: result },
      { status: 200 }
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

