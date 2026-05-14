import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApplicants, deleteApplicant } from '../../api/applicantsAPI';

const ApplicantsList = () => {
  const [applicants, setApplicants] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: '', page: 1, limit: 15 });
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplicants();
  }, [filters]);

  const fetchApplicants = async () => {
    try {
      const data = await getApplicants(filters);
      setApplicants(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this applicant?')) {
      try {
        await deleteApplicant(id);
        setApplicants(applicants.filter(a => a._id !== id));
      } catch (error) {
        console.error('Failed to delete applicant');
      }
    }
  };

  if (loading) return <div className="text-center text-gray-600">Loading...</div>;

  const statusColors = {
    pending: 'bg-gray-100 text-gray-800',
    reviewed: 'bg-blue-100 text-blue-800',
    shortlisted: 'bg-yellow-100 text-yellow-800',
    hired: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Applicants</h1>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex gap-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="hired">Hired</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table for Desktop */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white">Job</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white">Applied</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map(applicant => (
              <tr key={applicant._id} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-6 py-4 text-gray-800 dark:text-white">{applicant.name}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{applicant.job?.title}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{applicant.email}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded ${statusColors[applicant.status]}`}>
                    {applicant.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {new Date(applicant.appliedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => navigate(`/applicants/${applicant._id}`)}
                    className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(applicant._id)}
                    className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards for Mobile */}
      <div className="md:hidden space-y-4">
        {applicants.map(applicant => (
          <div key={applicant._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-800 dark:text-white">{applicant.name}</h3>
              <span className={`text-xs px-2 py-1 rounded ${statusColors[applicant.status]}`}>
                {applicant.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{applicant.job?.title}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{applicant.email}</p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => navigate(`/applicants/${applicant._id}`)}
                className="flex-1 px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded"
              >
                View
              </button>
              <button
                onClick={() => handleDelete(applicant._id)}
                className="flex-1 px-3 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setFilters({ ...filters, page })}
              className={`px-3 py-2 rounded ${
                filters.page === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicantsList;