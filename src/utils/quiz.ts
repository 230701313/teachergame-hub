export type QuestionType = 'multiple-choice' | 'true-false' | 'fill-in-blank';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: string[];
  correctOption: number;
  imageUrl?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  questions: Question[];
  published: boolean;
  startDate?: string;
  endDate?: string;
  imageUrl?: string;
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
        correctOption: 1, // 0-indexed, so 1 means second option (4)
        imageUrl: 'https://example.com/math-question.jpg'
      },
      {
        id: '1-2',
        text: 'What is 5 × 7?',
        options: ['30', '35', '40', '45'],
        correctOption: 1,
        imageUrl: 'https://example.com/math-question.jpg'
      },
      {
        id: '1-3',
        text: 'What is the square root of 64?',
        options: ['6', '7', '8', '9'],
        correctOption: 2,
        imageUrl: 'https://example.com/math-question.jpg'
      }
    ],
    published: true,
    startDate: '2023-01-01',
    endDate: '2023-01-31',
    imageUrl: 'https://example.com/math-quiz.jpg'
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
        correctOption: 0,
        imageUrl: 'https://example.com/science-question.jpg'
      },
      {
        id: '2-2',
        text: 'Which planet is known as the Red Planet?',
        options: ['Earth', 'Venus', 'Mars', 'Jupiter'],
        correctOption: 2,
        imageUrl: 'https://example.com/science-question.jpg'
      },
      {
        id: '2-3',
        text: 'What is the largest organ in the human body?',
        options: ['Heart', 'Liver', 'Brain', 'Skin'],
        correctOption: 3,
        imageUrl: 'https://example.com/science-question.jpg'
      }
    ],
    published: true,
    startDate: '2023-02-01',
    endDate: '2023-02-28',
    imageUrl: 'https://example.com/science-quiz.jpg'
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
        correctOption: 1,
        imageUrl: 'https://example.com/history-question.jpg'
      },
      {
        id: '3-2',
        text: 'In which year did World War II end?',
        options: ['1943', '1944', '1945', '1946'],
        correctOption: 2,
        imageUrl: 'https://example.com/history-question.jpg'
      }
    ],
    published: false, // Draft quiz
    startDate: '2023-03-01',
    endDate: '2023-03-31',
    imageUrl: 'https://example.com/history-quiz.jpg'
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
