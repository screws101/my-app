"use client";

import Header from "./Header";
import Toggle from "./Toggle";
import { useMode } from "../context/ModeContext";
import styles from "./header.module.css";

export default function HeaderWithToggle() {
  const { mode, changeMode } = useMode();
  
  return (
    <header className={styles["app-header"]}>
      <Header />
      <Toggle handleChange={changeMode} isChecked={mode === 'dark'} />
    </header>
  );
}

