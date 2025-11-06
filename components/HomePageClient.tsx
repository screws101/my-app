"use client";

import { useState, useEffect } from "react";
import Filters from "./Filters";
import FetchedProfiles from "./FetchedProfiles";

export default function HomePageClient() {
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [titles, setTitles] = useState<string[]>([]);

  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const response = await fetch(
          `https://web.ics.purdue.edu/~zong6/profile-app/fetch-data-with-filter.php?title=&name=&page=1&limit=1000`
        );
        const data = await response.json();
        if (data?.profiles) {
          const uniqueTitles = Array.from(
            new Set(data.profiles.map((p: any) => p.title).filter(Boolean))
          ) as string[];
          setTitles(uniqueTitles);
        }
      } catch (err) {
        console.error("Failed to fetch titles", err);
      }
    };
    fetchTitles();
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTitle(e.target.value);
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleClear = () => {
    setTitle("");
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
          titles={titles}
          onChange={handleTitleChange}
          searchName={handleSearchChange}
          clear={handleClear}
          title={title}
          search={search}
        />
        <FetchedProfiles
          title={title}
          search={search}
          page={page}
          setPage={setPage}
        />
      </div>
    </div>
  );
}

