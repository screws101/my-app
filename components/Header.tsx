"use client";

import { memo } from "react";
import styles from "./header.module.css";
import Link from "next/link";

const Header = memo(() => {
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
      </nav>
    </div>
  );
});

Header.displayName = 'Header';

export default Header;

