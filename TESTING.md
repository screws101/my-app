# Testing Lab 17

## Step 1: Set Up Environment Variables

Create a `.env` file in the `my-app` directory with the following variables:

```env
# Neon Database Connection
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"

# Vercel Blob Storage (for image uploads)
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token_here"
```

### Getting Your Database URL:
1. Go to your Neon dashboard
2. Select your project
3. Copy the connection string from the dashboard
4. It should look like: `postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require`

### Getting Your Vercel Blob Token:
1. Go to Vercel Dashboard → Your Project → Storage → Blob
2. Create a Blob store if you haven't already
3. Generate a Read-Write token
4. Copy the token to your `.env` file

## Step 2: Generate Prisma Client

Run this command to generate the Prisma client based on your schema:

```bash
cd my-app
npx prisma generate
```

## Step 3: Run Database Migrations

Apply the schema to your database:

```bash
npx prisma migrate dev
```

This will:
- Create the `Profiles` table in your Neon database
- Apply any pending migrations

## Step 4: Start the Development Server

```bash
npm run dev
```

The app should start on [http://localhost:3000](http://localhost:3000)

## Step 5: Test the Application

### Test 1: View Homepage (GET Profiles)
1. Open [http://localhost:3000](http://localhost:3000)
2. You should see the homepage with "All Profiles" heading
3. Initially, there should be no profiles (or you'll see "No profiles found")
4. Check the browser console for any errors

### Test 2: Add a Profile (POST Profile)
1. Navigate to [http://localhost:3000/add-profile](http://localhost:3000/add-profile)
2. Fill out the form:
   - **Name**: e.g., "John Doe"
   - **Title**: e.g., "Software Engineer"
   - **Email**: e.g., "john@example.com" (must be unique)
   - **Bio**: e.g., "Experienced developer with 5 years in web development"
   - **Image**: Upload an image file (PNG, JPEG, JPG, or GIF, max 1MB)
3. Click "Add Profile"
4. You should be redirected to the homepage
5. The new profile should appear on the homepage

### Test 3: Verify Profile Display
1. On the homepage, verify that:
   - The profile image is displayed
   - Name, Title, Email, and Bio are shown correctly
   - Multiple profiles can be displayed

### Test 4: Test Filtering
1. Use the "Select a title" dropdown to filter by title
2. Use the search box to search by name, title, or email
3. Click "Clear" to reset filters

### Test 5: Test API Routes Directly

You can also test the API routes directly using curl or a tool like Postman:

**GET Profiles:**
```bash
curl http://localhost:3000/api/profiles
```

**POST Profile (with form data):**
```bash
curl -X POST http://localhost:3000/api/profiles \
  -F "name=Jane Doe" \
  -F "title=Designer" \
  -F "email=jane@example.com" \
  -F "bio=Creative designer" \
  -F "img=@/path/to/image.jpg"
```

## Troubleshooting

### Issue: "Prisma Client not generated"
**Solution:** Run `npx prisma generate`

### Issue: "Database connection error"
**Solution:** 
- Check your `DATABASE_URL` in `.env`
- Verify your Neon database is running
- Ensure the connection string includes `?sslmode=require`

### Issue: "BLOB_READ_WRITE_TOKEN is not defined"
**Solution:**
- Make sure you've added `BLOB_READ_WRITE_TOKEN` to your `.env` file
- Restart the dev server after adding environment variables

### Issue: "Email already exists"
**Solution:** This is expected behavior - emails must be unique. Try a different email.

### Issue: Images not displaying
**Solution:**
- Check that images are uploading to Vercel Blob
- Verify `next.config.ts` has the correct image domain configuration
- Check browser console for image loading errors

### Issue: "Module not found: Can't resolve '@prisma/client'"
**Solution:** Run `npm install` to ensure all dependencies are installed

## Verify Database

You can also verify data in your database using Prisma Studio:

```bash
npx prisma studio
```

This opens a visual database browser at [http://localhost:5555](http://localhost:5555) where you can:
- View all profiles in the `Profiles` table
- See the data structure
- Verify that images are stored as URLs




