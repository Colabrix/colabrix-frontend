import React, { useEffect } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import Sidebar from '../shared/Sidebar/Sidebar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function OrgLayout() {
  const { orgSlug } = useParams();
  const { organizations, loading, activeOrgSlug, setActiveOrgSlug } = useAuth();

  useEffect(() => {
    if (orgSlug && orgSlug !== activeOrgSlug) {
      setActiveOrgSlug(orgSlug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgSlug]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white text-sm text-secondary-gray">
        Loading…
      </div>
    );
  }

  const membership = organizations.find((m) => m.organization.slug === orgSlug);

  if (!membership) {
    return <Navigate to="/org/select" replace />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar organization={membership.organization} />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
