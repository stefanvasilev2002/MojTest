// src/routes/AppRoutes.jsx
import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import {AuthProvider} from '../context/AuthContext'; // Import AuthProvider
import LandingPage from "../pages/LandingPage.jsx"; // Your landing page component
import PublicRoute from './PublicRoute'; // Updated PublicRoute
import PrivateRoute from './PrivateRoute'; // Updated PrivateRoute
import AboutTeacherPage from '../pages/teacher/AboutTeacherPage.jsx'; // Your AboutTeacherPage
import AboutStudentPage from '../pages/student/AboutStudentPage.jsx'; // Your AboutStudentPage
import TeacherDashboard from '../pages/teacher/TeacherDashboard.jsx'; // Your TeacherDashboard
import StudentDashboard from '../pages/student/StudentDashboard.jsx'; // Your StudentDashboard
import DebugPage from '../pages/DebugPage';
import LoginPage from "../pages/auth/LoginPage.jsx";
import RegisterPage from "../pages/auth/RegisterPage.jsx";
import TeacherLayout from "../layouts/TeacherLayout.jsx";
import StudentLayout from "../layouts/StudentLayout.jsx";
import PublicLayout from "../layouts/PublicLayout.jsx";
import CrudLayout from "../layouts/crud/CrudLayout.jsx";
import CrudHubPage from "../pages/admin/AdminDashboard.jsx";
import MetadataList from "../components/crud/MetadataList.jsx";
import AnswersList from "../components/crud/AnswersList.jsx";
import TestList from "../components/crud/TestList.jsx";
import QuestionList from "../components/crud/QuestionList.jsx";
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
import TakeTestPage from "../pages/student/TakeTestPage.jsx";
import TestResultsPage from "../pages/student/TestResultsPage.jsx";
import CreateTestPage from "../pages/teacher/CreateTestPage.jsx";
import EditQuestionPage from "../pages/teacher/EditQuestionPage.jsx";
import EditTestPage from "../pages/teacher/EditTestPage.jsx";
import TestQuestionsPage from "../pages/teacher/QuestionsPage.jsx";
import QuestionDetails from "../components/crud/QuestionDetails.jsx";
import TestDetailsPage from "../pages/student/TestDetailsPage.jsx";
import QuestionManagerPage from "../pages/teacher/QuestionManagerPage.jsx";
import CreateFutureQuestion from "../pages/teacher/CreateFutureQuestion.jsx";
import AllQuestionsPage from "../pages/teacher/AllQuestionsPage.jsx";
import StudentSettings from "../pages/student/StudentSettings.jsx";
import TeacherSettings from "../pages/teacher/TeacherSettings.jsx";
import ChangePassword from "../pages/teacher/ChangePassword.jsx";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage.jsx";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage.jsx";
import AboutUs from "../pages/AboutUs.jsx";
import UserManagement from "../pages/admin/UserManagement.jsx";

const AppRoutes = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<PublicRoute><PublicLayout><LandingPage/></PublicLayout></PublicRoute>}/>
                    <Route path="/about-teacher"
                           element={<PublicRoute><PublicLayout><AboutTeacherPage/></PublicLayout></PublicRoute>}/>
                    <Route path="/about-student"
                           element={<PublicRoute><PublicLayout><AboutStudentPage/></PublicLayout></PublicRoute>}/>
                    <Route path="/login"
                           element={<PublicRoute><PublicLayout><LoginPage/></PublicLayout></PublicRoute>}/>
                    <Route path="/about-us"
                           element={<PublicRoute><PublicLayout><AboutUs/></PublicLayout></PublicRoute>}/>
                    <Route path="/register"
                           element={<PublicRoute><PublicLayout><RegisterPage/></PublicLayout></PublicRoute>}/>
                    <Route path="/forgot-password"
                           element={<PublicRoute><PublicLayout><ForgotPasswordPage/></PublicLayout></PublicRoute>}/>
                    <Route path="/reset-password/:token"
                           element={<PublicRoute><PublicLayout><ResetPasswordPage/></PublicLayout></PublicRoute>}/>

                    <Route path="/question/:questionId" element={<QuestionDetails/>}/>

                    {/* Teacher Routes */}
                    <Route path="/teacher-dashboard" element={
                        <PrivateRoute requiredRoles={["teacher", "admin"]}>
                            <TeacherLayout/>
                        </PrivateRoute>
                    }>
                        {/* Use index for the dashboard */}
                        <Route index element={<TeacherDashboard/>}/>
                        {/* Other teacher routes */}
                        <Route path="create-test" element={<CreateTestPage/>}/>
                        <Route path="edit-test/:id" element={<EditTestPage/>}/>
                        <Route path="test/:testId/questions" element={<TestQuestionsPage/>}/>
                        <Route path="test/:testId/questions/create" element={<QuestionManagerPage/>}/>
                        <Route path="test/:testId/questions/:questionId/edit" element={<EditQuestionPage/>}/>
                        <Route path="create-question" element={<CreateFutureQuestion/>}/>
                        <Route path="questions" element={<AllQuestionsPage/>}/>
                        {/* Remove the leading /teacher-dashboard from this path */}
                        <Route path="questions/:questionId/edit" element={<EditQuestionPage/>}/>
                    </Route>


                    // Change this section in your AppRoutes.jsx
                    {/* Student Routes */}
                    <Route path="/student-dashboard" element={
                        <PrivateRoute requiredRoles={["student", "admin"]}>
                            <StudentLayout/>
                        </PrivateRoute>
                    }>
                        {/* Remove the duplicate path and use index instead */}
                        <Route index element={<StudentDashboard/>}/>
                    </Route>

                    <Route path="/student-settings" element={
                        <PrivateRoute requiredRoles={["student", "admin"]}>
                            <StudentLayout/>
                        </PrivateRoute>
                    }>
                        <Route index element={<StudentSettings/>}/>
                    </Route>
                    <Route path="/change-password" element={
                        <PrivateRoute requiredRoles={["teacher", "admin", "student"]}>
                            <ChangePassword/>
                        </PrivateRoute>
                    }>
                    </Route>
                    <Route path="/teacher-settings" element={
                        <PrivateRoute requiredRoles={["teacher", "admin"]}>
                            <TeacherLayout/>
                        </PrivateRoute>
                    }>
                        <Route index element={<TeacherSettings/>}/>
                    </Route>
                    <Route path="/admin/settings" element={
                        <PrivateRoute requiredRoles={["admin"]}>
                            <TeacherLayout/>
                        </PrivateRoute>
                    }>
                        <Route index element={<TeacherSettings/>}/>
                    </Route>

                    <Route path="/take-test/:studentTestId" element={
                        <PrivateRoute requiredRoles={["student", "admin"]}>
                            <StudentLayout/>
                        </PrivateRoute>
                    }>
                        {/* Use relative path here */}
                        <Route index element={<TakeTestPage/>}/>
                    </Route>

                    <Route path="/test-results" element={
                        <PrivateRoute requiredRoles={["student", "admin"]}>
                            <StudentLayout/>
                        </PrivateRoute>
                    }>
                        {/* Use relative path here */}
                        <Route index element={<TestResultsPage/>}/>
                    </Route>

                    <Route path="/test-details" element={
                        <PrivateRoute requiredRoles={["student", "admin"]}>
                            <StudentLayout/>
                        </PrivateRoute>
                    }>
                        {/* Use relative path here */}
                        <Route index element={<TestDetailsPage/>}/>
                    </Route>


                    {/* Admin Routes */}
                    <Route path="/admin" element={
                        <PrivateRoute requiredRoles={["admin"]}>
                            <CrudLayout>
                                <CrudHubPage/>
                            </CrudLayout>
                        </PrivateRoute>
                    }/>

                    {/* Protected Admin Routes */}
                    {/* Metadata Routes */}
                    <Route path="/admin/metadata" element={
                        <PrivateRoute requiredRoles={["admin"]}>
                            <CrudLayout><MetadataList/></CrudLayout>
                        </PrivateRoute>
                    }/>
                    <Route path="/admin/metadata/new" element={
                        <PrivateRoute requiredRoles={["admin"]}>
                            <CrudLayout><MetadataForm/></CrudLayout>
                        </PrivateRoute>
                    }/>
                    <Route path="/admin/metadata/edit/:id" element={
                        <PrivateRoute requiredRoles={["admin"]}>
                            <CrudLayout><MetadataForm/></CrudLayout>
                        </PrivateRoute>
                    }/>

                    {/* Answer Routes */}
                    <Route path="/admin/answer" element={
                        <PrivateRoute requiredRoles={["admin"]}>
                            <CrudLayout><AnswersList/></CrudLayout>
                        </PrivateRoute>
                    }/>

                    {/* Test Routes */}
                    <Route path="/admin/tests" element={
                        <PrivateRoute requiredRoles={["admin"]}>
                            <CrudLayout>
                                <div className="mt-20">
                                    <TeacherDashboard
                                        showAllTests={true}
                                        showTabs={false}
                                        allowCreate={true}
                                        overrideOwnerCheck={true} // Admin sees all tests as editable
                                    />
                                </div>

                            </CrudLayout>
                        </PrivateRoute>
                    }/>
                    <Route path="/admin/test/new" element={
                        <PrivateRoute requiredRoles={["admin"]}>
                            <CrudLayout><TestForm/></CrudLayout>
                        </PrivateRoute>
                    }/>
                    <Route path="/admin/test/edit/:id" element={
                        <PrivateRoute requiredRoles={["admin"]}>
                            <CrudLayout><TestForm/></CrudLayout>
                        </PrivateRoute>
                    }/>

                    {/* Question Routes */}
                    <Route path="/admin/question" element={
                        <PrivateRoute requiredRoles={["admin"]}>
                            <CrudLayout><QuestionList/></CrudLayout>
                        </PrivateRoute>
                    }/>
                    <Route path="/admin/question/new" element={
                        <PrivateRoute requiredRoles={["admin"]}>
                            <CrudLayout><QuestionForm/></CrudLayout>
                        </PrivateRoute>
                    }/>
                    <Route path="/admin/question/edit/:id" element={
                        <PrivateRoute requiredRoles={["admin"]}>
                            <CrudLayout><QuestionForm/></CrudLayout>
                        </PrivateRoute>
                    }/>

                    {/* User Management Routes */}
                    <Route path="/admin/users" element={
                        <PrivateRoute requiredRoles={["admin"]}>
                            <CrudLayout><UserManagement/></CrudLayout>
                        </PrivateRoute>
                    }/>

                    {/* Admin User Routes */}
                    <Route path="/admin/users/admins" element={
                        <PrivateRoute requiredRoles={["admin"]}>
                            <CrudLayout><UserManagement defaultType="Admin"/></CrudLayout>
                        </PrivateRoute>
                    }/>
                    <Route path="/admin/users/admin/new" element={
                        <PrivateRoute requiredRoles={["admin"]}>
                            <CrudLayout><AdminForm/></CrudLayout>
                        </PrivateRoute>
                    }/>
                    <Route path="/admin/users/admin/edit/:id" element={
                        <PrivateRoute requiredRoles={["admin"]}>
                            <CrudLayout><AdminForm/></CrudLayout>
                        </PrivateRoute>
                    }/>

                    {/* Teacher User Routes */}
                    <Route path="/admin/users/teachers" element={
                        <PrivateRoute requiredRoles={["admin"]}>
                            <CrudLayout><UserManagement defaultType="Teacher"/></CrudLayout>
                        </PrivateRoute>
                    }/>
                    <Route path="/admin/users/teacher/new" element={
                        <PrivateRoute requiredRoles={["admin"]}>
                            <CrudLayout><TeacherForm/></CrudLayout>
                        </PrivateRoute>
                    }/>
                    <Route path="/admin/users/teacher/edit/:id" element={
                        <PrivateRoute requiredRoles={["admin"]}>
                            <CrudLayout><TeacherForm/></CrudLayout>
                        </PrivateRoute>
                    }/>

                    {/* Student User Routes */}
                    <Route path="/admin/users/students" element={
                        <PrivateRoute requiredRoles={["admin"]}>
                            <CrudLayout><UserManagement defaultType="Student"/></CrudLayout>
                        </PrivateRoute>
                    }/>
                    <Route path="/admin/users/student/new" element={
                        <PrivateRoute requiredRoles={["admin"]}>
                            <CrudLayout><StudentForm/></CrudLayout>
                        </PrivateRoute>
                    }/>
                    <Route path="/admin/users/student/edit/:id" element={
                        <PrivateRoute requiredRoles={["admin"]}>
                            <CrudLayout><StudentForm/></CrudLayout>
                        </PrivateRoute>
                    }/>


                    <Route path="/debug" element={<DebugPage/>}></Route>
                    {/* Catch-all route - redirect to appropriate dashboard */}
                    <Route path="*" element={<Navigate to="/login" replace/>}/>
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default AppRoutes;