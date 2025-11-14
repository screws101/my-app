// OLD STUDENT API - COMMENTED OUT
// import { profiles } from '../route.js';

// export async function PUT(request, {params}){
//     const newProfile = await request.json();
//     const {id} = await params;
//     try{
//         if(!newProfile.name || newProfile.name.trim() === ""){
//             return Response.json({error: "Name is required"}, {status: 400});
//         }else if(!newProfile.major || newProfile.major.trim() === ""){
//             return Response.json({error: "Major is required"}, {status: 400});
//         }else if(!newProfile.year || isNaN(newProfile.year) || (newProfile.year < 1 || newProfile.year > 4)){
//             return Response.json({error: "Valid Year is required"}, {status: 400});
//         }else if(!newProfile.gpa || isNaN(newProfile.gpa) || (newProfile.gpa < 0 || (newProfile.gpa > 4))){
//             return Response.json({error: "Valid GPA is required"}, {status: 400});
//         }
//         const index = profiles.findIndex(profile => profile.id === parseInt(id));
//         if(index === -1){
//             return Response.json({error: "Profile not found", profiles}, {status:404});
//         }
//         profiles[index] = {
//             ...profiles[index],
//             ...newProfile,
//             id: profiles[index].id
//         };
//         return Response.json(profiles[index], {status:200});
//     }catch(error){
//         return Response.json({error: "Invalid data format:"}, {status: 400});
//     }
// }