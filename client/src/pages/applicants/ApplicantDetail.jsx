import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getApplicantById, updateApplicantStatus, updateApplicantNotes } from '../../api/applicantsAPI';

const ApplicantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applicant, setApplicant] = useState(null);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicant();
  }, [id]);

  const fetchApplicant = async () => {
    try {
      const data = await getApplicantById(id);
      setApplicant(data);
      setNotes(data.notes || '');
      setStatus(data.status);
    } catch (error) {
      console.error('Failed to load applicant');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateApplicantStatus(id, newStatus);
      setStatus(newStatus);
      setApplicant({ ...applicant, status: newStatus });
    } catch (error) {
      console.error('Failed to update status');
    }
  };

  const handleNotesUpdate = async () => {
    try {
      await updateApplicantNotes(id, notes);
      setApplicant({ ...applicant, notes });
    } catch (error) {
      console.error('Failed to update notes');
    }
  };

  if (loading) return <div className="text-center text-gray-600">Loading...</div>;
  if (!applicant) return <div className="text-center text-gray-600">Applicant not found</div>;

  const statusColors = {
    pending: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    reviewed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    shortlisted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    hired: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/applicants')} className="text-blue-600 hover:underline">
        ← Back to Applicants
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">{applicant.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Email</p>
                <p className="font-semibold text-gray-800 dark:text-white">{applicant.email}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Phone</p>
                <p className="font-semibold text-gray-800 dark:text-white">{applicant.phone}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Job Applied</p>
                <p className="font-semibold text-gray-800 dark:text-white">{applicant.job?.title}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Experience</p>
                <p className="font-semibold text-gray-800 dark:text-white">{applicant.experience} years</p>
              </div>
            </div>
            {applicant.resumeUrl && (
              <div className="mt-4">
                <a
                  href={applicant.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  📄 View Resume
                </a>
              </div>
            )}
          </div>

          {/* Cover Letter */}
          {applicant.coverLetter && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Cover Letter</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{applicant.coverLetter}</p>
            </div>
          )}

          {/* Notes */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your notes..."
              rows="5"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={handleNotesUpdate}
              className="mt-3 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Save Notes
            </button>
          </div>
        </div>

        {/* Status Sidebar */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Status</h3>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg text-white font-semibold ${statusColors[status]}`}
            >
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Applied on</p>
            <p className="font-semibold text-gray-800 dark:text-white">
              {new Date(applicant.appliedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetail;