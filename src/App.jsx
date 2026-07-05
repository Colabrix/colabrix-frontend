import { Route, Routes } from 'react-router-dom';
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
import OrgLayout from './components/layout/OrgLayout.jsx';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<div className="text-black">Home</div>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/check-email" element={<CheckEmailPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/get-started" element={<PostAuthDecisionPage />} />
        <Route path="/onboarding/profile" element={<ProfileSetupPage />} />
        <Route path="/onboarding/organization" element={<OrgSetupPage />} />
        <Route path="/org/select" element={<OrgSelectPage />} />
        <Route path="/org/:orgSlug" element={<OrgLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>
        <Route path="/piyush" element={<Piyush />} />
        <Route path="/harsh" element={<Harsh />} />
      </Routes>
    </>
  );
}

export default App;
