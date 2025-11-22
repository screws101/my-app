export const dynamic = "force-dynamic";

"use client";

import { Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import AuthForm from "@/components/AuthForm";

export default function SignInPage() {
  const params = useSearchParams();
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <AuthForm />
        <div style={{ textAlign: 'center', marginTop: '2rem', marginLeft: 'auto', marginRight: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
          <button
            onClick={() => signIn("github")}
            className="oauth-btn-github"
          >
            Sign in with GitHub
          </button>
          <button
            onClick={() => signIn("google")}
            className="oauth-btn-google"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </Suspense>
  );
}

