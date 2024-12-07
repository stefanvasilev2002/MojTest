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
import PublicLayout from "../layouts/PublicLayout.jsx";
import CrudLayout from "../layouts/crud/CrudLayout.jsx";
import CrudHubPage from "../pages/crud/CrudHubPage.jsx";
import MetadataList from "../components/crud/MetadataList.jsx";
import AnswersList from "../components/crud/AnswersList.jsx";
import TestList from "../components/crud/TestList.jsx";
import QuestionList from "../components/crud/QuestionList.jsx";
import StudentAnswersList from "../components/crud/StudentAnswersList.jsx";
import StudentTestList from "../components/crud/StudentTestList.jsx";
import TestQuestionList from "../components/crud/TestQuestionList.jsx";
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
                    <Route path="/teacher-dashboard" element={
                        <PrivateRoute requiredRole="teacher">
                            <TeacherLayout>
                                <TeacherDashboard />
                            </TeacherLayout>
                        </PrivateRoute>
                    } />
                    <Route path="/student-dashboard" element={
                        <PrivateRoute requiredRole="student">
                            <StudentLayout>
                                <StudentDashboard />
                            </StudentLayout>
                        </PrivateRoute>
                    } />

                    {/* Debug Page */}
                    <Route path="/debug" element={<DebugPage />} />

                    {/* CRUD Layout */}
                    <Route path="/crud/metadata" element={<CrudLayout><MetadataList /></CrudLayout>} />
                    <Route path="/crud/metadata/new" element={<CrudLayout><MetadataForm /></CrudLayout>} />
                    <Route path="/crud/metadata/edit/:id" element={<CrudLayout><MetadataForm /></CrudLayout>} />


                    <Route path="/crud/hub" element={<CrudLayout><CrudHubPage /></CrudLayout>} />

                    <Route path="/crud/answer" element={<CrudLayout><AnswersList /></CrudLayout>} />
                    {/*<Route path="/crud/answer/new" element={<CrudLayout><AnswersForm /></CrudLayout>} />*/}
                    {/*<Route path="/crud/answer/edit/:id" element={<CrudLayout><AnswersForm /></CrudLayout>} />*/}


                    <Route path="/crud/test" element={<CrudLayout><TestList /></CrudLayout>} />
                    <Route path="/crud/test/new" element={<CrudLayout><TestForm /></CrudLayout>} />
                    <Route path="/crud/test/edit/:id" element={<CrudLayout><TestForm /></CrudLayout>} />


                    <Route path="/crud/question" element={<CrudLayout><QuestionList /></CrudLayout>} />
                    <Route path="/crud/question/new" element={<CrudLayout><QuestionForm /></CrudLayout>} />
                    <Route path="/crud/question/edit/:id" element={<CrudLayout><QuestionForm /></CrudLayout>} />


                    <Route path="/crud/student-answer" element={<CrudLayout><StudentAnswersList /></CrudLayout>} />
                    <Route path="/crud/student-test" element={<CrudLayout><StudentTestList /></CrudLayout>} />
                    <Route path="/crud/test-question" element={<CrudLayout><TestQuestionList /></CrudLayout>} />
                    <Route path="/crud/user" element={<CrudLayout><UsersList /></CrudLayout>} />
                    <Route path="/crud/users/admin" element={<CrudLayout><AdminList /></CrudLayout>} />
                    <Route path="/crud/users/admin/new" element={<CrudLayout><AdminForm /></CrudLayout>} />
                    <Route path="/crud/users/admin/edit/:id" element={<CrudLayout><AdminForm /></CrudLayout>} />


                    <Route path="/crud/users/teacher" element={<CrudLayout><TeacherList /></CrudLayout>} />
                    <Route path="/crud/users/teacher/new" element={<CrudLayout><TeacherForm /></CrudLayout>} />
                    <Route path="/crud/users/teacher/edit/:id" element={<CrudLayout><TeacherForm /></CrudLayout>} />

                    <Route path="/crud/users/student" element={<CrudLayout><StudentList /></CrudLayout>} />
                    <Route path="/crud/users/student/new" element={<CrudLayout><StudentForm /></CrudLayout>} />
                    <Route path="/crud/users/student/edit/:id" element={<CrudLayout><StudentForm /></CrudLayout>} />



                    {/* Test Route without Layout for Metadata List */}
                    <Route path="/test-metadata" element={<MetadataList />} />  {/* New test route */}

                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default AppRoutes;
