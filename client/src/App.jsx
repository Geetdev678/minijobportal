import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Layout from './components/layout/Layout';

// Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import JobsList from './pages/jobs/JobsList';
import JobCreate from './pages/jobs/JobCreate';
import JobEdit from './pages/jobs/JobEdit';
import ApplicantsList from './pages/applicants/ApplicantsList';
import ApplicantDetail from './pages/applicants/ApplicantDetail';
import Profile from './pages/profile/Profile';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      
                      {/* Job Routes */}
                      <Route path="/jobs" element={<JobsList />} />
                      <Route path="/jobs/create" element={<JobCreate />} />
                      <Route path="/jobs/:id/edit" element={<JobEdit />} />

                      {/* Applicant Routes */}
                      <Route path="/applicants" element={<ApplicantsList />} />
                      <Route path="/applicants/:id" element={<ApplicantDetail />} />

                      {/* Profile Route */}
                      <Route path="/profile" element={<Profile />} />

                      {/* 404 */}
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;