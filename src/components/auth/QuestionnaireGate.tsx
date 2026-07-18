import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

/**
 * Blocks access to the platform until the user has completed the
 * mandatory one-time baseline questionnaire. Users who already
 * completed it are kept away from the questionnaire route.
 */
const QuestionnaireGate = () => {
  const { user } = useAuth();
  const location = useLocation();
  const result = useQuery(
    api.questionnaireResults.getMyResult,
    user ? { userId: user.id } : 'skip',
  );

  if (result === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const onQuestionnaireRoute = location.pathname.startsWith('/questionnaire');

  if (result === null && !onQuestionnaireRoute) {
    return <Navigate to="/questionnaire" replace />;
  }

  if (result !== null && onQuestionnaireRoute) {
    return <Navigate to="/dashboard/training" replace />;
  }

  return <Outlet />;
};

export default QuestionnaireGate;
