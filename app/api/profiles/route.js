import { prisma } from "../../../lib/prisma";
import { put } from "@vercel/blob";

export async function GET() {
  try {
    const profiles = await prisma.profiles.findMany({
      orderBy: { createdAt: "desc" }
    });

    return Response.json({ data: profiles }, { status: 200 });
  } catch (err) {
    console.error("Error fetching profiles:", err);
    return Response.json(
      { error: "Failed to fetch profiles" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name');
    const title = formData.get('title');
    const email = formData.get('email');
    const bio = formData.get('bio');
    const file = formData.get('img');
    
    if (!name || !title || !email || !bio || !file) {
      return Response.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    let imageUrl = '';
    if (file && file instanceof File) {
      const { url } = await put(
        `profile-${Date.now()}.png`,
        file,
        { access: "public" }
      );
      imageUrl = url;
    }
    
    const newProfile = await prisma.profiles.create({
      data: {
        name: name.trim(),
        title: title.trim(),
        email: email.trim(),
        bio: bio.trim(),
        image_url: imageUrl,
      },
    });
    
    return Response.json(newProfile, { status: 201 });
  } catch (error) {
    console.error('Error creating profile:', error);
    
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
