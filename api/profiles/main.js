import {PrismaClient} from '@prisma/client';
import { put } from "@vercel/blob";

const prisma = new PrismaClient();

export const runtime = 'nodejs';

export async function POST(request) {
    try{
        const formData = await request.formData();
        const name = formData.get('name');
        const title = formData.get('title');
        const email = formData.get('email');
        const bio = formData.get('bio');
        const img = formData.get('img');

        if(name || name.trim() === ''){
            return new Response('Name is required', {status: 400});
        }else if(title || title.trim() === ''){
            return new Response('Title is required', {status: 400});
        }else if(email || email.trim() === ''){
            return new Response('Email is required', {status: 400});
        }else if(bio || bio.trim() === ''){
            return new Response('Bio is required', {status: 400});
        }else if(img){
            return new Response('Image is required', {status: 400});
        }else if(img.size > 1024 * 1024){
            return new Response('Image size should be less than 1MB', {status: 400});
        }

        const blobResponse = await put(img.name, img{
            access: "public",
        })

        const profile = await prisma.profiles.create({
            data: {
                name: name.trim(),
                title: title.trim(),
                email: email.trim(),
                bio: bio.trim(),
                image_url: blob.url,
            }
        });
        return Response.json({data: profile}, {status: 201});

    } catch (error) {
        console.log(error)
        if(error.code === "P2828"){
            return Response.json({error: "Email Already Exists"}, {status: 409});
        }
        return Response.json({error: "Something went wrong"}, {status: 500});
}