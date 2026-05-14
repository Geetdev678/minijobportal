// JobCard component
import React from 'react';

const JobCard = ({ job }) => {
  return (
    <div>
      <h3>{job.title}</h3>
      <p>{job.company}</p>
    </div>
  );
};

export default JobCard;