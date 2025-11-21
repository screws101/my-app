"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./AuthForm.module.css";

const stripTags = (s: any) => String(s ?? "").replace(/<\/?[^>]+>/g, "");

const AuthForm = () => {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/";

  const [isLogin, setIsLogin] = useState(true);
  const [data, setData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (callbackUrl !== "/") {
      setStatusMessage("Please sign in to continue");
    }
  }, [callbackUrl]);

  const handleToggle = () => {
    setIsLogin((prev) => !prev);
    setErrors("");
    setData({ email: "", password: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors("");
    setIsSubmitting(true);

    const email = stripTags(data.email);
    const password = stripTags(data.password);

    try {
      if (isLogin) {
        const result = await signIn("credentials", {
          redirect: true,
          callbackUrl,
          email,
          password,
        });

        if (result?.error) setErrors(result.error);
      } else {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const json = await res.json();

        if (json.error) {
          setErrors(json.error);
        } else {
          await signIn("credentials", {
            redirect: true,
            callbackUrl,
            email,
            password,
          });
        }
      }
    } catch {
      setErrors("Unexpected error. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className={styles.authWrapper}>
        <h1 className={styles.authHeader}>
          {isLogin ? "Sign In" : "Register"}
        </h1>
        <p className={styles.authSubtitle}>Welcome to Profile App</p>
      </div>
      <div className={styles.authCard}>
        {statusMessage && <p className={styles.statusMessage}>{statusMessage}</p>}

        <form className={styles.authForm} onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) =>
                setData({ ...data, email: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={data.password}
              onChange={(e) =>
                setData({ ...data, password: e.target.value })
              }
              required
            />
          </div>

          {errors && <p className={styles.error}>{errors}</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Processing..."
              : isLogin
              ? "Sign In"
              : "Register"}
          </button>
        </form>

        <div className={styles.toggle}>
          <button type="button" onClick={handleToggle}>
            {isLogin ? "Need an account?" : "Already have an account?"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

