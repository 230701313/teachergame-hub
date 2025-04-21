
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Navbar from '@/components/layout/Navbar';
import { Users } from 'lucide-react';
import AnimatedTransition from '@/components/ui/AnimatedTransition';

const ActiveUsers: React.FC = () => {
  const { user, loading, activeUsers } = useAuth();

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

  return (
    <AnimatedTransition>
      <div className="min-h-screen pb-16">
        <Navbar />
        
        <div className="container pt-24 max-w-6xl mx-auto px-4">
          <header className="mb-8 pt-8 animate-slide-down">
            <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold">Active Users</h1>
                <p className="text-muted-foreground mt-1">
                  View all currently active users on the platform
                </p>
              </div>
            </div>
          </header>
          
          <Card className="glass overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Online Users
              </CardTitle>
              <CardDescription>
                {activeUsers.length} {activeUsers.length === 1 ? 'user' : 'users'} currently online
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No users are currently online
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-mono">{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="capitalize">{user.role}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Online
                          </Badge>
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
    </AnimatedTransition>
  );
};

export default ActiveUsers;
