import { Navigate, Route, Routes } from 'react-router-dom';
import Piyush from './test-grounds/piyush';
import Harsh from './test-grounds/harsh';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CheckEmailPage from './pages/CheckEmailPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import PostAuthDecisionPage from './pages/PostAuthDecisionPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import OrgSetupPage from './pages/OrgSetupPage';
import OrgSelectPage from './pages/OrgSelectPage';
import DashboardPage from './pages/DashboardPage';
import InviteAcceptPage from './pages/InviteAcceptPage';
import TeamSettingsPage from './pages/TeamSettingsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import OrgLayout from './components/layout/OrgLayout.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { resolveOrgDestination } from './lib/orgRedirect.js';

function HomeRedirect() {
  const { user, organizations, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white text-sm text-secondary-gray">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={resolveOrgDestination(organizations)} replace />;
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/check-email" element={<CheckEmailPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/get-started" element={<PostAuthDecisionPage />} />
        <Route path="/onboarding/profile" element={<ProfileSetupPage />} />
        <Route path="/onboarding/organization" element={<OrgSetupPage />} />
        <Route path="/org/select" element={<OrgSelectPage />} />
        <Route path="/invite/:token" element={<InviteAcceptPage />} />
        <Route path="/org/:orgSlug" element={<OrgLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="settings/team" element={<TeamSettingsPage />} />
        </Route>
        <Route path="/piyush" element={<Piyush />} />
        <Route path="/harsh" element={<Harsh />} />
      </Routes>
    </>
  );
}

export default App;
