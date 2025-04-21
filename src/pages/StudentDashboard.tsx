
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getPublishedQuizzes, getSubmissionsByUser } from '@/utils/quiz';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/Navbar';
import { CheckCircle, ListTodo, BarChart3, Clock, Eye, Users, Calendar } from 'lucide-react';
import AnimatedTransition from '@/components/ui/AnimatedTransition';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const allQuizzes = getPublishedQuizzes();
  const submissions = getSubmissionsByUser(user?.id || '');
  
  // Get IDs of completed quizzes
  const completedQuizIds = submissions.map(sub => sub.quizId);
  
  // Filter quizzes to those not yet completed
  let availableQuizzes = allQuizzes.filter(quiz => !completedQuizIds.includes(quiz.id));
  
  // Filter available quizzes based on date constraints
  const now = new Date();
  availableQuizzes = availableQuizzes.filter(quiz => {
    // Skip if quiz has a start date that hasn't been reached yet
    if (quiz.startDate && new Date(quiz.startDate) > now) {
      return false;
    }
    
    // Skip if quiz has an end date that has already passed
    if (quiz.endDate && new Date(quiz.endDate) < now) {
      return false;
    }
    
    return true;
  });
  
  // Get all teachers connected to the student
  const teacherIds = user?.classroomIds || [];
  
  return (
    <div className="min-h-screen pb-16">
      <Navbar />
      
      <div className="container pt-24 max-w-6xl mx-auto px-4">
        <header className="mb-8 pt-8 animate-slide-down">
          <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">Student Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, {user?.name}
              </p>
            </div>
            <Link to="/active-users">
              <Button variant="outline" className="rounded-full">
                <Users className="mr-2 h-4 w-4" />
                Active Users
              </Button>
            </Link>
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
        
        <Tabs defaultValue="available" className="animate-slide-up">
          <TabsList className="mb-4">
            <TabsTrigger value="available">Available Quizzes</TabsTrigger>
            <TabsTrigger value="completed">Completed Quizzes</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Quizzes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available">
            <section className="mb-8">
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
                      {quiz.imageUrl && (
                        <div className="h-40 overflow-hidden">
                          <img 
                            src={quiz.imageUrl} 
                            alt={quiz.title} 
                            className="w-full h-full object-cover transition-transform hover:scale-105" 
                          />
                        </div>
                      )}
                      <CardHeader className={`pb-2 ${quiz.imageUrl ? 'pt-3' : ''}`}>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{quiz.title}</CardTitle>
                          <Badge className="bg-green-600">Available</Badge>
                        </div>
                        <CardDescription className="line-clamp-2">
                          {quiz.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex flex-col gap-1 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            <span>{quiz.questions.length} questions</span>
                          </div>
                          {quiz.endDate && (
                            <div className="flex items-center text-muted-foreground">
                              <Calendar className="mr-1 h-3 w-3" />
                              <span>Ends: {formatDate(quiz.endDate)}</span>
                            </div>
                          )}
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
          </TabsContent>
          
          <TabsContent value="completed">
            <section>
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
                    const quiz = allQuizzes.find(q => q.id === submission.quizId);
                    if (!quiz) return null;
                    
                    return (
                      <Card key={submission.id} className="glass overflow-hidden transition-all hover:shadow-md">
                        {quiz.imageUrl && (
                          <div className="h-40 overflow-hidden">
                            <img 
                              src={quiz.imageUrl} 
                              alt={quiz.title} 
                              className="w-full h-full object-cover transition-transform hover:scale-105" 
                            />
                          </div>
                        )}
                        <CardHeader className={`pb-2 ${quiz.imageUrl ? 'pt-3' : ''}`}>
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
          </TabsContent>
          
          <TabsContent value="upcoming">
            <section>
              {allQuizzes.filter(quiz => quiz.startDate && new Date(quiz.startDate) > new Date()).length === 0 ? (
                <Card className="glass">
                  <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="rounded-full bg-primary/10 p-3 mb-4">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No upcoming quizzes</h3>
                    <p className="text-muted-foreground">
                      There are no scheduled quizzes at the moment
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {allQuizzes
                    .filter(quiz => quiz.startDate && new Date(quiz.startDate) > new Date())
                    .map((quiz) => (
                      <Card key={quiz.id} className="glass overflow-hidden transition-all hover:shadow-md">
                        {quiz.imageUrl && (
                          <div className="h-40 overflow-hidden">
                            <img 
                              src={quiz.imageUrl} 
                              alt={quiz.title} 
                              className="w-full h-full object-cover transition-transform hover:scale-105" 
                            />
                          </div>
                        )}
                        <CardHeader className={`pb-2 ${quiz.imageUrl ? 'pt-3' : ''}`}>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{quiz.title}</CardTitle>
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              Upcoming
                            </Badge>
                          </div>
                          <CardDescription className="line-clamp-2">
                            {quiz.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex flex-col gap-1 text-sm">
                            <div className="flex items-center text-muted-foreground">
                              <Clock className="mr-1 h-3 w-3" />
                              <span>{quiz.questions.length} questions</span>
                            </div>
                            {quiz.startDate && (
                              <div className="flex items-center text-muted-foreground">
                                <Calendar className="mr-1 h-3 w-3" />
                                <span>Starts: {formatDate(quiz.startDate)}</span>
                              </div>
                            )}
                            {quiz.endDate && (
                              <div className="flex items-center text-muted-foreground">
                                <Calendar className="mr-1 h-3 w-3" />
                                <span>Ends: {formatDate(quiz.endDate)}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default StudentDashboard;
