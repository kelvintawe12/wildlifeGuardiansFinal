import { supabase } from '../config/supabase';
export type Quiz = {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  published: boolean;
  animal_id?: string;
  created_at: string;
  updated_at: string;
};
export type Question = {
  id: string;
  quiz_id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  explanation?: string;
  order_num: number;
  created_at: string;
  updated_at: string;
};
export type QuizWithQuestions = Quiz & {
  questions: Question[];
};
export type QuizInput = Omit<Quiz, 'id' | 'created_at' | 'updated_at'>;
export type QuestionInput = Omit<Question, 'id' | 'created_at' | 'updated_at'>;
export async function getAllQuizzes(): Promise<Quiz[]> {
  const {
    data,
    error
  } = await supabase.from('quizzes').select('*').order('title');
  if (error) {
    console.error('Error fetching quizzes:', error);
    throw error;
  }
  return data || [];
}
export async function getQuizById(id: string): Promise<QuizWithQuestions | null> {
  // Get quiz data
  const {
    data: quiz,
    error: quizError
  } = await supabase.from('quizzes').select('*').eq('id', id).single();
  if (quizError) {
    console.error(`Error fetching quiz with ID ${id}:`, quizError);
    throw quizError;
  }
  if (!quiz) return null;
  // Get quiz questions
  const {
    data: questions,
    error: questionsError
  } = await supabase.from('questions').select('*').eq('quiz_id', id).order('order_num');
  if (questionsError) {
    console.error(`Error fetching questions for quiz with ID ${id}:`, questionsError);
    throw questionsError;
  }
  return {
    ...quiz,
    questions: questions || []
  };
}
export async function createQuiz(quiz: QuizInput, questions: QuestionInput[]): Promise<QuizWithQuestions> {
  // Start a transaction
  const {
    data: quizData,
    error: quizError
  } = await supabase.from('quizzes').insert([quiz]).select();
  if (quizError) {
    console.error('Error creating quiz:', quizError);
    throw quizError;
  }
  const newQuiz = quizData![0];
  // Add questions
  const questionsWithQuizId = questions.map(question => ({
    ...question,
    quiz_id: newQuiz.id
  }));
  const {
    data: questionData,
    error: questionError
  } = await supabase.from('questions').insert(questionsWithQuizId).select();
  if (questionError) {
    console.error('Error creating quiz questions:', questionError);
    throw questionError;
  }
  return {
    ...newQuiz,
    questions: questionData || []
  };
}
export async function updateQuiz(id: string, quiz: Partial<QuizInput>, questions?: QuestionInput[]): Promise<QuizWithQuestions> {
  // Update quiz
  const {
    data: quizData,
    error: quizError
  } = await supabase.from('quizzes').update({
    ...quiz,
    updated_at: new Date().toISOString()
  }).eq('id', id).select();
  if (quizError) {
    console.error(`Error updating quiz with ID ${id}:`, quizError);
    throw quizError;
  }
  const updatedQuiz = quizData![0];
  // If questions are provided, update them
  if (questions && questions.length > 0) {
    // Delete existing questions
    const {
      error: deleteError
    } = await supabase.from('questions').delete().eq('quiz_id', id);
    if (deleteError) {
      console.error(`Error deleting questions for quiz with ID ${id}:`, deleteError);
      throw deleteError;
    }
    // Add new questions
    const questionsWithQuizId = questions.map(question => ({
      ...question,
      quiz_id: id
    }));
    const {
      data: questionData,
      error: questionError
    } = await supabase.from('questions').insert(questionsWithQuizId).select();
    if (questionError) {
      console.error('Error updating quiz questions:', questionError);
      throw questionError;
    }
    return {
      ...updatedQuiz,
      questions: questionData || []
    };
  }
  // Get existing questions
  const {
    data: existingQuestions,
    error: questionsError
  } = await supabase.from('questions').select('*').eq('quiz_id', id).order('order_num');
  if (questionsError) {
    console.error(`Error fetching questions for quiz with ID ${id}:`, questionsError);
    throw questionsError;
  }
  return {
    ...updatedQuiz,
    questions: existingQuestions || []
  };
}
export async function deleteQuiz(id: string): Promise<void> {
  // Questions will be cascade deleted
  const {
    error
  } = await supabase.from('quizzes').delete().eq('id', id);
  if (error) {
    console.error(`Error deleting quiz with ID ${id}:`, error);
    throw error;
  }
}
export async function getQuizStats(): Promise<{
  total: number;
  completions: number;
  avgScore: number;
}> {
  // Get total quizzes
  const { count: totalQuizzes, error: countError } = await supabase
    .from('quizzes')
    .select('*', { count: 'exact', head: true });
  if (countError) {
    console.error('Error counting quizzes:', countError);
    throw countError;
  }

  // Get all quiz results to calculate completions and average score
  const { data: quizResults, error: resultsError } = await supabase
    .from('quiz_results')
    .select('score');
  if (resultsError) {
    console.error('Error getting quiz results:', resultsError);
    throw resultsError;
  }
  const completions = quizResults ? quizResults.length : 0;
  const avgScore = quizResults && quizResults.length > 0
    ? Math.round(quizResults.reduce((sum: number, r: any) => sum + (parseFloat(r.score) || 0), 0) / quizResults.length)
    : 0;

  return {
    total: totalQuizzes || 0,
    completions,
    avgScore
  };
}