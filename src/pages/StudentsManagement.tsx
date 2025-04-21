
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Navbar from '@/components/layout/Navbar';
import { UserPlus, Users, UserMinus } from 'lucide-react';
import AnimatedTransition from '@/components/ui/AnimatedTransition';

const StudentsManagement: React.FC = () => {
  const { user, loading, addStudentToClassroom, removeStudentFromClassroom, getStudentsInClassroom } = useAuth();
  const [studentId, setStudentId] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  const students = getStudentsInClassroom();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass p-8 rounded-xl shadow-lg flex flex-col items-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'teacher') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentId.trim()) {
      toast.error('Please enter a student ID');
      return;
    }
    
    try {
      setIsAdding(true);
      await addStudentToClassroom(studentId);
      toast.success('Student added to classroom');
      setStudentId('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add student');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveStudent = async (id: string) => {
    try {
      await removeStudentFromClassroom(id);
      toast.success('Student removed from classroom');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to remove student');
    }
  };

  return (
    <AnimatedTransition>
      <div className="min-h-screen pb-16">
        <Navbar />
        
        <div className="container pt-24 max-w-6xl mx-auto px-4">
          <header className="mb-8 pt-8 animate-slide-down">
            <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold">Classroom Management</h1>
                <p className="text-muted-foreground mt-1">
                  Manage students in your classroom
                </p>
              </div>
            </div>
          </header>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Add Student to Classroom
                </CardTitle>
                <CardDescription>
                  Enter the student's ID to add them to your classroom
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddStudent} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input
                      id="studentId"
                      placeholder="Enter student ID"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                    />
                  </div>
                  <Button type="submit" disabled={isAdding} className="w-full">
                    {isAdding ? (
                      <span className="flex items-center justify-center">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2"></span>
                        Adding...
                      </span>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Student
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Students in Classroom
                </CardTitle>
                <CardDescription>
                  {students.length} {students.length === 1 ? 'student' : 'students'} in your classroom
                </CardDescription>
              </CardHeader>
              <CardContent>
                {students.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No students in your classroom yet
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-mono">{student.id}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>
                            {student.isActive ? (
                              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                Online
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                                Offline
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleRemoveStudent(student.id)}
                              className="text-red-500 hover:bg-red-50 hover:text-red-600"
                            >
                              <UserMinus className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AnimatedTransition>
  );
};

export default StudentsManagement;
