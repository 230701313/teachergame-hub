import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { generateId, Quiz, Question, QuestionType } from '@/utils/quiz';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import { X, PlusCircle, Save, Check } from 'lucide-react';
import AnimatedTransition from '@/components/ui/AnimatedTransition';

const QuizCreator: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: generateId(),
      text: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctOption: 0
    }
  ]);
  
  const addQuestion = () => {
    setQuestions(prev => [
      ...prev,
      {
        id: generateId(),
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
    
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      
      if (!q.text.trim()) {
        toast.error(`Question ${i + 1} is empty`);
        return false;
      }
      
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          toast.error(`Option ${j + 1} in question ${i + 1} is empty`);
          return false;
        }
      }
    }
    
    return true;
  };
  
  const saveQuiz = (publish: boolean) => {
    if (!validateQuiz()) return;
    
    const newQuiz: Quiz = {
      id: generateId(),
      title,
      description,
      createdBy: user?.id || '',
      createdAt: new Date().toISOString(),
      questions,
      published: publish
    };
    
    console.log('Saving quiz:', newQuiz);
    
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
              <h1 className="text-3xl font-bold">Create New Quiz</h1>
              <p className="text-muted-foreground mt-1">
                Create questions, add options, and select correct answers
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
                    <Label>Options</Label>
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
                            className="text-xs font-normal text-muted-foreground"
                          >
                            {oIndex === question.correctOption && (
                              <span className="rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 flex items-center">
                                <Check className="mr-1 h-3 w-3" />
                                Correct
                              </span>
                            )}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    <p className="text-xs text-muted-foreground mt-2">
                      Select the radio button next to the correct answer
                    </p>
                  </div>
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

export default QuizCreator;
