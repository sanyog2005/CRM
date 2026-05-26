import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import AuthLayout from './components/AuthLayout';
import DashboardLayout from './components/DashboardLayout';

// Public Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Unauthorized from './pages/unauthorized';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AllStaff from './pages/admin/AllStaff';
import Branches from './pages/admin/Branches';
import AttendanceReports from './pages/admin/AttendanceReports';
import ActivityLogs from './pages/admin/ActivityLogs';
import AdLeadDashboard from './pages/admin/AdLeadDashboard';
import AdAddLeadPage from './pages/admin/AdAddLeadPage';
import AdLeadList from './pages/admin/AdLeadList';

// Manager Pages
import ManagerDashboard from './pages/manager/ManagerDashboard';
import BranchAttendance from './pages/manager/BranchAttendance';
import LeaveRequests from './pages/manager/LeaveRequests';
import MaLeadDashboard from './pages/manager/MaLeadDashboard';
import MaAddLeadPage from './pages/manager/MaAddLeadPage';
import MaLeadList from './pages/manager/MaLeadList';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';
import MyCalendar from './pages/staff/MyCalendar';
import MyLeaves from './pages/staff/MyLeaves';
import StLeadDashboard from './pages/staff/StLeadDashboard';
import StAddLeadPage from './pages/staff/StAddLeadPage';
import StLeadList from './pages/staff/StLeadList';

// Shared Pages
import LeadDetail from './pages/LeadDetail'; // ✅ Imported LeadDetail
import { Settings } from 'lucide-react';
import SettingsPage from './pages/SettingsPage';
import MaAllStaff from './pages/manager/MaAllStaff';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  
  if (!user) return <Navigate to="/" replace />;
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        
        {/* PUBLIC ROUTES */}
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout role="admin" />
          </ProtectedRoute>
        }>
          <Route index element={<AdLeadDashboard />} />
          <Route path="staff" element={<AllStaff />} />
          <Route path="branches" element={<Branches />} />
          <Route path="reports" element={<AttendanceReports />} />
          <Route path="logs" element={<ActivityLogs />} />
          <Route path="settings" element={<SettingsPage/>} />

          
          {/* Lead Management */}
          <Route path="adleads" element={<AdLeadDashboard />} />
          <Route path="ad-addlead" element={<AdAddLeadPage />} />
          <Route path="ad-leads" element={<AdLeadList />} />
          <Route path="leads/:id" element={<LeadDetail />} /> {/* ✅ Added */}
        </Route>

        {/* MANAGER ROUTES */}
        <Route path="/manager" element={
          <ProtectedRoute allowedRoles={['manager']}>
            <DashboardLayout role="manager" />
          </ProtectedRoute>
        }>
          <Route index element={<MaLeadDashboard />} />
          <Route path="attendance" element={<BranchAttendance />} />
          <Route path="leaves" element={<LeaveRequests />} />
          <Route path="settings" element={<SettingsPage/>} />
          <Route path="staff" element={<MaAllStaff />} />


          
          {/* Lead Management */}
          <Route path="maleads" element={<MaLeadDashboard />} />
          <Route path="ma-addlead" element={<MaAddLeadPage />} />
          <Route path="leads" element={<MaLeadList />} />
          <Route path="leads/:id" element={<LeadDetail />} /> {/* ✅ Added */}
        </Route>

        {/* STAFF ROUTES */}
        <Route path="/staff" element={
          <ProtectedRoute allowedRoles={['staff']}>
            <DashboardLayout role="staff" />
          </ProtectedRoute>
        }>
          <Route index element={<StLeadDashboard />} />
          <Route path="calendar" element={<MyCalendar />} />
          <Route path="leaves" element={<MyLeaves />} />
          
          {/* Lead Management */}
          <Route path="stleads" element={<StLeadDashboard />} />
          <Route path="st-addlead" element={<StAddLeadPage />} />
          <Route path="leads" element={<StLeadList />} />
          <Route path="leads/:id" element={<LeadDetail />} /> {/* ✅ Added */}
          <Route path="settings" element={<SettingsPage/>} />

        </Route>

      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}