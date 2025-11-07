"use client";

import { memo } from "react";
import styles from "./card.module.css";

const Card = memo(({ name, major, year, gpa }: { name: string; major: string; year: number; gpa: number }) => {
  return (
    <div className={styles["profile-card"]}>
      <div className={styles["profile-card_content"]}>
        <h2>{name}</h2>
        <p><strong>Major:</strong> {major}</p>
        <p><strong>Year:</strong> {year}</p>
        <p><strong>GPA:</strong> {gpa.toFixed(1)}</p>
      </div>
    </div>
  );
});

Card.displayName = 'Card';

export default Card;

