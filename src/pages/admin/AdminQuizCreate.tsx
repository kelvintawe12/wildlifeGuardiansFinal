import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, AlertCircleIcon } from 'lucide-react';
import QuizForm from '../../components/admin/forms/QuizForm';
import { QuizWithQuestions, QuizInput, QuestionInput, getQuizById, createQuiz, updateQuiz } from '../../backend/api/quizzes';
import { Animal, getAllAnimals } from '../../backend/api/animals';
const AdminQuizCreate = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<QuizWithQuestions | null>(null);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditMode = !!id;
  useEffect(() => {
    fetchAnimals();
    if (isEditMode) {
      fetchQuiz(id);
    }
  }, [id]);
  const fetchAnimals = async () => {
    try {
      const data = await getAllAnimals();
      setAnimals(data);
    } catch (err) {
      console.error('Error fetching animals:', err);
      setError('Failed to load animals for quiz association.');
    }
  };
  const fetchQuiz = async (quizId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getQuizById(quizId);
      setQuiz(data);
    } catch (err) {
      console.error('Error fetching quiz:', err);
      setError('Failed to load quiz data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = async (quizData: QuizInput, questions: QuestionInput[]) => {
    try {
      setIsSubmitting(true);
      setError(null);
      if (isEditMode && id) {
        await updateQuiz(id, quizData, questions);
      } else {
        await createQuiz(quizData, questions);
      }
      navigate('/admin/quizzes');
    } catch (err) {
      console.error('Error saving quiz:', err);
      setError('Failed to save quiz. Please try again.');
      setIsSubmitting(false);
    }
  };
  const handleCancel = () => {
    navigate('/admin/quizzes');
  };
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={() => navigate('/admin/quizzes')} className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors">
            <ArrowLeftIcon size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'Edit Quiz' : 'Create New Quiz'}
          </h1>
        </div>
        <div className="flex space-x-3">
          <button onClick={handleCancel} className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Cancel
          </button>
        </div>
      </div>
      {error && <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>}
      {isLoading ? <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading quiz data...</p>
        </div> : <div className="bg-white rounded-lg shadow p-6">
          <QuizForm quiz={quiz || undefined} animals={animals} onSubmit={handleSubmit} onCancel={handleCancel} isSubmitting={isSubmitting} />
        </div>}
    </div>;
};
export default AdminQuizCreate;