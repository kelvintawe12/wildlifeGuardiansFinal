import { useEffect, useState } from 'react';
import { CheckCircleIcon, XCircleIcon, ChevronRightIcon, ClockIcon, AlertCircleIcon } from 'lucide-react';
import { getAllQuizzes, getQuizById } from '../backend/api/quizzes';
import { supabase } from '../backend/config/supabase';

const Quiz = () => {
  const [currentQuiz, setCurrentQuiz] = useState<any | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [availableQuizzes, setAvailableQuizzes] = useState<any[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const quizzes = await getAllQuizzes();
        setAvailableQuizzes(quizzes);
      } catch (err) {
        console.error('Error fetching quizzes:', err);
        setError('Failed to load quizzes. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  // Fetch questions for a quiz when a quiz is started
  const handleStartQuiz = async (quizId: string) => {
    setCurrentQuiz(quizId);
    setCurrentQuestion(0);
    setScore(0);
    setQuizCompleted(false);
    setIsAnswered(false);
    setSelectedAnswer(null);
    setIsLoading(true);
    try {
      const quiz = await getQuizById(quizId);
      if (quiz && quiz.questions) {
        setQuizQuestions(quiz.questions);
      } else {
        setQuizQuestions([]);
        setError('No questions found for this quiz.');
      }
    } catch (err) {
      setError('Failed to load quiz questions.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleSelectAnswer = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    if (quizQuestions && quizQuestions[currentQuestion]?.correct_answer === answer) {
      setScore(score + 1);
    }
  };
  // Save quiz result and award badge if needed
  const saveQuizResultAndAwardBadge = async () => {
    try {
      const currentUser = localStorage.getItem('currentUser');
      const userId = currentUser ? JSON.parse(currentUser).id : null;
      if (!userId || !currentQuiz) return;
      // Save quiz result
      await supabase.from('user_quizzes').insert({
        user_id: userId,
        quiz_id: currentQuiz,
        score,
        max_score: quizQuestions.length,
        completed_at: new Date().toISOString()
      });
      // Award badge if score >= half
      if (score >= Math.ceil(quizQuestions.length / 2)) {
        // Find badge for this quiz (assume badge id matches quiz id or use a mapping)
        await supabase.from('user_badges').insert({
          user_id: userId,
          badge_id: currentQuiz,
          awarded_at: new Date().toISOString()
        });
      }
      // Optionally, trigger a refresh of sidebar/dashboard stats (could use a global state or event)
    } catch (err) {
      console.error('Error saving quiz result or awarding badge:', err);
    }
  };

  const handleNextQuestion = async () => {
    if (!quizQuestions) return;
    const totalQuestions = quizQuestions.length;
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
      await saveQuizResultAndAwardBadge();
      // Notify sidebar/dashboard to refresh
      window.dispatchEvent(new Event('userProgressUpdated'));
    }
  };
  const handleBackToQuizzes = () => {
    setCurrentQuiz(null);
    setQuizCompleted(false);
    setQuizQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
  };
  const renderQuizSelection = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>;
    }
    if (error) {
      return <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex">
            <AlertCircleIcon className="h-6 w-6 text-red-400 mr-3" />
            <div>
              <p className="text-red-700">{error}</p>
              <button onClick={() => window.location.reload()} className="mt-2 text-red-600 hover:text-red-800 font-medium">
                Try Again
              </button>
            </div>
          </div>
        </div>;
    }
    return <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Wildlife Quizzes
          </h1>
          <p className="text-gray-600">
            Test your knowledge about endangered animals!
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableQuizzes.map(quiz => <div key={quiz.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <img src={quiz.image} alt={quiz.title} className="w-full h-48 object-cover" />
              <div className="p-5">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-bold text-lg text-gray-800">
                    {quiz.title}
                  </h2>
                  <span className={`text-xs px-2 py-1 rounded-full ${quiz.difficulty === 'easy' ? 'bg-green-100 text-green-800' : quiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {quiz.num_questions || 0} questions
                  </span>
                  <button onClick={() => handleStartQuiz(quiz.id)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Start Quiz
                  </button>
                </div>
              </div>
            </div>)}
        </div>
      </div>;
  };
  const renderQuizQuestion = () => {
    if (!currentQuiz || !quizQuestions.length) return null;
    const quiz = availableQuizzes.find(q => q.id === currentQuiz);
    const currentQ = quizQuestions[currentQuestion];
    return <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
            {quiz?.title}
          </h1>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </p>
            <div className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              Score: {score}/{quizQuestions.length}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            {currentQ.question_text}
          </h2>
          <div className="space-y-3">
            {currentQ.options.map((option: string, index: number) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = isAnswered && option === currentQ.correct_answer;
              const isWrong = isAnswered && isSelected && option !== currentQ.correct_answer;
              return (
                <button key={index} onClick={() => handleSelectAnswer(option)} disabled={isAnswered} className={`w-full text-left p-4 rounded-lg border transition-all ${isSelected ? isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300' : isAnswered && option === currentQ.correct_answer ? 'bg-green-50 border-green-300' : 'border-gray-200 hover:border-blue-300'}`}>
                  <div className="flex justify-between items-center">
                    <span>{option}</span>
                    {isCorrect && <CheckCircleIcon size={20} className="text-green-600" />}
                    {isWrong && <XCircleIcon size={20} className="text-red-600" />}
                  </div>
                </button>
              );
            })}
          </div>
          {isAnswered && currentQ.explanation && <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-lg text-sm">
              <p className="font-medium mb-1">Explanation:</p>
              <p>{currentQ.explanation}</p>
            </div>}
        </div>
        <div className="flex justify-between">
          <button onClick={handleBackToQuizzes} className="text-gray-600 hover:text-gray-800 font-medium">
            Exit Quiz
          </button>
          {isAnswered && <button onClick={handleNextQuestion} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
              {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'See Results'}
              <ChevronRightIcon size={18} className="ml-1" />
            </button>}
        </div>
      </div>;
  };
  const renderQuizResults = () => {
    if (!currentQuiz || !quizQuestions.length) return null;
    const quiz = availableQuizzes.find(q => q.id === currentQuiz);
    const percentage = score / quizQuestions.length * 100;
    let resultMessage = '';
    let resultClass = '';
    if (percentage >= 80) {
      resultMessage = "Excellent! You're a wildlife expert!";
      resultClass = 'bg-green-100 text-green-800';
    } else if (percentage >= 60) {
      resultMessage = 'Good job! You know your wildlife facts!';
      resultClass = 'bg-blue-100 text-blue-800';
    } else {
      resultMessage = "Keep learning! You'll be a wildlife expert soon!";
      resultClass = 'bg-yellow-100 text-yellow-800';
    }
    return <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6 border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {quiz?.title} Results
          </h1>
          <div className="mb-6">
            <div className="text-5xl font-bold text-blue-600 mb-2">
              {score}/{quizQuestions.length}
            </div>
            <div className={`inline-block px-4 py-2 rounded-full ${resultClass}`}>
              {resultMessage}
            </div>
            <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
              <ClockIcon size={16} className="mr-1" />
              Completed on {new Date().toLocaleDateString()} at{' '}
              {new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
            </div>
          </div>
          {percentage >= 60 && <div className="mb-8">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <img src={quiz?.image || 'https://images.unsplash.com/photo-1531909390160-b9da8dd454c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'} alt="Badge" className="w-24 h-24 rounded-full object-cover border-4 border-green-100" />
                <div className="absolute -bottom-2 -right-2 bg-green-500 p-1.5 rounded-full border-2 border-white">
                  <CheckCircleIcon size={16} className="text-white" />
                </div>
              </div>
              <p className="text-green-700 font-medium">
                You earned the {quiz?.title.split(' ')[0]} Expert Badge!
              </p>
            </div>}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => handleStartQuiz(currentQuiz)} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
              Try Again
            </button>
            <button onClick={handleBackToQuizzes} className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-lg transition-colors">
              Back to Quizzes
            </button>
          </div>
        </div>
      </div>;
  };
  if (currentQuiz && quizCompleted) {
    return renderQuizResults();
  } else if (currentQuiz) {
    return renderQuizQuestion();
  } else {
    return renderQuizSelection();
  }
};
export default Quiz;