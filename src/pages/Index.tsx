
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import { GraduationCap, BookUser, ArrowRight } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 -z-10"></div>
      
      {/* Decorative circles */}
      <div className="absolute top-20 right-[10%] w-96 h-96 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-[5%] w-64 h-64 bg-indigo-400/10 dark:bg-indigo-400/5 rounded-full blur-3xl -z-10"></div>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 md:py-32">
        <div className="container max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
            <div className="flex-1 space-y-6 text-center md:text-left animate-slide-up">
              <div>
                <span className="inline-block text-sm font-medium py-1 px-3 rounded-full bg-primary/10 text-primary mb-4">
                  Streamlined Learning Experience
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Quiz Platform for <br className="hidden sm:inline" />
                <span className="text-primary">Teachers & Students</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto md:mx-0">
                Create, assign, and take quizzes with our elegant and intuitive platform. Designed for simplicity and effectiveness.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center md:justify-start">
                {user ? (
                  <Link to="/dashboard">
                    <Button size="lg" className="rounded-full px-8 h-12">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <Button size="lg" className="rounded-full px-8 h-12">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            <div className="flex-1 glass p-8 rounded-3xl shadow-lg max-w-md animate-slide-up animation-delay-300">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">Choose your path</h2>
                  <p className="text-muted-foreground">Join our platform as a teacher or student</p>
                </div>

                <div className="grid gap-4">
                  <div className="glass rounded-xl p-5 border border-blue-200/50 dark:border-blue-500/20 hover:border-blue-300 dark:hover:border-blue-500/40 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        <BookUser className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium">For Teachers</h3>
                        <p className="text-sm text-muted-foreground mt-1">Create and manage quizzes, track student performance</p>
                      </div>
                    </div>
                  </div>

                  <div className="glass rounded-xl p-5 border border-indigo-200/50 dark:border-indigo-500/20 hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                        <GraduationCap className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium">For Students</h3>
                        <p className="text-sm text-muted-foreground mt-1">Take quizzes, review results, and track progress</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-center text-muted-foreground">
                  "The most intuitive quiz platform I've ever used."
                  <p className="font-medium text-foreground mt-1">— Education Today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground">
        <div className="container">
          <p>© {new Date().getFullYear()} QuizMaster. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
