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
        const params = new URLSearchParams();
        if (search) {
          params.append('name', search);
        }
        if (title) {
          params.append('major', title);
        }
        
        const url = `/api${params.toString() ? '?' + params.toString() : ''}`;

        const response = await fetch(url, { signal: controller.signal });
        const data = await response.json();

        if (data && Array.isArray(data.data)) {
          setApiProfiles(data.data);
        } else if (data && Array.isArray(data)) {
          setApiProfiles(data);
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
  }, [onLoadingChange, onError, title, search]);

  const allProfiles = useMemo(() => {
    return apiProfiles;
  }, [apiProfiles]);

  const filteredProfiles = useMemo(() => {
    return allProfiles.filter((profile: any) => {
      const matchesMajor = !title || profile.major === title;
      const matchesSearch = !search || 
        profile.name.toLowerCase().includes(search.toLowerCase()) ||
        profile.major.toLowerCase().includes(search.toLowerCase());
      return matchesMajor && matchesSearch;
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
            major={profile.major}
            year={profile.year}
            gpa={profile.gpa}
          />
        </div>
      ))}
    </div>
  );
};

export default FetchedProfiles;

