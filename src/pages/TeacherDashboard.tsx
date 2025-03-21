
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getQuizzesByTeacher } from '@/utils/quiz';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import { PlusCircle, Edit, Eye, BarChart3, AlignJustify } from 'lucide-react';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const quizzes = getQuizzesByTeacher(user?.id || '');

  const publishedQuizzes = quizzes.filter(quiz => quiz.published);
  const draftQuizzes = quizzes.filter(quiz => !quiz.published);

  return (
    <div className="min-h-screen pb-16">
      <Navbar />
      
      <div className="container pt-24 max-w-6xl mx-auto px-4">
        <header className="mb-8 pt-8 animate-slide-down">
          <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, {user?.name}
              </p>
            </div>
            <Link to="/quizzes/create">
              <Button className="rounded-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Quiz
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{quizzes.length}</CardTitle>
                <CardDescription>Total Quizzes</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{publishedQuizzes.length}</CardTitle>
                <CardDescription>Published Quizzes</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{draftQuizzes.length}</CardTitle>
                <CardDescription>Draft Quizzes</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </header>
        
        <section className="mb-8 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center">
              <AlignJustify className="mr-2 h-5 w-5" />
              Your Quizzes
            </h2>
          </div>
          
          {quizzes.length === 0 ? (
            <Card className="glass">
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <PlusCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">No quizzes yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first quiz to get started
                </p>
                <Link to="/quizzes/create">
                  <Button className="rounded-full">
                    Create Quiz
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {quizzes.map((quiz) => (
                <Card key={quiz.id} className="glass overflow-hidden transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{quiz.title}</CardTitle>
                      <Badge variant={quiz.published ? "default" : "outline"}>
                        {quiz.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {quiz.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm">
                      {quiz.questions.length} {quiz.questions.length === 1 ? 'question' : 'questions'}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between gap-2">
                    <Link to={`/quizzes/edit/${quiz.id}`}>
                      <Button variant="outline" size="sm" className="rounded-full">
                        <Edit className="mr-1 h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                    <Link to={`/quizzes/preview/${quiz.id}`}>
                      <Button variant="outline" size="sm" className="rounded-full">
                        <Eye className="mr-1 h-4 w-4" />
                        Preview
                      </Button>
                    </Link>
                    <Link to={`/quizzes/results/${quiz.id}`}>
                      <Button variant="outline" size="sm" className="rounded-full">
                        <BarChart3 className="mr-1 h-4 w-4" />
                        Results
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
              
              <Link to="/quizzes/create">
                <Card className="glass h-full border-dashed hover:border-primary/50 transition-all cursor-pointer flex flex-col justify-center items-center p-8">
                  <PlusCircle className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground text-center font-medium">
                    Create New Quiz
                  </p>
                </Card>
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default TeacherDashboard;
