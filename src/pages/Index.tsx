import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, CheckCircle } from 'lucide-react';
import AnimatedTransition from '@/components/ui/AnimatedTransition';

const Index = () => {
  const { user } = useAuth();
  
  return (
    <AnimatedTransition>
      <div className="min-h-screen">
        <header className="absolute inset-x-0 top-0 z-50">
          <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
            <div className="flex lg:flex-1">
              <Link to="/" className="-m-1.5 p-1.5">
                <span className="text-xl font-bold">QuizMaster</span>
              </Link>
            </div>
            <div className="flex flex-1 justify-end">
              {user ? (
                <Link to="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
              )}
            </div>
          </nav>
        </header>
        
        <main>
          <section className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50 dark:from-background dark:to-background/50" />
            <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
            
            <div className="container relative z-10 mx-auto px-4 py-32 sm:px-6 lg:flex lg:h-screen lg:items-center lg:px-8">
              <div className="max-w-2xl">
                <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl">
                  Interactive Learning
                  <strong className="block font-extrabold text-primary">
                    Made Simple
                  </strong>
                </h1>
                
                <p className="mt-4 max-w-xl text-lg text-muted-foreground">
                  Create, share, and track quizzes with ease. Perfect for teachers and students.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center md:justify-start">
                  {user ? (
                    <Link to="/dashboard">
                      <Button size="lg" className="rounded-full px-8 h-12 shadow-md hover:shadow-lg transition-all">
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/register">
                        <Button size="lg" className="rounded-full px-8 h-12 shadow-md hover:shadow-lg transition-all">
                          Create Account
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                      <Link to="/login">
                        <Button 
                          size="lg" 
                          variant="outline" 
                          className="rounded-full px-8 h-12 shadow-md hover:shadow-lg transition-all"
                        >
                          Login
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
          
          <section className="py-24 px-4 bg-muted/50">
            <div className="container mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-card p-6 rounded-xl shadow-sm">
                  <div className="mb-4 text-primary">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Easy Quiz Creation</h3>
                  <p className="text-muted-foreground">
                    Create engaging quizzes with multiple question types in minutes.
                  </p>
                </div>
                
                <div className="bg-card p-6 rounded-xl shadow-sm">
                  <div className="mb-4 text-primary">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Real-time Results</h3>
                  <p className="text-muted-foreground">
                    Get instant feedback and detailed analytics on student performance.
                  </p>
                </div>
                
                <div className="bg-card p-6 rounded-xl shadow-sm">
                  <div className="mb-4 text-primary">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Accessible Anywhere</h3>
                  <p className="text-muted-foreground">
                    Access your quizzes from any device with an internet connection.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </AnimatedTransition>
  );
};

export default Index;
