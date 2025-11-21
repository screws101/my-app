"use client";

import { memo } from "react";
import styles from "./card.module.css";
import Image from "next/image";

const Card = memo(({ name, title, email, bio, image_url }: { name: string; title: string; email: string; bio: string; image_url: string }) => {
  return (
    <div className={styles["profile-card"]}>
      <div className={styles["profile-card_content"]}>
        {image_url && (
          <div className={styles.imageWrapper}>
            <Image
              src={image_url}
              alt={name}
              fill
              className={styles.profileImg}
            />
          </div>
        )}
        <h2>{name}</h2>
        <p><strong>Title:</strong> {title}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Bio:</strong> {bio}</p>
      </div>
    </div>
  );
});

Card.displayName = 'Card';

export default Card;

