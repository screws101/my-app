"use client";

import { useState, useEffect, useMemo } from 'react';
import Card from './Card';
import cardStyles from './card.module.css';
import { useRouter } from 'next/navigation';
import { useProfile } from '../context/ProfileContext';

const FetchedProfiles = ({ 
  title, 
  search, 
  page, 
  setPage, 
  onError, 
  onLoadingChange 
}: { 
  title: string; 
  search: string; 
  page: number; 
  setPage: (page: number) => void; 
  onError?: (error: string) => void; 
  onLoadingChange?: (loading: boolean) => void;
}) => {
  const [apiProfiles, setApiProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { profiles: contextProfiles, fetchProfiles } = useProfile();

  const LIMIT = 1000;

  useEffect(() => {
    const controller = new AbortController();

    const fetchApiProfiles = async () => {
      setLoading(true);
      setError('');
      onLoadingChange?.(true);

      try {
        const url = `https://web.ics.purdue.edu/~zong6/profile-app/fetch-data-with-filter.php?title=&name=&page=1&limit=${LIMIT}`;

        const response = await fetch(url, { signal: controller.signal });
        const text = await response.text();

        let data;
        try {
          data = JSON.parse(text);
        } catch (err) {
          setApiProfiles([]);
          return;
        }

        if (data && Array.isArray(data.profiles)) {
          setApiProfiles(data.profiles);
        } else {
          setApiProfiles([]);
        }

      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError("Failed to fetch profiles");
          onError?.("Failed to fetch profiles");
        }
      } finally {
        setLoading(false);
        onLoadingChange?.(false);
      }
    };

    fetchApiProfiles();

    return () => controller.abort();
  }, [onLoadingChange, onError]);

  const allProfiles = useMemo(() => {
    const profileMap = new Map();
    
    apiProfiles.forEach(profile => {
      profileMap.set(profile.id, profile);
    });
    
    contextProfiles.forEach(profile => {
      if (!profileMap.has(profile.id) || profile.image_url.startsWith('blob:')) {
        profileMap.set(profile.id, profile);
      }
    });
    
    return Array.from(profileMap.values());
  }, [apiProfiles, contextProfiles]);

  const filteredProfiles = useMemo(() => {
    return allProfiles.filter((profile: any) => {
      const matchesTitle = !title || profile.title === title;
      const matchesSearch = !search || 
        profile.name.toLowerCase().includes(search.toLowerCase()) ||
        profile.email.toLowerCase().includes(search.toLowerCase());
      return matchesTitle && matchesSearch;
    });
  }, [allProfiles, title, search]);

  return (
    <div className={cardStyles["flex-container"]}>
      {loading && <p>Loading profiles...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && filteredProfiles.length === 0 && <p>No profiles found.</p>}
      {!loading && filteredProfiles.map((profile: any) => (
        <div
          key={profile.id}
          onClick={() => router.push(`/profile/${profile.id}`)}
          style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
        >
          <Card
            name={profile.name}
            title={profile.title}
            email={profile.email}
            img={profile.image_url}
          />
        </div>
      ))}
    </div>
  );
};

export default FetchedProfiles;

