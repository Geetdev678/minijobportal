// Applicants API
import api from './axiosInstance';

export const getApplicants = async (params) => {
  const response = await api.get('/applicants', { params });
  return response.data;
};

export const getApplicantById = async (id) => {
  const response = await api.get(`/applicants/${id}`);
  return response.data;
};

export const submitApplication = async (jobId, applicationData) => {
  const response = await api.post(`/applicants/job/${jobId}`, applicationData);
  return response.data;
};

export const updateApplicantStatus = async (id, status) => {
  const response = await api.patch(`/applicants/${id}/status`, { status });
  return response.data;
};

export const updateApplicantNotes = async (id, notes) => {
  const response = await api.put(`/applicants/${id}/notes`, { notes });
  return response.data;
};

export const deleteApplicant = async (id) => {
  const response = await api.delete(`/applicants/${id}`);
  return response.data;
};