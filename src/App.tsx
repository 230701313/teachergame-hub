
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import QuizCreator from "./pages/QuizCreator";
import QuizView from "./pages/QuizView";
import QuizResults from "./pages/QuizResults";
import QuizEdit from "./pages/QuizEdit";
import StudentsManagement from "./pages/StudentsManagement";
import ActiveUsers from "./pages/ActiveUsers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/quizzes/create" element={<QuizCreator />} />
            <Route path="/quizzes/take/:quizId" element={<QuizView />} />
            <Route path="/quizzes/edit/:quizId" element={<QuizEdit />} />
            <Route path="/quizzes/results/:quizId" element={<QuizResults />} />
            <Route path="/students" element={<StudentsManagement />} />
            <Route path="/active-users" element={<ActiveUsers />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
