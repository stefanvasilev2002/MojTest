// src/routes/AppRoutes.jsx
import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';  // Import AuthProvider
import LandingPage from "../pages/LandingPage.jsx";  // Your landing page component
import PublicRoute from './PublicRoute';  // Updated PublicRoute
import PrivateRoute from './PrivateRoute';  // Updated PrivateRoute
import AboutTeacherPage from '../pages/AboutTeacherPage';  // Your AboutTeacherPage
import AboutStudentPage from '../pages/AboutStudentPage';  // Your AboutStudentPage
import TeacherDashboard from '../pages/TeacherDashboard';  // Your TeacherDashboard
import StudentDashboard from '../pages/StudentDashboard';  // Your StudentDashboard
// import DebugPage from '../pages/DebugPage';
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import TeacherLayout from "../layouts/TeacherLayout.jsx";
import StudentLayout from "../layouts/StudentLayout.jsx";
import PublicLayout from "../layouts/PublicLayout.jsx";
import CrudLayout from "../layouts/crud/CrudLayout.jsx";
import CrudHubPage from "../pages/crud/CrudHubPage.jsx";
import MetadataList from "../components/crud/MetadataList.jsx";
import AnswersList from "../components/crud/AnswersList.jsx";
import TestList from "../components/crud/TestList.jsx";
import QuestionList from "../components/crud/QuestionList.jsx";
// import StudentAnswersList from "../components/crud/StudentAnswersList.jsx";
// import StudentTestList from "../components/crud/StudentTestList.jsx";
// import TestQuestionList from "../components/crud/TestQuestionList.jsx";
import UsersList from "../components/crud/UsersList.jsx";
import StudentList from "../components/crud/StudentList.jsx";
import TeacherList from "../components/crud/TeacherList.jsx";
import AdminList from "../components/crud/AdminList.jsx";
import MetadataForm from "../components/crud/MetadataForm.jsx";
import StudentForm from "../components/crud/StudentForm.jsx";
import TeacherForm from "../components/crud/TeacherForm.jsx";
import AdminForm from "../components/crud/AdminForm.jsx";
import QuestionForm from "../components/crud/QuestionForm.jsx";
import TestForm from "../components/crud/TestForm.jsx";
import TakeTestPage from "../pages/TakeTestPage.jsx";
import TestResultsPage from "../pages/TestResultsPage.jsx";

const AppRoutes = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<PublicRoute><PublicLayout><LandingPage /></PublicLayout></PublicRoute>} />
                    <Route path="/about-teacher" element={<PublicRoute><PublicLayout><AboutTeacherPage /></PublicLayout></PublicRoute>} />
                    <Route path="/about-student" element={<PublicRoute><PublicLayout><AboutStudentPage /></PublicLayout></PublicRoute>} />
                    <Route path="/login" element={<PublicRoute><PublicLayout><LoginPage /></PublicLayout></PublicRoute>} />
                    <Route path="/register" element={<PublicRoute><PublicLayout><RegisterPage /></PublicLayout></PublicRoute>} />

                    {/* Teacher Routes */}
                    <Route path="/teacher-dashboard" element={
                        <PrivateRoute requiredRole={["teacher", "admin"]}>
                            <TeacherLayout />  {/* Renders the layout */}
                        </PrivateRoute>
                    }>
                        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />  {/* Teacher dashboard as a child route */}
                    </Route>


                    {/* Student Routes */}
                    <Route path="/student-dashboard" element={
                        <PrivateRoute requiredRole={["student", "admin"]}>
                            <StudentLayout />  {/* Renders the layout */}
                        </PrivateRoute>
                    }>
                        <Route path="/student-dashboard" element={<StudentDashboard />} />  {/* Student dashboard as a child route */}
                    </Route>

                    <Route path="/take-test/:studentTestId" element={
                            <PrivateRoute requiredRole={["student", "admin"]}>
                                <StudentLayout/>
                            </PrivateRoute>
                        }>
                        <Route path="/take-test/:studentTestId" element={<TakeTestPage/>}/></Route>

                    <Route path="/test-results" element={
                        <PrivateRoute requiredRole={["student", "admin"]}>
                            <StudentLayout/>
                        </PrivateRoute>
                    }>
                        <Route path="/test-results" element={<TestResultsPage/>}/></Route>


                    {/* Admin Routes */}
                    <Route path="/crud/hub" element={
                        <PrivateRoute requiredRole="admin">
                            <CrudLayout>
                                <CrudHubPage />
                            </CrudLayout>
                        </PrivateRoute>
                    } />

                    {/* Protected CRUD Routes */}
                    {/* Metadata Routes */}
                    <Route path="/crud/metadata" element={
                        <PrivateRoute requiredRole="admin">
                            <CrudLayout><MetadataList /></CrudLayout>
                        </PrivateRoute>
                    } />
                    <Route path="/crud/metadata/new" element={
                        <PrivateRoute requiredRole="admin">
                            <CrudLayout><MetadataForm /></CrudLayout>
                        </PrivateRoute>
                    } />
                    <Route path="/crud/metadata/edit/:id" element={
                        <PrivateRoute requiredRole="admin">
                            <CrudLayout><MetadataForm /></CrudLayout>
                        </PrivateRoute>
                    } />

                    {/* Answer Routes */}
                    <Route path="/crud/answer" element={
                        <PrivateRoute requiredRole="admin">
                            <CrudLayout><AnswersList /></CrudLayout>
                        </PrivateRoute>
                    } />

                    {/* Test Routes */}
                    <Route path="/crud/test" element={
                        <PrivateRoute requiredRole="admin">
                            <CrudLayout><TestList /></CrudLayout>
                        </PrivateRoute>
                    } />
                    <Route path="/crud/test/new" element={
                        <PrivateRoute requiredRole="admin">
                            <CrudLayout><TestForm /></CrudLayout>
                        </PrivateRoute>
                    } />
                    <Route path="/crud/test/edit/:id" element={
                        <PrivateRoute requiredRole="admin">
                            <CrudLayout><TestForm /></CrudLayout>
                        </PrivateRoute>
                    } />

                    {/* Question Routes */}
                    <Route path="/crud/question" element={
                        <PrivateRoute requiredRole="admin">
                            <CrudLayout><QuestionList /></CrudLayout>
                        </PrivateRoute>
                    } />
                    <Route path="/crud/question/new" element={
                        <PrivateRoute requiredRole="admin">
                            <CrudLayout><QuestionForm /></CrudLayout>
                        </PrivateRoute>
                    } />
                    <Route path="/crud/question/edit/:id" element={
                        <PrivateRoute requiredRole="admin">
                            <CrudLayout><QuestionForm /></CrudLayout>
                        </PrivateRoute>
                    } />

                    {/* User Management Routes */}
                    <Route path="/crud/user" element={
                        <PrivateRoute requiredRole="admin">
                            <CrudLayout><UsersList /></CrudLayout>
                        </PrivateRoute>
                    } />

                    {/* Admin User Routes */}
                    <Route path="/crud/users/admin" element={
                        <PrivateRoute requiredRole="admin">
                            <CrudLayout><AdminList /></CrudLayout>
                        </PrivateRoute>
                    } />
                    <Route path="/crud/users/admin/new" element={
                        <PrivateRoute requiredRole="admin">
                            <CrudLayout><AdminForm /></CrudLayout>
                        </PrivateRoute>
                    } />
                    <Route path="/crud/users/admin/edit/:id" element={
                        <PrivateRoute requiredRole="admin">
                            <CrudLayout><AdminForm /></CrudLayout>
                        </PrivateRoute>
                    } />

                    {/* Teacher User Routes */}
                    <Route path="/crud/users/teacher" element={
                        <PrivateRoute requiredRole="admin">
                            <CrudLayout><TeacherList /></CrudLayout>
                        </PrivateRoute>
                    } />
                    <Route path="/crud/users/teacher/new" element={
                        <PrivateRoute requiredRole="admin">
                            <CrudLayout><TeacherForm /></CrudLayout>
                        </PrivateRoute>
                    } />
                    <Route path="/crud/users/teacher/edit/:id" element={
                        <PrivateRoute requiredRole="admin">
                            <CrudLayout><TeacherForm /></CrudLayout>
                        </PrivateRoute>
                    } />

                    {/* Student User Routes */}
                    <Route path="/crud/users/student" element={
                        <PrivateRoute requiredRole="admin">
                            <CrudLayout><StudentList /></CrudLayout>
                        </PrivateRoute>
                    } />
                    <Route path="/crud/users/student/new" element={
                        <PrivateRoute requiredRole="admin">
                            <CrudLayout><StudentForm /></CrudLayout>
                        </PrivateRoute>
                    } />
                    <Route path="/crud/users/student/edit/:id" element={
                        <PrivateRoute requiredRole="admin">
                            <CrudLayout><StudentForm /></CrudLayout>
                        </PrivateRoute>
                    } />

                    {/* Catch-all route - redirect to appropriate dashboard */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default AppRoutes;