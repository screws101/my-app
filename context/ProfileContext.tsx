"use client";

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';

interface Profile {
  id: string;
  name: string;
  title: string;
  email: string;
  bio?: string;
  image_url: string;
}

interface ProfileContextType {
  profiles: Profile[];
  loading: boolean;
  fetchProfiles: () => Promise<void>;
  addProfile: (newProfile: any) => void;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(`https://web.ics.purdue.edu/~zong6/profile-app/fetch-data-with-filter.php?title=&name=&page=1&limit=100`);
      const data = await response.json();
      
      if (data?.profiles) {
        setProfiles(data.profiles);
      }
    } catch {
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addProfile = useCallback((newProfile: any) => {
    if (!newProfile.name || !newProfile.title || !newProfile.email || !newProfile.img) {
      return;
    }
    
    const profileWithId: Profile = {
      id: Date.now().toString(),
      name: newProfile.name,
      title: newProfile.title,
      email: newProfile.email,
      bio: newProfile.bio || '',
      image_url: URL.createObjectURL(newProfile.img)
    };
    
    setProfiles((prevProfiles) => [...prevProfiles, profileWithId]);
  }, []);

  const value = useMemo(() => ({
    profiles,
    loading,
    fetchProfiles,
    addProfile
  }), [profiles, loading, fetchProfiles, addProfile]);

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};


