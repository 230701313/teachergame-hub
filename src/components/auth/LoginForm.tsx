
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { BookUser, GraduationCap } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password, role);
      toast.success(`Logged in successfully as ${role}`);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
      toast.error('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // For demo purposes, provide easy access to mock accounts
  const fillDemoAccount = (userType: UserRole) => {
    if (userType === 'teacher') {
      setEmail('teacher@example.com');
      setPassword('password');
      setRole('teacher');
    } else {
      setEmail('student@example.com');
      setPassword('password');
      setRole('student');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="glass p-8 rounded-xl space-y-6 animate-slide-up">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/50 dark:bg-black/30 border-border/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white/50 dark:bg-black/30 border-border/50"
            />
          </div>

          <div className="space-y-2">
            <Label>I am a:</Label>
            <RadioGroup 
              value={role} 
              onValueChange={(value) => setRole(value as UserRole)}
              className="flex space-x-2 pt-2"
            >
              <div className="flex items-center">
                <RadioGroupItem value="student" id="student" className="peer sr-only" />
                <Label
                  htmlFor="student"
                  className="flex items-center gap-1.5 rounded-full px-4 py-2 border cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary peer-data-[state=checked]:bg-primary/5 hover:bg-secondary transition-all"
                >
                  <GraduationCap className="h-4 w-4" />
                  Student
                </Label>
              </div>

              <div className="flex items-center">
                <RadioGroupItem value="teacher" id="teacher" className="peer sr-only" />
                <Label
                  htmlFor="teacher"
                  className="flex items-center gap-1.5 rounded-full px-4 py-2 border cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary peer-data-[state=checked]:bg-primary/5 hover:bg-secondary transition-all"
                >
                  <BookUser className="h-4 w-4" />
                  Teacher
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full rounded-full" 
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          <p className="mb-2">Demo accounts</p>
          <div className="flex justify-center space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => fillDemoAccount('teacher')}
              className="rounded-full text-xs"
            >
              Teacher Demo
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => fillDemoAccount('student')}
              className="rounded-full text-xs"
            >
              Student Demo
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
