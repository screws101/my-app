import { Suspense } from "react";
import { auth } from "@/lib/auth";
import AuthForm from "@/components/AuthForm";
import Wrapper from "../components/Wrapper";
import HomePageClient from "../components/HomePageClient";

export const metadata = {
  title: "Home - Profile App",
  description: "Welcome to the Profile App",
};

export default async function HomePage() {
  const session = await auth();

  return (
    <Wrapper>
      {!session ? (
        <Suspense fallback={<div>Loading...</div>}>
          <AuthForm />
        </Suspense>
      ) : (
        <HomePageClient />
      )}
    </Wrapper>
  );
}
