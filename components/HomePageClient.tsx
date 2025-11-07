"use client";

import { useState, useEffect } from "react";
import Filters from "./Filters";
import FetchedProfiles from "./FetchedProfiles";

export default function HomePageClient() {
  const [major, setMajor] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [majors, setMajors] = useState<string[]>([]);

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const response = await fetch('/api');
        const data = await response.json();
        const profiles = data.data || data || [];
        if (Array.isArray(profiles)) {
          const uniqueMajors = Array.from(
            new Set(profiles.map((p: any) => p.major).filter(Boolean))
          ) as string[];
          setMajors(uniqueMajors);
        }
      } catch (err) {
        console.error("Failed to fetch majors", err);
      }
    };
    fetchMajors();
  }, []);

  const handleMajorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMajor(e.target.value);
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleClear = () => {
    setMajor("");
    setSearch("");
    setPage(1);
  };

  return (
    <div className="section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', margin: '2rem 0 1rem 0' }}>All Profiles</h1>
          <p style={{ color: '#666', marginBottom: '1rem' }}>Click on a profile to view details</p>
        </div>
        <Filters
          titles={majors}
          onChange={handleMajorChange}
          searchName={handleSearchChange}
          clear={handleClear}
          title={major}
          search={search}
        />
        <FetchedProfiles
          title={major}
          search={search}
          page={page}
          setPage={setPage}
        />
      </div>
    </div>
  );
}

