import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getQuizzesByTeacher, getActiveQuizzes, getQuizStatus } from '@/utils/quiz';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/Navbar';
import { PlusCircle, Edit, Eye, BarChart3, AlignJustify, Calendar, Users } from 'lucide-react';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState(getQuizzesByTeacher(user?.id || ''));
  const [view, setView] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    setQuizzes(getQuizzesByTeacher(user?.id || ''));
  }, [user]);

  const publishedQuizzes = quizzes.filter(quiz => quiz.published);
  const draftQuizzes = quizzes.filter(quiz => !quiz.published);
  const activeQuizzes = quizzes.filter(quiz => getQuizStatus(quiz) === 'active');
  
  const getQuizStatus = (quiz: typeof quizzes[0]) => {
    const now = new Date();
    
    if (!quiz.published) {
      return 'draft';
    }
    
    if (quiz.startDate && new Date(quiz.startDate) > now) {
      return 'scheduled';
    }
    
    if (quiz.endDate && new Date(quiz.endDate) < now) {
      return 'ended';
    }
    
    return 'active';
  };

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
            <div className="flex flex-wrap gap-2">
              <Link to="/students">
                <Button variant="outline" className="rounded-full">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Students
                </Button>
              </Link>
              <Link to="/quizzes/create">
                <Button className="rounded-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Quiz
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            
            <Card className="glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">
                  {publishedQuizzes.filter(q => 
                    q.startDate && q.endDate && 
                    new Date(q.startDate) <= new Date() && 
                    new Date(q.endDate) >= new Date()
                  ).length}
                </CardTitle>
                <CardDescription>Active Quizzes</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </header>
        
        <Tabs defaultValue="all" className="animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="all">All Quizzes</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="ended">Ended</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button 
                variant={view === 'grid' ? 'default' : 'outline'} 
                size="icon" 
                onClick={() => setView('grid')}
                className="h-8 w-8"
              >
                <AlignJustify className="h-4 w-4" />
              </Button>
              <Button 
                variant={view === 'table' ? 'default' : 'outline'} 
                size="icon" 
                onClick={() => setView('table')}
                className="h-8 w-8"
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <TabsContent value="all">
            {renderQuizzes(quizzes, view)}
          </TabsContent>
          
          <TabsContent value="active">
            {renderQuizzes(activeQuizzes, view)}
          </TabsContent>
          
          <TabsContent value="drafts">
            {renderQuizzes(draftQuizzes, view)}
          </TabsContent>
          
          <TabsContent value="scheduled">
            {renderQuizzes(quizzes.filter(q => getQuizStatus(q) === 'scheduled'), view)}
          </TabsContent>
          
          <TabsContent value="ended">
            {renderQuizzes(quizzes.filter(q => getQuizStatus(q) === 'ended'), view)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

function renderQuizzes(quizzes: any[], view: 'grid' | 'table') {
  if (quizzes.length === 0) {
    return (
      <Card className="glass">
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <div className="rounded-full bg-primary/10 p-3 mb-4">
            <PlusCircle className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">No quizzes in this category</h3>
          <p className="text-muted-foreground mb-4">
            Create a new quiz or change the filter
          </p>
          <Link to="/quizzes/create">
            <Button className="rounded-full">
              Create Quiz
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }
  
  if (view === 'grid') {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
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
                {getQuizStatusBadge(quiz)}
              </div>
              <CardDescription className="line-clamp-2">
                {quiz.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex flex-col gap-1 text-sm">
                <p>
                  {quiz.questions.length} {quiz.questions.length === 1 ? 'question' : 'questions'}
                </p>
                {quiz.startDate && (
                  <p className="flex items-center text-muted-foreground">
                    <Calendar className="mr-1 h-3 w-3" />
                    Starts: {formatDate(quiz.startDate)}
                  </p>
                )}
                {quiz.endDate && (
                  <p className="flex items-center text-muted-foreground">
                    <Calendar className="mr-1 h-3 w-3" />
                    Ends: {formatDate(quiz.endDate)}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-2 flex-wrap">
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
    );
  }
  
  return (
    <Card className="glass">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Questions</th>
                <th className="text-left px-4 py-3 font-medium">Start Date</th>
                <th className="text-left px-4 py-3 font-medium">End Date</th>
                <th className="text-left px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz.id} className="border-b hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">{quiz.title}</td>
                  <td className="px-4 py-3">{getQuizStatusBadge(quiz)}</td>
                  <td className="px-4 py-3">{quiz.questions.length}</td>
                  <td className="px-4 py-3">
                    {quiz.startDate ? formatDate(quiz.startDate) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {quiz.endDate ? formatDate(quiz.endDate) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link to={`/quizzes/edit/${quiz.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link to={`/quizzes/preview/${quiz.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link to={`/quizzes/results/${quiz.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function getQuizStatusBadge(quiz: any) {
  const status = getQuizStatus(quiz);
  
  switch (status) {
    case 'draft':
      return (
        <Badge variant="outline">Draft</Badge>
      );
    case 'scheduled':
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          Scheduled
        </Badge>
      );
    case 'active':
      return (
        <Badge className="bg-green-600">Active</Badge>
      );
    case 'ended':
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
          Ended
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">{status}</Badge>
      );
  }
}

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

export default TeacherDashboard;
