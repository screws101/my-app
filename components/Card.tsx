"use client";

import { memo } from "react";
import styles from "./card.module.css";
import Image from "next/image";

const Card = memo(({ name, title, email, bio, image_url }: { name: string; title: string; email: string; bio: string; image_url: string }) => {
  return (
    <div className={styles["profile-card"]}>
      <div className={styles["profile-card_content"]}>
        {image_url && (
          <div style={{ marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden' }}>
            <Image 
              src={image_url} 
              alt={name} 
              width={200} 
              height={200}
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
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

