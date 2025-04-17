
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import { GraduationCap, BookUser, ArrowRight, CheckCircle, LightbulbIcon, Brain, Award } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 dark:from-amber-950 dark:via-yellow-950 dark:to-amber-900 -z-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-[10%] w-96 h-96 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-[5%] w-64 h-64 bg-indigo-400/10 dark:bg-indigo-400/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-[30%] left-[15%] w-72 h-72 bg-amber-300/20 dark:bg-amber-300/10 rounded-full blur-3xl -z-10"></div>
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxMTExMTEiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PHBhdGggZD0iTTM2IDM0djNjMCAxLS40NCAyLTEgMmgtOWMtLjU2IDAtMS0xLTEtMnYtM2g0di0xaC0yNWMtLjU1IDAtMS0uNDUtMS0xcy40NS0xIDEtMWgyNXYtMWgtNC41Yy0uOTcgMC0yLS41OC0yLTIgMC0uNTUuNDUtMSAxLTFoMTBjLjU1IDAgMSAuNDUgMSAxIDAgLjU1LS40NSAxLTEgMWgtNGMtLjU1IDAtMS0uNDUtMS0xdi0xaDIxYy41NSAwIDEgLjQ1IDEgMXMtLjQ1IDEtMSAxaC0yMXYxaDQuNWMuOTcgMCAyIC41OCAyIDIgMCAuNTUtLjQ1IDEtMSAxaC0xMGMtLjU1IDAtMS0uNDUtMS0xIDAtLjU1LjQ1LTEgMS0xaDRjLjU1IDAgMSAuNDUgMSAxdjFoLTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-60 dark:opacity-40 bg-fixed -z-10"></div>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 md:py-24">
        <div className="container max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
            <div className="flex-1 space-y-6 text-center md:text-left animate-slide-up">
              <div>
                <span className="inline-block text-sm font-medium py-1 px-3 rounded-full bg-primary/10 text-primary mb-4 shadow-sm">
                  Streamlined Learning Experience
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Quiz Platform for <br className="hidden sm:inline" />
                <span className="text-primary relative inline-block">
                  Teachers & Students
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-primary/30 rounded-full"></span>
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto md:mx-0">
                Create, assign, and take quizzes with our elegant and intuitive platform. Designed for simplicity and effectiveness.
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
                  <Link to="/login">
                    <Button size="lg" className="rounded-full px-8 h-12 shadow-md hover:shadow-lg transition-all">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                )}
                <Link to={user ? "/dashboard" : "/login"} className="text-muted-foreground hover:text-primary transition-colors underline underline-offset-4">
                  Learn more about our features
                </Link>
              </div>
            </div>

            <div className="flex-1 glass p-8 rounded-3xl shadow-lg max-w-md animate-slide-up animation-delay-300 relative">
              {/* Decorative corner dots */}
              <div className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-amber-300"></div>
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-blue-300"></div>
              <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-indigo-300"></div>
              <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-full bg-emerald-300"></div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">Choose your path</h2>
                  <p className="text-muted-foreground">Join our platform as a teacher or student</p>
                </div>

                <div className="grid gap-4">
                  <div className="glass rounded-xl p-5 border border-blue-200/50 dark:border-blue-500/20 hover:border-blue-300 dark:hover:border-blue-500/40 transition-all hover:shadow-md hover:-translate-y-0.5">
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

                  <div className="glass rounded-xl p-5 border border-indigo-200/50 dark:border-indigo-500/20 hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all hover:shadow-md hover:-translate-y-0.5">
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
          
          {/* Features section */}
          <div className="mt-24 mb-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose QuizMaster?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Our platform provides everything you need for effective assessment and learning</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="glass p-6 rounded-xl hover:shadow-md transition-all">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 w-fit mb-4">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
                <p className="text-muted-foreground">Intuitive interface designed for both teachers and students with minimal learning curve.</p>
              </div>
              
              <div className="glass p-6 rounded-xl hover:shadow-md transition-all">
                <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 w-fit mb-4">
                  <LightbulbIcon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Flexible Format</h3>
                <p className="text-muted-foreground">Create multiple-choice, true/false, and short answer questions to test different skills.</p>
              </div>
              
              <div className="glass p-6 rounded-xl hover:shadow-md transition-all">
                <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 w-fit mb-4">
                  <Brain className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Analytics</h3>
                <p className="text-muted-foreground">Track performance and identify areas for improvement with detailed insights.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 border-t border-border">
        <div className="container text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} QuizMaster. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
