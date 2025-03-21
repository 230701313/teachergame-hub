
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getQuizById, generateId, calculateScore } from '@/utils/quiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import { ChevronLeft, ChevronRight, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import AnimatedTransition from '@/components/ui/AnimatedTransition';

const QuizView: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  
  const quiz = getQuizById(quizId || '');
  
  useEffect(() => {
    // If quiz doesn't exist, redirect to dashboard
    if (!quiz) {
      toast.error('Quiz not found');
      navigate('/dashboard');
    }
  }, [quiz, navigate]);
  
  useEffect(() => {
    if (quizStarted && !quizCompleted) {
      // Set a timer of 30 seconds per question
      const totalTime = quiz?.questions.length || 0 * 30;
      setTimeLeft(totalTime);
      
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            submitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [quizStarted, quizCompleted]);
  
  if (!quiz) {
    return null;
  }
  
  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setAnswers({});
  };
  
  const handleAnswer = (questionId: string, optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };
  
  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };
  
  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };
  
  const isQuestionAnswered = (questionId: string) => {
    return typeof answers[questionId] === 'number';
  };
  
  const submitQuiz = () => {
    // Calculate score
    const calculatedScore = calculateScore(quiz, answers);
    setScore(calculatedScore);
    
    // In a real app, submit to API
    const submission = {
      id: generateId(),
      quizId: quiz.id,
      userId: user?.id || '',
      answers,
      score: calculatedScore,
      submittedAt: new Date().toISOString()
    };
    
    console.log('Quiz submission:', submission);
    
    setQuizCompleted(true);
    toast.success('Quiz submitted successfully!');
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  if (!quizStarted) {
    return (
      <AnimatedTransition>
        <div className="min-h-screen">
          <Navbar />
          
          <div className="container pt-24 max-w-3xl mx-auto px-4 pb-16">
            <Card className="glass overflow-hidden mt-8">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{quiz.title}</CardTitle>
                <p className="text-muted-foreground mt-2">{quiz.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <span className="font-medium">{quiz.questions.length} questions</span>
                    <Separator orientation="vertical" className="h-4" />
                    <span>Approximately {quiz.questions.length} minutes</span>
                  </div>
                  
                  <div className="rounded-full bg-primary/10 p-3 mt-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  
                  <p className="max-w-md">
                    You're about to start the quiz. Once started, you'll have limited time to complete all questions.
                  </p>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 p-4 rounded-lg flex items-start mt-4">
                    <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">
                      Make sure you're ready before starting. The timer will begin immediately.
                    </p>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-center pb-8">
                <Button 
                  onClick={startQuiz} 
                  size="lg" 
                  className="rounded-full px-8"
                >
                  Start Quiz
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </AnimatedTransition>
    );
  }
  
  if (quizCompleted) {
    return (
      <AnimatedTransition>
        <div className="min-h-screen">
          <Navbar />
          
          <div className="container pt-24 max-w-3xl mx-auto px-4 pb-16">
            <Card className="glass overflow-hidden mt-8">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
                <p className="text-muted-foreground mt-2">{quiz.title}</p>
              </CardHeader>
              
              <CardContent className="space-y-8">
                <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                  <h3 className="text-3xl font-bold">
                    Your Score: {score.toFixed(0)}%
                  </h3>
                  
                  <div className="w-full max-w-sm">
                    <Progress 
                      value={score} 
                      className="h-3"
                      indicatorClassName={
                        score >= 80 ? "bg-green-500" :
                        score >= 60 ? "bg-amber-500" :
                        "bg-red-500"
                      }
                    />
                  </div>
                  
                  <p className="text-muted-foreground">
                    {score >= 80 ? "Excellent work!" : 
                     score >= 60 ? "Good job!" : 
                     "Keep practicing!"}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-center">Quiz Summary</h4>
                  
                  <div className="flex justify-between rounded-lg border p-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Questions</p>
                      <p className="font-medium">{quiz.questions.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Correct Answers</p>
                      <p className="font-medium">
                        {Math.round(score / 100 * quiz.questions.length)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Incorrect Answers</p>
                      <p className="font-medium">
                        {quiz.questions.length - Math.round(score / 100 * quiz.questions.length)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-center space-x-4 pb-8">
                <Link to="/dashboard">
                  <Button className="rounded-full px-8">
                    Back to Dashboard
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </AnimatedTransition>
    );
  }
  
  const question = quiz.questions[currentQuestion];
  const progress = (currentQuestion / quiz.questions.length) * 100;
  const hasAnswer = isQuestionAnswered(question.id);
  
  return (
    <AnimatedTransition>
      <div className="min-h-screen">
        <Navbar />
        
        <div className="container pt-24 max-w-3xl mx-auto px-4 pb-16">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              {formatTime(timeLeft)}
            </div>
          </div>
          
          <Progress value={progress} className="mb-6 h-2" />
          
          <Card className="glass overflow-hidden animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl">{question.text}</CardTitle>
            </CardHeader>
            
            <CardContent>
              <RadioGroup 
                value={
                  typeof answers[question.id] === 'number' 
                    ? String(answers[question.id]) 
                    : undefined
                }
                onValueChange={(value) => handleAnswer(question.id, parseInt(value))}
                className="space-y-3"
              >
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={String(index)} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="cursor-pointer py-2">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                onClick={prevQuestion} 
                disabled={currentQuestion === 0}
                variant="outline"
                className="rounded-full"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
              
              {currentQuestion < quiz.questions.length - 1 ? (
                <Button 
                  onClick={nextQuestion} 
                  disabled={!hasAnswer}
                  className="rounded-full"
                >
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  onClick={submitQuiz} 
                  disabled={!hasAnswer}
                  className="rounded-full"
                >
                  Submit Quiz
                  <CheckCircle className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </Card>
          
          <div className="flex justify-center mt-6">
            <div className="flex space-x-1">
              {quiz.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentQuestion
                      ? 'bg-primary'
                      : isQuestionAnswered(quiz.questions[index].id)
                      ? 'bg-primary/50'
                      : 'bg-muted'
                  }`}
                  aria-label={`Go to question ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedTransition>
  );
};

export default QuizView;
