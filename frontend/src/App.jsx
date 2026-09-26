import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/public/Home';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Login from './pages/auth/Login';
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import ManageCourses from './pages/admin/ManageCourses';
import ManageUsers from './pages/admin/ManageUsers';
import Anouncement from './pages/admin/Anouncement';
import ManageFees from './pages/admin/ManageFees';
import ProfilePage from './components/layout/ProfilePage';
import ManageAssignments from './components/layout/ManageAssignments';
import Assignments from './pages/student/Assignments'
import Notices from './pages/student/Notices';
import Fees from './pages/student/Fees';

function App() {

  return (
    <>

      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path="/student-dashboard/assignments" element={<Assignments />} />
              <Route path="/student-dashboard/notices" element={<Notices />} />
              <Route path="/student-dashboard/pay-fees" element={<Fees />} />


              <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
              <Route path="/teacher-dashboard/manage-assignments" element={<ManageAssignments />} />
              <Route path="/teacher-dashboard/announcements" element={<Anouncement />} />


              {/* Admin Routes */}
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin-dashboard/manage-courses" element={<ManageCourses />} />
              <Route path="/admin-dashboard/manage-users" element={<ManageUsers />} />
              <Route path="/admin-dashboard/manage-fees" element={<ManageFees />} />
              <Route path="/admin-dashboard/anouncements" element={<Anouncement />} />
              <Route path="/admin-dashboard/manage-assignments" element={<ManageAssignments />} />
            </Route>
          </Route>

        </Routes>
      </BrowserRouter>


    </>
  )
}

export default App
