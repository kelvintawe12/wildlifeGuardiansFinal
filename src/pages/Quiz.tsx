import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, XCircleIcon, ChevronRightIcon, ClockIcon, AlertCircleIcon } from 'lucide-react';
type QuizOption = string;
type Question = {
  id: string;
  question_text: string;
  options: QuizOption[];
  correct_answer: string;
  explanation?: string;
};
type Quiz = {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  image: string;
  questions: number;
};
const Quiz = () => {
  const [currentQuiz, setCurrentQuiz] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [availableQuizzes, setAvailableQuizzes] = useState<Quiz[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<Record<string, Question[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    // Fetch available quizzes
    const fetchQuizzes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 500));
        // Mock quizzes data
        const quizzesData: Quiz[] = [{
          id: 'gorilla',
          title: 'Mountain Gorilla Quiz',
          image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          description: "Test your knowledge about Rwanda's mountain gorillas!",
          difficulty: 'easy',
          questions: 5
        }, {
          id: 'rhino',
          title: 'Black Rhino Quiz',
          image: 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          description: 'Learn about the endangered black rhino in Africa.',
          difficulty: 'medium',
          questions: 5
        }, {
          id: 'elephant',
          title: 'African Elephant Quiz',
          image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          description: 'Discover interesting facts about African elephants!',
          difficulty: 'medium',
          questions: 5
        }];
        setAvailableQuizzes(quizzesData);
        // Mock questions data
        const questionsData: Record<string, Question[]> = {
          gorilla: [{
            id: 'g1',
            question_text: 'What is the scientific name for the mountain gorilla?',
            options: ['Gorilla gorilla', 'Gorilla beringei beringei', 'Pan troglodytes', 'Gorilla montanus'],
            correct_answer: 'Gorilla beringei beringei'
          }, {
            id: 'g2',
            question_text: 'Where are mountain gorillas found?',
            options: ['West Africa', 'East and Central Africa', 'South Africa', 'North Africa'],
            correct_answer: 'East and Central Africa'
          }, {
            id: 'g3',
            question_text: 'What is the conservation status of mountain gorillas?',
            options: ['Least Concern', 'Vulnerable', 'Endangered', 'Critically Endangered'],
            correct_answer: 'Endangered'
          }, {
            id: 'g4',
            question_text: 'What do mountain gorillas primarily eat?',
            options: ['Meat', 'Fruits', 'Plants and vegetation', 'Insects'],
            correct_answer: 'Plants and vegetation'
          }, {
            id: 'g5',
            question_text: 'How many mountain gorillas are estimated to exist in the wild?',
            options: ['Less than 100', 'Around 500', 'Around 1,000', 'Over 10,000'],
            correct_answer: 'Around 1,000'
          }],
          rhino: [{
            id: 'r1',
            question_text: 'What is the conservation status of the black rhino?',
            options: ['Least Concern', 'Vulnerable', 'Endangered', 'Critically Endangered'],
            correct_answer: 'Critically Endangered'
          }, {
            id: 'r2',
            question_text: 'How many horns does a black rhino have?',
            options: ['None', 'One', 'Two', 'Three'],
            correct_answer: 'Two'
          }, {
            id: 'r3',
            question_text: 'What is the main threat to black rhinos?',
            options: ['Climate change', 'Disease', 'Poaching', 'Habitat loss'],
            correct_answer: 'Poaching'
          }, {
            id: 'r4',
            question_text: 'What do black rhinos primarily eat?',
            options: ['Grass', 'Leaves and woody plants', 'Insects', 'Small mammals'],
            correct_answer: 'Leaves and woody plants'
          }, {
            id: 'r5',
            question_text: 'Which continent are black rhinos native to?',
            options: ['Asia', 'Africa', 'Australia', 'South America'],
            correct_answer: 'Africa'
          }],
          elephant: [{
            id: 'e1',
            question_text: 'How much can an adult African elephant weigh?',
            options: ['Up to 2,000 kg', 'Up to 3,500 kg', 'Up to 6,000 kg', 'Up to 8,000 kg'],
            correct_answer: 'Up to 6,000 kg'
          }, {
            id: 'e2',
            question_text: 'What is the gestation period for African elephants?',
            options: ['9-12 months', '13-16 months', '20-22 months', '2-3 years'],
            correct_answer: '20-22 months'
          }, {
            id: 'e3',
            question_text: 'What is the main threat to African elephants?',
            options: ['Disease', 'Climate change', 'Poaching for ivory', 'Predators'],
            correct_answer: 'Poaching for ivory'
          }, {
            id: 'e4',
            question_text: 'How do elephants communicate over long distances?',
            options: ['Visual signals', 'Infrasound rumbles', 'Scent marking', 'Messenger elephants'],
            correct_answer: 'Infrasound rumbles'
          }, {
            id: 'e5',
            question_text: 'Which of these is NOT a characteristic of African elephants?',
            options: ['Larger ears than Asian elephants', 'Both males and females have tusks', 'Smooth trunk with one finger-like projection', 'Highly social family groups led by matriarchs'],
            correct_answer: 'Smooth trunk with one finger-like projection'
          }]
        };
        setQuizQuestions(questionsData);
      } catch (err) {
        console.error('Error fetching quizzes:', err);
        setError('Failed to load quizzes. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuizzes();
  }, []);
  const handleStartQuiz = (quizId: string) => {
    setCurrentQuiz(quizId);
    setCurrentQuestion(0);
    setScore(0);
    setQuizCompleted(false);
    setIsAnswered(false);
    setSelectedAnswer(null);
  };
  const handleSelectAnswer = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    if (currentQuiz) {
      const isCorrect = quizQuestions[currentQuiz][currentQuestion].correct_answer === answer;
      if (isCorrect) {
        setScore(score + 1);
      }
    }
  };
  const handleNextQuestion = () => {
    if (!currentQuiz) return;
    const totalQuestions = quizQuestions[currentQuiz].length;
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Quiz completed - store the results
      storeQuizResult();
      setQuizCompleted(true);
    }
  };
  const storeQuizResult = async () => {
    if (!currentQuiz) return;
    try {
      // Get current user from localStorage
      const currentUser = localStorage.getItem('currentUser');
      const userId = currentUser ? JSON.parse(currentUser).id : null;
      if (!userId) return;
      // In a real app, this would be an API call to store the quiz result
      // For now, just store in localStorage for demo purposes
      const quizResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
      const newResult = {
        id: Date.now().toString(),
        userId,
        quizId: currentQuiz,
        quizTitle: availableQuizzes.find(q => q.id === currentQuiz)?.title || '',
        score,
        maxScore: quizQuestions[currentQuiz].length,
        completedAt: new Date().toISOString()
      };
      quizResults.push(newResult);
      localStorage.setItem('quizResults', JSON.stringify(quizResults));
      // Check if user earned a badge
      if (score / quizQuestions[currentQuiz].length >= 0.8) {
        // In a real app, this would be an API call to award a badge
        const badges = JSON.parse(localStorage.getItem('userBadges') || '[]');
        // Check if user already has this badge
        const badgeName = `${availableQuizzes.find(q => q.id === currentQuiz)?.title.split(' ')[0]} Expert`;
        if (!badges.some((b: any) => b.name === badgeName)) {
          const newBadge = {
            id: Date.now().toString(),
            userId,
            name: badgeName,
            description: `Completed the ${availableQuizzes.find(q => q.id === currentQuiz)?.title} with a high score`,
            imageUrl: availableQuizzes.find(q => q.id === currentQuiz)?.image || '',
            awardedAt: new Date().toISOString()
          };
          badges.push(newBadge);
          localStorage.setItem('userBadges', JSON.stringify(badges));
        }
      }
    } catch (err) {
      console.error('Error storing quiz result:', err);
    }
  };
  const handleBackToQuizzes = () => {
    setCurrentQuiz(null);
    setQuizCompleted(false);
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
                    {quiz.questions} questions
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
    if (!currentQuiz) return null;
    const quiz = availableQuizzes.find(q => q.id === currentQuiz);
    const questions = quizQuestions[currentQuiz];
    const currentQ = questions[currentQuestion];
    return <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
            {quiz?.title}
          </h1>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </p>
            <div className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              Score: {score}/{currentQuestion}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            {currentQ.question_text}
          </h2>
          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = isAnswered && option === currentQ.correct_answer;
            const isWrong = isAnswered && isSelected && option !== currentQ.correct_answer;
            return <button key={index} onClick={() => handleSelectAnswer(option)} disabled={isAnswered} className={`w-full text-left p-4 rounded-lg border transition-all ${isSelected ? isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300' : isAnswered && option === currentQ.correct_answer ? 'bg-green-50 border-green-300' : 'border-gray-200 hover:border-blue-300'}`}>
                  <div className="flex justify-between items-center">
                    <span>{option}</span>
                    {isCorrect && <CheckCircleIcon size={20} className="text-green-600" />}
                    {isWrong && <XCircleIcon size={20} className="text-red-600" />}
                  </div>
                </button>;
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
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
              <ChevronRightIcon size={18} className="ml-1" />
            </button>}
        </div>
      </div>;
  };
  const renderQuizResults = () => {
    if (!currentQuiz) return null;
    const quiz = availableQuizzes.find(q => q.id === currentQuiz);
    const questions = quizQuestions[currentQuiz];
    const percentage = score / questions.length * 100;
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
              {score}/{questions.length}
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