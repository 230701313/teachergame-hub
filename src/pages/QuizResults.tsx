
import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getQuizById, getSubmissionsByQuiz } from '@/utils/quiz';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Navbar from '@/components/layout/Navbar';
import { BarChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import { BarChart3, PieChart as PieChartIcon, Eye, ArrowLeft, Check, X } from 'lucide-react';
import AnimatedTransition from '@/components/ui/AnimatedTransition';

const QuizResults: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const { user } = useAuth();
  
  const quiz = getQuizById(quizId || '');
  const submissions = getSubmissionsByQuiz(quizId || '');
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!quiz) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Check if user is authorized to view this quiz's results
  if (user.role === 'teacher' && quiz.createdBy !== user.id) {
    return <Navigate to="/dashboard" replace />;
  } else if (user.role === 'student' && !submissions.some(s => s.userId === user.id)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Format data for the score distribution chart
  const scoreRanges = [
    { name: '0-20%', range: [0, 20], count: 0 },
    { name: '21-40%', range: [21, 40], count: 0 },
    { name: '41-60%', range: [41, 60], count: 0 },
    { name: '61-80%', range: [61, 80], count: 0 },
    { name: '81-100%', range: [81, 100], count: 0 },
  ];
  
  submissions.forEach(sub => {
    const score = Math.round(sub.score);
    for (const range of scoreRanges) {
      if (score >= range.range[0] && score <= range.range[1]) {
        range.count++;
        break;
      }
    }
  });
  
  // Calculate average score
  const averageScore = submissions.length > 0
    ? Math.round(submissions.reduce((sum, sub) => sum + sub.score, 0) / submissions.length)
    : 0;
  
  // Calculate performance by question
  const questionPerformance = quiz.questions.map((q, index) => {
    let correct = 0;
    let incorrect = 0;
    
    submissions.forEach(sub => {
      const questionId = q.id;
      const userAnswer = sub.answers[questionId];
      
      if (userAnswer === q.correctOption) {
        correct++;
      } else {
        incorrect++;
      }
    });
    
    return {
      name: `Q${index + 1}`,
      correct,
      incorrect,
      total: submissions.length,
      percentage: submissions.length > 0 ? Math.round((correct / submissions.length) * 100) : 0
    };
  });
  
  // Colors for the charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  return (
    <AnimatedTransition>
      <div className="min-h-screen pb-16">
        <Navbar />
        
        <div className="container pt-24 max-w-6xl mx-auto px-4">
          <header className="mb-8 pt-8">
            <div className="flex items-center mb-4">
              <Link to="/dashboard">
                <Button variant="ghost" className="p-0 mr-2">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">Quiz Results</h1>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <h2 className="text-xl font-medium">{quiz.title}</h2>
                <p className="text-muted-foreground">{quiz.description}</p>
              </div>
              {user.role === 'teacher' && (
                <Link to={`/quizzes/edit/${quiz.id}`}>
                  <Button variant="outline">
                    Edit Quiz
                  </Button>
                </Link>
              )}
            </div>
          </header>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card className="glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Submissions</CardTitle>
                <div className="text-3xl font-bold mt-2">{submissions.length}</div>
              </CardHeader>
            </Card>
            
            <Card className="glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Average Score</CardTitle>
                <div className="text-3xl font-bold mt-2">{averageScore}%</div>
              </CardHeader>
            </Card>
            
            <Card className="glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Pass Rate</CardTitle>
                <div className="text-3xl font-bold mt-2">
                  {submissions.length > 0 
                    ? Math.round((submissions.filter(s => s.score >= 60).length / submissions.length) * 100)
                    : 0}%
                </div>
              </CardHeader>
            </Card>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Score Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreRanges}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="Number of Students" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChartIcon className="mr-2 h-5 w-5" />
                  Performance by Question
                </CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={questionPerformance}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="percentage"
                    >
                      {questionPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card className="glass mb-8">
            <CardHeader>
              <CardTitle>Question Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Correct Answers</TableHead>
                    <TableHead>Incorrect Answers</TableHead>
                    <TableHead>Success Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questionPerformance.map((q, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">Question {index + 1}</TableCell>
                      <TableCell>{q.correct}</TableCell>
                      <TableCell>{q.incorrect}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                            <div 
                              className="bg-primary h-2.5 rounded-full" 
                              style={{ width: `${q.percentage}%` }}
                            ></div>
                          </div>
                          <span>{q.percentage}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          {user.role === 'teacher' && (
            <Card className="glass">
              <CardHeader>
                <CardTitle>Student Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                {submissions.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No students have submitted this quiz yet
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell className="font-mono">{submission.userId}</TableCell>
                          <TableCell>{Math.round(submission.score)}%</TableCell>
                          <TableCell>{new Date(submission.submittedAt).toLocaleString()}</TableCell>
                          <TableCell>
                            {submission.score >= 60 ? (
                              <span className="flex items-center text-green-600 dark:text-green-400">
                                <Check className="h-4 w-4 mr-1" />
                                Pass
                              </span>
                            ) : (
                              <span className="flex items-center text-red-600 dark:text-red-400">
                                <X className="h-4 w-4 mr-1" />
                                Fail
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/quizzes/submission/${submission.id}`}>
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AnimatedTransition>
  );
};

export default QuizResults;
