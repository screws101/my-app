"use client";

import { memo } from "react";
import styles from "./card.module.css";

const Card = memo(({ name, title, email, img }: { name: string; title: string; email: string; img: string }) => {
  return (
    <div className={styles["profile-card"]}>
      <div className={styles['profile-card_img']}>
        <img
          src={img}
          alt={name}
          style={{ width: "100px", height: "100px", borderRadius: "8px" }}
        />
      </div>
      <div className={styles["profile-card_content"]}>
        <h2>{name}</h2>
        <p>{title}</p>
        <p>
          <a href={`mailto:${email}`} onClick={(e) => e.stopPropagation()}>{email}</a>
        </p>
      </div>
    </div>
  );
});

Card.displayName = 'Card';

export default Card;

