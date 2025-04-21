
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getQuizById, Question, QuestionType } from '@/utils/quiz';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import { X, PlusCircle, Save, Check, Calendar, Clock, Image } from 'lucide-react';
import AnimatedTransition from '@/components/ui/AnimatedTransition';

const QuizEdit: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const existingQuiz = getQuizById(quizId || '');
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  useEffect(() => {
    if (!existingQuiz) {
      toast.error('Quiz not found');
      navigate('/dashboard');
      return;
    }
    
    setTitle(existingQuiz.title);
    setDescription(existingQuiz.description);
    setQuestions(existingQuiz.questions);
    setStartDate(existingQuiz.startDate || '');
    setEndDate(existingQuiz.endDate || '');
    setImageUrl(existingQuiz.imageUrl || '');
  }, [existingQuiz, navigate]);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'teacher') {
    return <Navigate to="/dashboard" replace />;
  }
  
  if (!existingQuiz) {
    return null;
  }
  
  const addQuestion = () => {
    setQuestions(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        text: '',
        type: 'multiple-choice',
        options: ['', '', '', ''],
        correctOption: 0
      }
    ]);
  };
  
  const removeQuestion = (index: number) => {
    if (questions.length <= 1) {
      toast.error('A quiz must have at least one question');
      return;
    }
    
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };
  
  const updateQuestionText = (index: number, text: string) => {
    setQuestions(prev => 
      prev.map((q, i) => (i === index ? { ...q, text } : q))
    );
  };
  
  const updateQuestionType = (index: number, type: QuestionType) => {
    setQuestions(prev => 
      prev.map((q, i) => {
        if (i !== index) return q;
        
        let options: string[] = [];
        let correctOption = 0;
        
        switch (type) {
          case 'multiple-choice':
            options = ['', '', '', ''];
            break;
          case 'true-false':
            options = ['True', 'False'];
            break;
          case 'fill-in-blank':
            options = [''];
            break;
        }
        
        return { ...q, type, options, correctOption };
      })
    );
  };
  
  const updateQuestionImage = (index: number, imageUrl: string) => {
    setQuestions(prev => 
      prev.map((q, i) => (i === index ? { ...q, imageUrl } : q))
    );
  };
  
  const updateOption = (questionIndex: number, optionIndex: number, text: string) => {
    setQuestions(prev =>
      prev.map((q, qIndex) => {
        if (qIndex !== questionIndex) return q;
        
        const newOptions = [...q.options];
        newOptions[optionIndex] = text;
        
        return { ...q, options: newOptions };
      })
    );
  };
  
  const addOption = (questionIndex: number) => {
    setQuestions(prev =>
      prev.map((q, qIndex) => {
        if (qIndex !== questionIndex) return q;
        return { ...q, options: [...q.options, ''] };
      })
    );
  };
  
  const removeOption = (questionIndex: number, optionIndex: number) => {
    setQuestions(prev =>
      prev.map((q, qIndex) => {
        if (qIndex !== questionIndex) return q;
        
        if (q.options.length <= 2) {
          toast.error('A question must have at least 2 options');
          return q;
        }
        
        const newOptions = q.options.filter((_, oIndex) => oIndex !== optionIndex);
        let correctOption = q.correctOption;
        
        if (optionIndex === q.correctOption) {
          correctOption = 0;
        } else if (optionIndex < q.correctOption) {
          correctOption--;
        }
        
        return { ...q, options: newOptions, correctOption };
      })
    );
  };
  
  const setCorrectOption = (questionIndex: number, optionIndex: number) => {
    setQuestions(prev =>
      prev.map((q, qIndex) => 
        qIndex === questionIndex ? { ...q, correctOption: optionIndex } : q
      )
    );
  };
  
  const validateQuiz = (): boolean => {
    if (!title.trim()) {
      toast.error('Please enter a quiz title');
      return false;
    }
    
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      toast.error('End date must be after start date');
      return false;
    }
    
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      
      if (!q.text.trim()) {
        toast.error(`Question ${i + 1} is empty`);
        return false;
      }
      
      if (q.type !== 'fill-in-blank') {
        for (let j = 0; j < q.options.length; j++) {
          if (!q.options[j].trim()) {
            toast.error(`Option ${j + 1} in question ${i + 1} is empty`);
            return false;
          }
        }
      } else {
        if (!q.options[0].trim()) {
          toast.error(`Answer for question ${i + 1} is empty`);
          return false;
        }
      }
    }
    
    return true;
  };
  
  const saveQuiz = (publish: boolean) => {
    if (!validateQuiz()) return;
    
    const updatedQuiz = {
      ...existingQuiz,
      title,
      description,
      questions,
      published: publish,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      imageUrl: imageUrl || undefined
    };
    
    // In a real app, this would be an API call
    console.log('Updating quiz:', updatedQuiz);
    
    toast.success(publish ? 'Quiz published successfully!' : 'Quiz saved as draft');
    navigate('/dashboard');
  };
  
  return (
    <AnimatedTransition>
      <div className="min-h-screen pb-16">
        <Navbar />
        
        <div className="container pt-24 max-w-3xl mx-auto px-4">
          <header className="mb-8 pt-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">Edit Quiz</h1>
              <p className="text-muted-foreground mt-1">
                Update questions, options, and settings
              </p>
            </div>
          </header>
          
          <Card className="glass overflow-hidden mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Quiz Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Quiz Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Introduction to Mathematics"
                  className="bg-white/50 dark:bg-black/30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe this quiz..."
                  className="bg-white/50 dark:bg-black/30"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Quiz Image URL (optional)</Label>
                <div className="flex space-x-2">
                  <Input
                    id="image"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="bg-white/50 dark:bg-black/30"
                  />
                  <Button variant="outline" size="icon">
                    <Image className="h-4 w-4" />
                  </Button>
                </div>
                {imageUrl && (
                  <div className="mt-2 p-2 border rounded-md overflow-hidden">
                    <img src={imageUrl} alt="Quiz" className="w-full h-40 object-cover rounded" />
                  </div>
                )}
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date & Time (optional)</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-white/50 dark:bg-black/30"
                    />
                    <Button variant="outline" size="icon" onClick={() => setStartDate('')}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date & Time (optional)</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-white/50 dark:bg-black/30"
                    />
                    <Button variant="outline" size="icon" onClick={() => setEndDate('')}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            {questions.map((question, qIndex) => (
              <Card key={question.id} className="glass overflow-hidden">
                <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
                  <CardTitle className="text-lg flex items-center">
                    Question {qIndex + 1}
                  </CardTitle>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeQuestion(qIndex)}
                    className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`question-type-${qIndex}`}>Question Type</Label>
                    <Select 
                      value={question.type} 
                      onValueChange={(value: QuestionType) => updateQuestionType(qIndex, value)}
                    >
                      <SelectTrigger id={`question-type-${qIndex}`}>
                        <SelectValue placeholder="Select question type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                        <SelectItem value="true-false">True/False</SelectItem>
                        <SelectItem value="fill-in-blank">Fill in the Blank</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`question-${qIndex}`}>Question Text</Label>
                    <Textarea
                      id={`question-${qIndex}`}
                      value={question.text}
                      onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                      placeholder="Enter your question..."
                      className="bg-white/50 dark:bg-black/30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`question-image-${qIndex}`}>Question Image URL (optional)</Label>
                    <div className="flex space-x-2">
                      <Input
                        id={`question-image-${qIndex}`}
                        value={question.imageUrl || ''}
                        onChange={(e) => updateQuestionImage(qIndex, e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="bg-white/50 dark:bg-black/30"
                      />
                      <Button variant="outline" size="icon">
                        <Image className="h-4 w-4" />
                      </Button>
                    </div>
                    {question.imageUrl && (
                      <div className="mt-2 p-2 border rounded-md overflow-hidden">
                        <img 
                          src={question.imageUrl} 
                          alt={`Question ${qIndex + 1}`} 
                          className="w-full h-40 object-cover rounded" 
                        />
                      </div>
                    )}
                  </div>
                  
                  {question.type === 'fill-in-blank' ? (
                    <div className="space-y-2">
                      <Label htmlFor={`correct-answer-${qIndex}`}>Correct Answer</Label>
                      <Input
                        id={`correct-answer-${qIndex}`}
                        value={question.options[0] || ''}
                        onChange={(e) => updateOption(qIndex, 0, e.target.value)}
                        placeholder="Enter the correct answer"
                        className="bg-white/50 dark:bg-black/30"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Options</Label>
                        {question.type === 'multiple-choice' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => addOption(qIndex)}
                            className="h-8 text-xs"
                          >
                            <PlusCircle className="h-3 w-3 mr-1" />
                            Add Option
                          </Button>
                        )}
                      </div>
                      <RadioGroup 
                        value={String(question.correctOption)}
                        onValueChange={(value) => setCorrectOption(qIndex, parseInt(value))}
                      >
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-3 space-y-0 rounded-lg border p-3">
                            <RadioGroupItem value={String(oIndex)} id={`q${qIndex}-o${oIndex}`} />
                            <Input
                              placeholder={`Option ${oIndex + 1}`}
                              value={option}
                              onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                              className="border-0 bg-transparent shadow-none focus-visible:ring-0 flex-1"
                            />
                            <Label
                              htmlFor={`q${qIndex}-o${oIndex}`}
                              className="text-xs font-normal text-muted-foreground flex-shrink-0"
                            >
                              {oIndex === question.correctOption && (
                                <span className="rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 flex items-center">
                                  <Check className="mr-1 h-3 w-3" />
                                  Correct
                                </span>
                              )}
                            </Label>
                            {question.type === 'multiple-choice' && question.options.length > 2 && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => removeOption(qIndex, oIndex)}
                                className="h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            
            <Button 
              variant="outline" 
              onClick={addQuestion} 
              className="w-full h-12 border-dashed rounded-xl shadow-sm bg-white/50 dark:bg-black/20 hover:border-primary/50"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={() => saveQuiz(false)}
              className="rounded-full"
            >
              <Save className="mr-2 h-4 w-4" />
              Save as Draft
            </Button>
            <Button 
              onClick={() => saveQuiz(true)}
              className="rounded-full"
            >
              <Check className="mr-2 h-4 w-4" />
              Publish Quiz
            </Button>
          </div>
        </div>
      </div>
    </AnimatedTransition>
  );
};

export default QuizEdit;
