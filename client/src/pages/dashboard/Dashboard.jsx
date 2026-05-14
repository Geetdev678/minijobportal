import React, { useState, useEffect } from 'react';
import { getJobs } from '../../api/jobsAPI';
import { getApplicants } from '../../api/applicantsAPI';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplicants: 0,
    shortlisted: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsRes = await getJobs({ limit: 100 });
        const applicantsRes = await getApplicants({ limit: 100 });

        const jobs = jobsRes.data;
        const applicants = applicantsRes.data;

        setStats({
          totalJobs: jobsRes.pagination.total,
          activeJobs: jobs.filter(j => j.status === 'active').length,
          totalApplicants: applicantsRes.pagination.total,
          shortlisted: applicants.filter(a => a.status === 'shortlisted').length,
        });

        setRecentJobs(jobs.slice(0, 5));
        setRecentApplicants(applicants.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-600 dark:text-gray-400">Loading dashboard...</div>;
  }

  const StatCard = ({ title, value, icon, color }) => (
    <div className={`${color} rounded-lg shadow p-6 text-white`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm opacity-90">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Jobs" value={stats.totalJobs} icon="💼" color="bg-blue-500" />
        <StatCard title="Active Jobs" value={stats.activeJobs} icon="✨" color="bg-green-500" />
        <StatCard title="Total Applicants" value={stats.totalApplicants} icon="👥" color="bg-purple-500" />
        <StatCard title="Shortlisted" value={stats.shortlisted} icon="⭐" color="bg-yellow-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Jobs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Recent Job Posts</h2>
          {recentJobs.length > 0 ? (
            <div className="space-y-4">
              {recentJobs.map(job => (
                <div key={job._id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 dark:text-white">{job.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{job.company}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      job.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      job.status === 'draft' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Applicants: {job.applicantCount || 0}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No jobs posted yet</p>
          )}
        </div>

        {/* Recent Applicants */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Recent Applicants</h2>
          {recentApplicants.length > 0 ? (
            <div className="space-y-4">
              {recentApplicants.map(applicant => (
                <div key={applicant._id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 dark:text-white">{applicant.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{applicant.job.title}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      applicant.status === 'hired' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      applicant.status === 'shortlisted' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      applicant.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {applicant.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No applicants yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;