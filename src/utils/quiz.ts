
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOption: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  questions: Question[];
  published: boolean;
}

export interface QuizSubmission {
  id: string;
  quizId: string;
  userId: string;
  answers: Record<string, number>;
  score: number;
  submittedAt: string;
}

// Mock quiz data
export const MOCK_QUIZZES: Quiz[] = [
  {
    id: '1',
    title: 'Introduction to Mathematics',
    description: 'Test your basic math knowledge with this quiz.',
    createdBy: '1', // Teacher ID
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: '1-1',
        text: 'What is 2 + 2?',
        options: ['3', '4', '5', '6'],
        correctOption: 1 // 0-indexed, so 1 means second option (4)
      },
      {
        id: '1-2',
        text: 'What is 5 × 7?',
        options: ['30', '35', '40', '45'],
        correctOption: 1
      },
      {
        id: '1-3',
        text: 'What is the square root of 64?',
        options: ['6', '7', '8', '9'],
        correctOption: 2
      }
    ],
    published: true
  },
  {
    id: '2',
    title: 'Science Basics',
    description: 'A quiz on fundamental scientific concepts.',
    createdBy: '1', // Teacher ID
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: '2-1',
        text: 'What is the chemical formula for water?',
        options: ['H2O', 'CO2', 'NaCl', 'O2'],
        correctOption: 0
      },
      {
        id: '2-2',
        text: 'Which planet is known as the Red Planet?',
        options: ['Earth', 'Venus', 'Mars', 'Jupiter'],
        correctOption: 2
      },
      {
        id: '2-3',
        text: 'What is the largest organ in the human body?',
        options: ['Heart', 'Liver', 'Brain', 'Skin'],
        correctOption: 3
      }
    ],
    published: true
  },
  {
    id: '3',
    title: 'History 101',
    description: 'Test your knowledge of world history.',
    createdBy: '1', // Teacher ID
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: '3-1',
        text: 'Who was the first President of the United States?',
        options: ['Thomas Jefferson', 'George Washington', 'John Adams', 'Benjamin Franklin'],
        correctOption: 1
      },
      {
        id: '3-2',
        text: 'In which year did World War II end?',
        options: ['1943', '1944', '1945', '1946'],
        correctOption: 2
      }
    ],
    published: false // Draft quiz
  }
];

// Mock submissions
export const MOCK_SUBMISSIONS: QuizSubmission[] = [
  {
    id: '101',
    quizId: '1',
    userId: '2', // Student ID
    answers: {
      '1-1': 1, // Correct
      '1-2': 1, // Correct
      '1-3': 3  // Incorrect
    },
    score: 2/3 * 100, // 66.67%
    submittedAt: new Date().toISOString()
  }
];

// Helper functions
export const getQuizById = (quizId: string): Quiz | undefined => {
  return MOCK_QUIZZES.find(quiz => quiz.id === quizId);
};

export const getQuizzesByTeacher = (teacherId: string): Quiz[] => {
  return MOCK_QUIZZES.filter(quiz => quiz.createdBy === teacherId);
};

export const getPublishedQuizzes = (): Quiz[] => {
  return MOCK_QUIZZES.filter(quiz => quiz.published);
};

export const getSubmissionsByUser = (userId: string): QuizSubmission[] => {
  return MOCK_SUBMISSIONS.filter(submission => submission.userId === userId);
};

export const getSubmissionsByQuiz = (quizId: string): QuizSubmission[] => {
  return MOCK_SUBMISSIONS.filter(submission => submission.quizId === quizId);
};

export const calculateScore = (quiz: Quiz, answers: Record<string, number>): number => {
  let correctAnswers = 0;
  
  quiz.questions.forEach(question => {
    if (answers[question.id] === question.correctOption) {
      correctAnswers++;
    }
  });
  
  return (correctAnswers / quiz.questions.length) * 100;
};

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};
