export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of the correct option
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  timeLimit: number; // in seconds
  questions: QuizQuestion[];
}

export const mockQuizzes: Quiz[] = [
  {
    id: 'q1',
    title: 'Physics: Kinematics Basics',
    subject: 'Science',
    timeLimit: 300, // 5 minutes
    questions: [
      {
        id: 'q1_1',
        question: 'What is the SI unit of acceleration?',
        options: ['m/s', 'm/s²', 'km/h', 'N/kg'],
        correctAnswer: 1,
        explanation: 'Acceleration is the rate of change of velocity. Since velocity is in m/s and time is in s, acceleration is (m/s)/s = m/s².'
      },
      {
        id: 'q1_2',
        question: 'If a car travels at a constant velocity of 20 m/s for 10 seconds, what is its displacement?',
        options: ['200 m', '20 m', '2 m', '0 m'],
        correctAnswer: 0,
        explanation: 'Displacement = velocity × time. Therefore, 20 m/s × 10 s = 200 m.'
      },
      {
        id: 'q1_3',
        question: 'Which of the following is a scalar quantity?',
        options: ['Force', 'Velocity', 'Speed', 'Displacement'],
        correctAnswer: 2,
        explanation: 'Speed only has magnitude and no direction, making it a scalar quantity. The others are vectors.'
      }
    ]
  },
  {
    id: 'q2',
    title: 'Math: Algebra Fundamentals',
    subject: 'Mathematics',
    timeLimit: 300,
    questions: [
      {
        id: 'q2_1',
        question: 'Solve for x: 2x + 5 = 15',
        options: ['5', '10', '20', '2.5'],
        correctAnswer: 0,
        explanation: 'Subtract 5 from both sides to get 2x = 10. Then divide by 2 to get x = 5.'
      },
      {
        id: 'q2_2',
        question: 'What is the value of 3³?',
        options: ['9', '18', '27', '81'],
        correctAnswer: 2,
        explanation: '3³ means 3 multiplied by itself 3 times: 3 × 3 × 3 = 27.'
      },
      {
        id: 'q2_3',
        question: 'If y = 2x - 4 and x = 3, what is y?',
        options: ['2', '10', '-2', '6'],
        correctAnswer: 0,
        explanation: 'Substitute x = 3 into the equation: y = 2(3) - 4 = 6 - 4 = 2.'
      }
    ]
  },
  {
    id: 'q3',
    title: 'English: Grammar & Tenses',
    subject: 'English',
    timeLimit: 180,
    questions: [
      {
        id: 'q3_1',
        question: 'Identify the tense: "She has been working here for five years."',
        options: ['Present Perfect', 'Present Continuous', 'Present Perfect Continuous', 'Past Perfect'],
        correctAnswer: 2,
        explanation: '"has been working" indicates an action that started in the past and continues into the present, which is the Present Perfect Continuous tense.'
      },
      {
        id: 'q3_2',
        question: 'Choose the correct word: "The dog wagged ___ tail."',
        options: ['its', 'it\'s', 'its\'', 'it'],
        correctAnswer: 0,
        explanation: '"its" is the possessive form of it. "it\'s" is a contraction for "it is" or "it has".'
      }
    ]
  }
];
