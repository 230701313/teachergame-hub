
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import TeacherDashboard from './TeacherDashboard';
import StudentDashboard from './StudentDashboard';
import AnimatedTransition from '@/components/ui/AnimatedTransition';

const Dashboard = () => {
  const { user, loading, isTeacher, isStudent } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass p-8 rounded-xl shadow-lg flex flex-col items-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AnimatedTransition>
      {isTeacher() && <TeacherDashboard />}
      {isStudent() && <StudentDashboard />}
    </AnimatedTransition>
  );
};

export default Dashboard;
