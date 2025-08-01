import { createQuizWithQuestions } from './quizzes';

// Free quizzes to seed
const freeQuizzes = [
  {
    title: 'Wildlife Basics',
    description: 'A simple quiz to get started with wildlife knowledge.',
    difficulty: 'easy',
    published: true,
    questions: [
      {
        question_text: 'What is the largest land animal?',
        options: ['Elephant', 'Lion', 'Giraffe', 'Rhino'],
        correct_answer: 'Elephant',
        order_num: 1,
      },
      {
        question_text: 'Which animal is known as the king of the jungle?',
        options: ['Lion', 'Tiger', 'Bear', 'Wolf'],
        correct_answer: 'Lion',
        order_num: 2,
      },
    ],
  },
  {
    title: 'Conservation 101',
    description: 'Learn about basic conservation efforts.',
    difficulty: 'easy',
    published: true,
    questions: [
      {
        question_text: 'What does conservation mean?',
        options: ['Protecting nature', 'Hunting animals', 'Cutting trees', 'Building cities'],
        correct_answer: 'Protecting nature',
        order_num: 1,
      },
      {
        question_text: 'Which of these is a threatened species?',
        options: ['Panda', 'Dog', 'Cow', 'Chicken'],
        correct_answer: 'Panda',
        order_num: 2,
      },
    ],
  },
];

export async function seedFreeQuizzes() {
  for (const quiz of freeQuizzes) {
    try {
      await createQuizWithQuestions(quiz);
      console.log(`Seeded quiz: ${quiz.title}`);
    } catch (e) {
      console.error(`Error seeding quiz ${quiz.title}:`, e);
    }
  }
}

// To run: import and call seedFreeQuizzes() in a script or dev tool.
