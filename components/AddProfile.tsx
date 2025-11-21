"use client";

import { useReducer, useRef, useEffect, useLayoutEffect } from "react";
import styles from './addProfile.module.css';
import { useRouter } from "next/navigation";
import { initialState, formReducer } from "../reducer/formReducer";

const stripTags = (s: string) => String(s ?? "").replace(/<\/?[^>]+>/g, "");
const trimCollapse = (s: string) => String(s ?? "").trim().replace(/\s+/g, " ");

interface AddProfileProps {
  profileId?: string;
  initialData?: {
    name: string;
    title: string;
    email: string;
    bio: string;
    image_url?: string;
  };
}

const AddProfile = ({ profileId, initialData }: AddProfileProps = {}) => {
  const isEditMode = !!profileId;
  const [state, dispatch] = useReducer(formReducer, {
    ...initialState,
    values: initialData ? {
      name: initialData.name || "",
      title: initialData.title || "",
      email: initialData.email || "",
      bio: initialData.bio || "",
      img: null
    } : initialState.values
  });
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch({ type: "START_SUBMITTING" });
    dispatch({ type: "SET_ERROR", payload: "" });
    
    try {
     
      const cleanedName = name ? stripTags(trimCollapse(name)) : '';
      const cleanedTitle = title ? stripTags(trimCollapse(title)) : '';
      const cleanedEmail = email ? stripTags(trimCollapse(email)) : '';
      const cleanedBio = bio ? stripTags(bio).trim() : '';
      
     
      if (!isEditMode && !img) {
        dispatch({ type: "SET_ERROR", payload: "Image is required for new profiles" });
        dispatch({ type: "FINISH_SUBMIT" });
        return;
      }
      
     
     
      const formData = new FormData();
      formData.append('name', cleanedName || '');
      formData.append('title', cleanedTitle || '');
      formData.append('email', cleanedEmail || '');
      formData.append('bio', cleanedBio || '');
     
      if (isEditMode) {
        formData.append('image_url', initialData?.image_url || '');
      }
      if (img) {
        formData.append('img', img);
      }
      
     
      const url = isEditMode ? `/api/profiles/${profileId}` : '/api/profiles';
      const method = isEditMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
       
        const errorMessage = data.error || `Failed to ${isEditMode ? 'update' : 'create'} profile`;
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        dispatch({ type: "FINISH_SUBMIT" });
        return;
      }
      
      dispatch({ type: "SUBMIT_SUCCESS" });
      setTimeout(() => {
        dispatch({ type: "CLEAR_SUCCESS" });
      }, 1000);
      
      if (isEditMode) {
       
       
        const returnedProfile = data.data || data;
        const finalProfileId = returnedProfile?.id?.toString() || profileId;
        router.push(`/profile/${finalProfileId}`);
        router.refresh();
      } else {
        event.currentTarget.reset();
        router.push("/");
      }
    } catch (error: any) {
     
      dispatch({ type: "SET_ERROR", payload: error.message || `Failed to ${isEditMode ? 'update' : 'create'} profile` });
      dispatch({ type: "FINISH_SUBMIT" });
    }
  };

  return (
    <div className={styles.container}>
      <h2>{isEditMode ? 'Edit Profile' : 'Add Profile'}</h2>
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
        {isEditMode && initialData?.image_url && (
          <div style={{ marginBottom: '0.5rem' }}>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.25rem' }}>Current image:</p>
            <img 
              src={initialData.image_url} 
              alt="Current profile" 
              style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
            />
            <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.25rem' }}>Leave empty to keep current image</p>
          </div>
        )}
        <input 
          ref={nameRef} 
          type="file" 
          name="img" 
          id="img" 
          required={!isEditMode}
          accept="image/png, image/jpeg, image/jpg, image/gif" 
          onChange={onChange} 
        />

        {errors && (
          <div className={styles.error} style={{ 
            color: '#d32f2f', 
            fontSize: '0.9rem', 
            marginTop: '-0.5rem', 
            marginBottom: '0.5rem',
            padding: '0.75rem',
            backgroundColor: '#ffebee',
            borderRadius: '4px',
            border: '1px solid #ffcdd2'
          }}>
            {errors}
          </div>
        )}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : (isEditMode ? 'Update Profile' : 'Add Profile')}
        </button>
        {success && <p className={styles.success}>{success}</p>}
      </form>
    </div>
  );
};

export default AddProfile;


