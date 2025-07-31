import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SearchIcon, PlusIcon, FilterIcon, EditIcon, TrashIcon, EyeIcon, FileIcon, CheckCircleIcon, XCircleIcon, AlertCircleIcon } from 'lucide-react';
import QuizDetailsModal from '../../components/modals/QuizDetailsModal';
import ConfirmModal from '../../components/modals/ConfirmModal';
import { Quiz, getAllQuizzes, deleteQuiz } from '../../backend/api/quizzes';
const AdminQuizzes = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetchQuizzes();
  }, []);
  const fetchQuizzes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllQuizzes();
      setQuizzes(data);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
      setError('Failed to load quizzes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const filteredQuizzes = quizzes.filter(quiz => quiz.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const handleQuizClick = (quizId: string) => {
    setSelectedQuizId(quizId);
    setShowQuizModal(true);
  };
  const handleEditClick = (e: React.MouseEvent, quizId: string) => {
    e.stopPropagation();
    navigate(`/admin/quizzes/edit/${quizId}`);
  };
  const handleDeleteClick = (e: React.MouseEvent, quizId: string) => {
    e.stopPropagation();
    setSelectedQuizId(quizId);
    setShowDeleteModal(true);
  };
  const handleConfirmDelete = async () => {
    if (!selectedQuizId) return;
    try {
      setIsSubmitting(true);
      await deleteQuiz(selectedQuizId);
      await fetchQuizzes();
      setShowDeleteModal(false);
      setSelectedQuizId(null);
    } catch (err) {
      console.error('Error deleting quiz:', err);
      setError('Failed to delete quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCloseModal = () => {
    setShowQuizModal(false);
    setShowDeleteModal(false);
    setSelectedQuizId(null);
  };
  // Calculate stats
  const quizStats = {
    total: quizzes.length,
    completions: 0,
    avgScore: 0,
    published: quizzes.filter(q => q.published).length
  };
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Quiz Management</h1>
        <Link to="/admin/quizzes/create" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors">
          <PlusIcon size={16} className="mr-2" />
          Create Quiz
        </Link>
      </div>

      {/* Error message */}
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="text-sm font-medium text-gray-500">Total Quizzes</div>
          <div className="text-2xl font-bold text-gray-800 mt-1">
            {quizStats.total}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="text-sm font-medium text-gray-500">
            Total Completions
          </div>
          <div className="text-2xl font-bold text-gray-800 mt-1">
            {quizStats.completions}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="text-sm font-medium text-gray-500">Average Score</div>
          <div className="text-2xl font-bold text-gray-800 mt-1">
            {quizStats.avgScore}%
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="text-sm font-medium text-gray-500">Published</div>
          <div className="text-2xl font-bold text-gray-800 mt-1">
            {quizStats.published}/{quizStats.total}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon size={18} className="text-gray-400" />
            </div>
            <input type="text" placeholder="Search quizzes..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div className="flex items-center">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
              <FilterIcon size={16} className="mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading quizzes...</p>
        </div>}

      {/* Quiz Table */}
      {!isLoading && <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quiz
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Questions
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQuizzes.length === 0 ? <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                      No quizzes found matching your criteria.
                    </td>
                  </tr> : filteredQuizzes.map(quiz => <tr key={quiz.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleQuizClick(quiz.id)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <FileIcon size={18} className="text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {quiz.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              Created{' '}
                              {new Date(quiz.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {/* This would come from the backend */}5
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${quiz.difficulty === 'easy' ? 'bg-green-100 text-green-800' : quiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                          {quiz.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {quiz.published ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircleIcon size={12} className="mr-1" />
                            Published
                          </span> : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <XCircleIcon size={12} className="mr-1" />
                            Draft
                          </span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(quiz.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 p-1" onClick={e => {
                    e.stopPropagation();
                    handleQuizClick(quiz.id);
                  }} aria-label="View quiz details">
                            <EyeIcon size={16} />
                          </button>
                          <button className="text-indigo-600 hover:text-indigo-900 p-1" onClick={e => handleEditClick(e, quiz.id)} aria-label="Edit quiz">
                            <EditIcon size={16} />
                          </button>
                          <button className="text-red-600 hover:text-red-900 p-1" onClick={e => handleDeleteClick(e, quiz.id)} aria-label="Delete quiz">
                            <TrashIcon size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>)}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {filteredQuizzes.length > 0 && <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to{' '}
                    <span className="font-medium">
                      {filteredQuizzes.length}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium">
                      {filteredQuizzes.length}
                    </span>{' '}
                    results
                  </p>
                </div>
              </div>
            </div>}
        </div>}

      {/* Quiz Details Modal */}
      {showQuizModal && selectedQuizId && <QuizDetailsModal isOpen={showQuizModal} onClose={handleCloseModal} quizId={selectedQuizId} quizzes={quizzes} />}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && <ConfirmModal isOpen={showDeleteModal} onClose={handleCloseModal} onConfirm={handleConfirmDelete} title="Delete Quiz" message="Are you sure you want to delete this quiz? This action cannot be undone." confirmText="Delete" confirmColor="red" isSubmitting={isSubmitting} />}
    </div>;
};
export default AdminQuizzes;