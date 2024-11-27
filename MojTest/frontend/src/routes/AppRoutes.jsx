// src/routes/AppRoutes.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';  // Import AuthProvider
import LandingPage from "../pages/LandingPage.jsx";  // Your landing page component
import PublicRoute from './PublicRoute';  // Updated PublicRoute
import PrivateRoute from './PrivateRoute';  // Updated PrivateRoute
import AboutTeacherPage from '../pages/AboutTeacherPage';  // Your AboutTeacherPage
import AboutStudentPage from '../pages/AboutStudentPage';  // Your AboutStudentPage
import TeacherDashboard from '../pages/TeacherDashboard';  // Your TeacherDashboard
import StudentDashboard from '../pages/StudentDashboard';  // Your StudentDashboard
import DebugPage from '../pages/DebugPage';
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import TeacherLayout from "../layouts/TeacherLayout.jsx";
import StudentLayout from "../layouts/StudentLayout.jsx";
import PublicLayout from "../layouts/PublicLayout.jsx";  // Your DebugPage

const AppRoutes = () => {
    return (
        <AuthProvider>  {/* Wrapping routes with AuthProvider */}
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<PublicRoute><PublicLayout><LandingPage /></PublicLayout></PublicRoute>} />
                    <Route path="/about-teacher" element={<PublicRoute><PublicLayout><AboutTeacherPage /></PublicLayout></PublicRoute>} />
                    <Route path="/about-student" element={<PublicRoute><PublicLayout><AboutStudentPage /></PublicLayout></PublicRoute>} />
                    <Route path="/login" element={<PublicRoute><PublicLayout><LoginPage /></PublicLayout></PublicRoute>} />
                    <Route path="/register" element={<PublicRoute><PublicLayout><RegisterPage /></PublicLayout></PublicRoute>} />

                    {/* Authenticated Routes */}
                    <Route path="/teacher-dashboard" element={<PrivateRoute requiredRole="teacher"><TeacherDashboard /></PrivateRoute>} />
                    <Route path="/student-dashboard" element={<PrivateRoute requiredRole="student"><StudentDashboard /></PrivateRoute>} />

                    {/* Debug Page */}
                    <Route path="/debug" element={<DebugPage />} />

                    {/* Teacher Dashboard */}
                    <Route
                        path="/teacher-dashboard"
                        element={
                            <PrivateRoute requiredRole="teacher">
                                <TeacherLayout /> {/* Use TeacherLayout for teacher dashboard */}
                            </PrivateRoute>
                        }
                    >
                        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
                    </Route>

                    {/* Student Dashboard */}
                    <Route
                        path="/student-dashboard"
                        element={
                            <PrivateRoute requiredRole="student">
                                <StudentLayout /> {/* Use StudentLayout for student dashboard */}
                            </PrivateRoute>
                        }
                    >
                        <Route path="/student-dashboard" element={<StudentDashboard />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default AppRoutes;
