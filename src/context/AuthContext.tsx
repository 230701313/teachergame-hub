
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastActive: string;
  classroomIds?: string[]; // For students - classrooms they belong to
  studentIds?: string[]; // For teachers - students they manage
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  activeUsers: User[];
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  isTeacher: () => boolean;
  isStudent: () => boolean;
  addStudentToClassroom: (studentId: string) => Promise<void>;
  removeStudentFromClassroom: (studentId: string) => Promise<void>;
  getStudentsInClassroom: () => User[];
  getTeachers: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const MOCK_USERS = [
  { 
    id: '1', 
    name: 'Teacher Smith', 
    email: 'teacher@example.com', 
    password: 'password', 
    role: 'teacher' as UserRole,
    isActive: true,
    lastActive: new Date().toISOString(),
    studentIds: ['2'],
  },
  { 
    id: '2', 
    name: 'Student Jones', 
    email: 'student@example.com', 
    password: 'password', 
    role: 'student' as UserRole,
    isActive: true,
    lastActive: new Date().toISOString(),
    classroomIds: ['1'],
  },
  { 
    id: '3', 
    name: 'Teacher Brown', 
    email: 'brown@example.com', 
    password: 'password', 
    role: 'teacher' as UserRole,
    isActive: false,
    lastActive: new Date().toISOString(),
    studentIds: [],
  },
  { 
    id: '4', 
    name: 'Student Lee', 
    email: 'lee@example.com', 
    password: 'password', 
    role: 'student' as UserRole,
    isActive: false,
    lastActive: new Date().toISOString(),
    classroomIds: [],
  },
];

// In-memory storage for users (would be a database in production)
let USERS = [...MOCK_USERS];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);

  // Update active users every minute
  useEffect(() => {
    const updateActiveUsers = () => {
      const now = new Date();
      // Filter users who were active in the last 5 minutes
      const active = USERS.filter(u => {
        const lastActive = new Date(u.lastActive);
        return now.getTime() - lastActive.getTime() < 5 * 60 * 1000;
      });
      
      setActiveUsers(active.map(({ password, ...rest }) => rest as User));
    };
    
    updateActiveUsers();
    const interval = setInterval(updateActiveUsers, 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Check local storage for user session
    const storedUser = localStorage.getItem('quizUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Update user's active status
      USERS = USERS.map(u => {
        if (u.id === parsedUser.id) {
          return {
            ...u, 
            isActive: true,
            lastActive: new Date().toISOString()
          };
        }
        return u;
      });
    }
    setLoading(false);
  }, []);

  // Update user's active status periodically
  useEffect(() => {
    if (!user) return;
    
    const updateActivity = () => {
      if (user) {
        USERS = USERS.map(u => {
          if (u.id === user.id) {
            return {
              ...u, 
              isActive: true,
              lastActive: new Date().toISOString()
            };
          }
          return u;
        });
      }
    };
    
    updateActivity();
    const interval = setInterval(updateActivity, 60 * 1000);
    
    return () => clearInterval(interval);
  }, [user]);

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<void> => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if user already exists
      const existingUser = USERS.find(u => u.email === email);
      if (existingUser) {
        throw new Error('User already exists with this email');
      }
      
      // Create new user
      const newUser: User & { password: string } = {
        id: Date.now().toString(),
        name,
        email,
        password,
        role,
        isActive: true,
        lastActive: new Date().toISOString(),
        classroomIds: role === 'student' ? [] : undefined,
        studentIds: role === 'teacher' ? [] : undefined
      };
      
      // Add to users
      USERS.push(newUser);
      
      // Create user object (without password) to store in state and localStorage
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('quizUser', JSON.stringify(userWithoutPassword));

    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, role: UserRole): Promise<void> => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user by email and password and verify role
      const foundUser = USERS.find(
        u => u.email === email && u.password === password && u.role === role
      );
      
      if (!foundUser) {
        throw new Error('Invalid credentials or user role');
      }
      
      // Update user's active status
      USERS = USERS.map(u => {
        if (u.id === foundUser.id) {
          return {
            ...u, 
            isActive: true,
            lastActive: new Date().toISOString()
          };
        }
        return u;
      });
      
      // Create user object (without password) to store in state and localStorage
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('quizUser', JSON.stringify(userWithoutPassword));

    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    if (user) {
      // Update user's active status
      USERS = USERS.map(u => {
        if (u.id === user.id) {
          return {
            ...u, 
            isActive: false
          };
        }
        return u;
      });
    }
    
    setUser(null);
    localStorage.removeItem('quizUser');
  };

  const isTeacher = () => user?.role === 'teacher';
  const isStudent = () => user?.role === 'student';
  
  const addStudentToClassroom = async (studentId: string): Promise<void> => {
    if (!user || user.role !== 'teacher') {
      throw new Error('Only teachers can add students to classroom');
    }
    
    // Find the student
    const studentIndex = USERS.findIndex(u => u.id === studentId && u.role === 'student');
    if (studentIndex === -1) {
      throw new Error('Student not found');
    }
    
    // Update the teacher's studentIds
    const updatedTeacher = {
      ...USERS.find(u => u.id === user.id)!,
      studentIds: [...(user.studentIds || []), studentId]
    };
    
    // Update the student's classroomIds
    const updatedStudent = {
      ...USERS[studentIndex],
      classroomIds: [...(USERS[studentIndex].classroomIds || []), user.id]
    };
    
    // Update the users array
    USERS = USERS.map(u => {
      if (u.id === user.id) return updatedTeacher;
      if (u.id === studentId) return updatedStudent;
      return u;
    });
    
    // Update the current user
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        studentIds: [...(prev.studentIds || []), studentId]
      };
    });
    
    // Update local storage
    if (user) {
      const updatedLocalUser = {
        ...user,
        studentIds: [...(user.studentIds || []), studentId]
      };
      localStorage.setItem('quizUser', JSON.stringify(updatedLocalUser));
    }
  };
  
  const removeStudentFromClassroom = async (studentId: string): Promise<void> => {
    if (!user || user.role !== 'teacher') {
      throw new Error('Only teachers can remove students from classroom');
    }
    
    // Find the student
    const studentIndex = USERS.findIndex(u => u.id === studentId && u.role === 'student');
    if (studentIndex === -1) {
      throw new Error('Student not found');
    }
    
    // Update the teacher's studentIds
    const updatedTeacher = {
      ...USERS.find(u => u.id === user.id)!,
      studentIds: (user.studentIds || []).filter(id => id !== studentId)
    };
    
    // Update the student's classroomIds
    const updatedStudent = {
      ...USERS[studentIndex],
      classroomIds: (USERS[studentIndex].classroomIds || []).filter(id => id !== user.id)
    };
    
    // Update the users array
    USERS = USERS.map(u => {
      if (u.id === user.id) return updatedTeacher;
      if (u.id === studentId) return updatedStudent;
      return u;
    });
    
    // Update the current user
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        studentIds: (prev.studentIds || []).filter(id => id !== studentId)
      };
    });
    
    // Update local storage
    if (user) {
      const updatedLocalUser = {
        ...user,
        studentIds: (user.studentIds || []).filter(id => id !== studentId)
      };
      localStorage.setItem('quizUser', JSON.stringify(updatedLocalUser));
    }
  };
  
  const getStudentsInClassroom = (): User[] => {
    if (!user || user.role !== 'teacher') {
      return [];
    }
    
    return USERS
      .filter(u => user.studentIds?.includes(u.id) && u.role === 'student')
      .map(({ password, ...rest }) => rest as User);
  };
  
  const getTeachers = (): User[] => {
    return USERS
      .filter(u => u.role === 'teacher')
      .map(({ password, ...rest }) => rest as User);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        activeUsers,
        login, 
        logout, 
        register,
        isTeacher, 
        isStudent,
        addStudentToClassroom,
        removeStudentFromClassroom,
        getStudentsInClassroom,
        getTeachers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
