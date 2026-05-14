// Skeleton component
import React from 'react';

const Skeleton = ({ lines = 1 }) => {
  return (
    <div>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton-line"></div>
      ))}
    </div>
  );
};

export default Skeleton;