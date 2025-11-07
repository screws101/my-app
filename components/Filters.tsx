"use client";

import styles from "./filters.module.css";
import { memo } from "react";

const Filters = memo(({ 
  titles, 
  onChange, 
  searchName, 
  clear, 
  title, 
  search 
}: { 
  titles: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  searchName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clear: () => void;
  title: string;
  search: string;
}) => {
  return (
    <div className={styles["filter-container"]}>
      <div className={styles["select-filter"]}>
        <label htmlFor="select">Select a major:</label>
        <select id="select" value={title} onChange={onChange}>
          <option value="">All</option>
          {Array.isArray(titles) && titles.length > 0 ? (
            titles.map(ti => (
              <option key={ti} value={ti}>{ti}</option>
            ))
          ) : (
            <option disabled>No majors available</option>
          )}
        </select>
      </div>
      <div className={styles["search-box-container"]}>
        <label htmlFor="search">Search by name:</label>
        <input id="search" value={search} type="text" placeholder="Enter name" onChange={searchName} />
      </div>
      <button onClick={clear}>Clear</button>
    </div>
  );
});

Filters.displayName = 'Filters';

export default Filters;


