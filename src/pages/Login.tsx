
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import Navbar from '@/components/layout/Navbar';
import AnimatedTransition from '@/components/ui/AnimatedTransition';

const Login = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AnimatedTransition>
      <div className="min-h-screen relative">
        <Navbar />
        
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 -z-10"></div>
        
        {/* Decorative circles */}
        <div className="absolute top-20 right-[10%] w-96 h-96 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-20 left-[5%] w-64 h-64 bg-indigo-400/10 dark:bg-indigo-400/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="container max-w-6xl mx-auto pt-32 pb-16 px-4">
          <LoginForm />
        </div>
      </div>
    </AnimatedTransition>
  );
};

export default Login;
