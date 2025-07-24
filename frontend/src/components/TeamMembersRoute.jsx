// frontend/src/routes/TeamMemberRoute.jsx

import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

function TeamMemberRoute({ children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'Team Member') return <Navigate to="/dashboard" />;

  return children;
}

export default TeamMemberRoute;
