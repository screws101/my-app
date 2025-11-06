"use client";

import { useReducer, useRef, useEffect, useLayoutEffect } from "react";
import styles from './addProfile.module.css';
import { useRouter } from "next/navigation";
import { useProfile } from "../context/ProfileContext";
import { initialState, formReducer } from "../reducer/formReducer";

const stripTags = (s: string) => String(s ?? "").replace(/<\/?[^>]+>/g, "");
const trimCollapse = (s: string) => String(s ?? "").trim().replace(/\s+/g, " ");

const AddProfile = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const { values, errors, isSubmitting, success } = state;
  const { name, title, email, bio, img } = values;
  const router = useRouter();

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus();
    }
  }, []);

  useLayoutEffect(() => {
    if (nameRef.current) {
      const width = nameRef.current.offsetWidth;
      if (width < 400) {
        nameRef.current.style.padding = '10px';
      } else {
        nameRef.current.style.padding = '20px';
      }
    }
  }, []);

  const { addProfile } = useProfile();

  const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.target.name === "img") {
      const file = (event.target as HTMLInputElement).files?.[0];
      const isFileOK = file && file.size < 1024 * 1024;
      dispatch({ type: "SET_IMG", payload: isFileOK ? file : null });
    } else {
      const { name, value } = event.target;
      dispatch({ type: "SET_VALUES", payload: { name, value } });
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch({ type: "START_SUBMITTING" });
    try {
      const cleanedValues = {
        name: stripTags(trimCollapse(name)),
        title: stripTags(trimCollapse(title)),
        email: stripTags(trimCollapse(email)),
        bio: stripTags(bio).trim(),
        img: img,
      };
      addProfile(cleanedValues);
      dispatch({ type: "SUBMIT_SUCCESS" });
      setTimeout(() => {
        dispatch({ type: "CLEAR_SUCCESS" });
      }, 1000);
      event.currentTarget.reset();
      router.push("/");
    } catch (error) {
      dispatch({ type: "HAS_ERROR" });
    } finally {
      dispatch({ type: "FINISH_SUBMIT" });
    }
  };

  return (
    <div className={styles.container}>
      <h2>Add Profile</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input type="text" name="name" id="name" required value={name || ''} onChange={onChange} />

        <label htmlFor="title">Title:</label>
        <input type="text" name="title" id="title" required value={title || ''} onChange={onChange} />

        <label htmlFor="email">Email:</label>
        <input type="email" name="email" id="email" required value={email || ''} onChange={onChange} />

        <label htmlFor="bio">Bio:</label>
        <textarea name="bio" id="bio" placeholder="Add Bio..." required value={bio || ''} onChange={onChange}></textarea>

        <label htmlFor="img">Image:</label>
        <input ref={nameRef} type="file" name="img" id="img" required accept="image/png, image/jpeg, image/jpg, image/gif" onChange={onChange} />

        {errors && <p className={styles.error}>{errors}</p>}
        <button type="submit" disabled={isSubmitting}>Add Profile</button>
        {success && <p className={styles.success}>{success}</p>}
      </form>
    </div>
  );
};

export default AddProfile;

