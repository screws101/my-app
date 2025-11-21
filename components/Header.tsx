"use client";

import { memo } from "react";
import styles from "./header.module.css";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const Header = memo(() => {
  const { data: session, status } = useSession();

  return (
    <div className="header">
      <nav className="nav">
        <ul className={styles['nav-list']}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/profiles">All Profiles</Link>
          </li>
          <li>
            <Link href="/add-profile">Add Profile</Link>
          </li>
        </ul>
        <div>
          {status === "loading" && <span>Loading...</span>}
          {session ? (
            <>
              <span>{session.user.email}</span>
              <button onClick={() => signOut({ callbackUrl: "/" })}>
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/">Sign In</Link>
          )}
        </div>
      </nav>
    </div>
  );
});

Header.displayName = 'Header';

export default Header;

