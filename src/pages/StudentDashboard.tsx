
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getPublishedQuizzes, getSubmissionsByUser } from '@/utils/quiz';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import { CheckCircle, ListTodo, BarChart3, Clock, Eye } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const quizzes = getPublishedQuizzes();
  const submissions = getSubmissionsByUser(user?.id || '');
  
  // Get IDs of completed quizzes
  const completedQuizIds = submissions.map(sub => sub.quizId);
  
  // Filter quizzes to those not yet completed
  const availableQuizzes = quizzes.filter(quiz => !completedQuizIds.includes(quiz.id));
  
  return (
    <div className="min-h-screen pb-16">
      <Navbar />
      
      <div className="container pt-24 max-w-6xl mx-auto px-4">
        <header className="mb-8 pt-8 animate-slide-down">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Student Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.name}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{submissions.length}</CardTitle>
                <CardDescription>Completed Quizzes</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{availableQuizzes.length}</CardTitle>
                <CardDescription>Available Quizzes</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="glass">
              <CardHeader className="pb-2">
                {submissions.length > 0 ? (
                  <CardTitle className="text-2xl">
                    {Math.round(submissions.reduce((acc, sub) => acc + sub.score, 0) / submissions.length)}%
                  </CardTitle>
                ) : (
                  <CardTitle className="text-2xl">-</CardTitle>
                )}
                <CardDescription>Average Score</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </header>
        
        <section className="mb-8 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center">
              <ListTodo className="mr-2 h-5 w-5" />
              Available Quizzes
            </h2>
          </div>
          
          {availableQuizzes.length === 0 ? (
            <Card className="glass">
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                <p className="text-muted-foreground">
                  You've completed all available quizzes.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {availableQuizzes.map((quiz) => (
                <Card key={quiz.id} className="glass overflow-hidden transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {quiz.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      <span>{quiz.questions.length} questions</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link to={`/quizzes/take/${quiz.id}`} className="w-full">
                      <Button className="w-full rounded-full">
                        Start Quiz
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>
        
        <section className="animate-slide-up animation-delay-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Your Results
            </h2>
          </div>
          
          {submissions.length === 0 ? (
            <Card className="glass">
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <ListTodo className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">No results yet</h3>
                <p className="text-muted-foreground mb-4">
                  Complete quizzes to see your results here
                </p>
                <Link to="/quizzes">
                  <Button className="rounded-full">
                    See Available Quizzes
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {submissions.map((submission) => {
                const quiz = quizzes.find(q => q.id === submission.quizId);
                if (!quiz) return null;
                
                return (
                  <Card key={submission.id} className="glass overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{quiz.title}</CardTitle>
                      <CardDescription>
                        Completed on {new Date(submission.submittedAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Score:</span>
                          <span className={`font-medium ${
                            submission.score >= 80 ? 'text-green-600 dark:text-green-400' : 
                            submission.score >= 60 ? 'text-amber-600 dark:text-amber-400' : 
                            'text-red-600 dark:text-red-400'
                          }`}>
                            {submission.score.toFixed(0)}%
                          </span>
                        </div>
                        
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              submission.score >= 80 ? 'bg-green-500' : 
                              submission.score >= 60 ? 'bg-amber-500' : 
                              'bg-red-500'
                            }`} 
                            style={{ width: `${submission.score}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link to={`/quizzes/results/${submission.id}`} className="w-full">
                        <Button variant="outline" className="w-full rounded-full">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default StudentDashboard;
