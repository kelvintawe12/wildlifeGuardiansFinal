import React from 'react';
import { XIcon, BookIcon } from 'lucide-react';
import { Quiz } from '../../backend/api/quizzes';
interface QuizDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizId: string;
  quizzes: Quiz[];
}
const QuizDetailsModal: React.FC<QuizDetailsModalProps> = ({
  isOpen,
  onClose,
  quizId,
  quizzes
}) => {
  if (!isOpen) return null;
  const quiz = quizzes.find(q => q.id === quizId);
  if (!quiz) return null;
  const getDifficultyBadgeColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>
        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
              <XIcon size={20} />
            </button>
          </div>
          <div className="bg-white p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <BookIcon size={24} className="text-indigo-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {quiz.title}
                </h3>
                <div className="flex items-center mb-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getDifficultyBadgeColor(quiz.difficulty)}`}>
                    {quiz.difficulty}
                  </span>
                  {quiz.published ? <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Published
                    </span> : <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Draft
                    </span>}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">
                Description
              </h4>
              <p className="text-sm text-gray-600">{quiz.description}</p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm font-semibold text-gray-800">
                  Created
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(quiz.created_at).toLocaleDateString()}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm font-semibold text-gray-800">
                  Last Updated
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(quiz.updated_at).toLocaleDateString()}
                </div>
              </div>
            </div>
            {quiz.animal_id && <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                  Related Animal
                </h4>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-600">
                    This quiz is related to an animal. View the animal details
                    for more information.
                  </p>
                </div>
              </div>}
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default QuizDetailsModal;