"use client";

import { memo } from "react";

const Wrapper = memo(({ children }: { children: React.ReactNode }) => {
  return (
    <div className="section">
      <div className="container">
        {children}
      </div>
    </div>
  );
});

Wrapper.displayName = 'Wrapper';

export default Wrapper;

