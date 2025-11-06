import { Suspense } from "react";
import HomePageClient from "../../components/HomePageClient";

export const metadata = {
  title: "All Profiles - Profile App",
  description: "Browse and filter profiles",
};

export default function ProfilesPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <HomePageClient />
    </Suspense>
  );
}

