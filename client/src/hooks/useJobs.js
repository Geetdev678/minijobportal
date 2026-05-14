// useJobs hook
import { useState, useEffect } from 'react';
import { getJobs } from '../api/jobsAPI';

export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobs().then(data => {
      setJobs(data.data);
      setLoading(false);
    });
  }, []);

  return { jobs, loading };
};