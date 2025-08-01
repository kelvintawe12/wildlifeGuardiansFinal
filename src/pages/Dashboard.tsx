
import { useEffect, useState } from 'react';
import { BookOpenIcon, AwardIcon, TrendingUpIcon, CalendarIcon, LeafIcon, ListChecksIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getUserQuizResults, getUserBadges } from '../backend/api/users';
import { getAllAnimals } from '../backend/api/animals';
import { getAllQuizzes } from '../backend/api/quizzes';
import { getAllBadges } from '../backend/api/badges';

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [allAnimals, setAllAnimals] = useState<Animal[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);
  const [userStats, setUserStats] = useState({ quizzesCompleted: 0, badgesEarned: 0, averageScore: 0, streak: 0 });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const currentUser = localStorage.getItem('currentUser');
        const userId = currentUser ? JSON.parse(currentUser).id : null;
        if (userId) {
          // Fetch all quizzes
          const quizzes = await getAllQuizzes();
          setAllQuizzes(quizzes);
          // Fetch user quiz results
          const quizResultsData = await getUserQuizResults(userId);
          setQuizResults(quizResultsData);
          // Fetch all animals
          const animals = await getAllAnimals();
          setAllAnimals(animals);
          // Fetch all badges (not used directly)
          await getAllBadges();
          // Fetch earned badges
          const earned = await getUserBadges(userId);
          setEarnedBadges(earned);
          // Stats
          const quizzesCompleted = quizResultsData.length;
          const badgesEarned = earned.length;
          const averageScore = quizzesCompleted > 0
            ? Math.round(
                quizResultsData.reduce((acc, curr) => acc + (curr.score / curr.max_score) * 100, 0) /
                  quizzesCompleted
              )
            : 0;
          const streak = 0; // Placeholder
          setUserStats({ quizzesCompleted, badgesEarned, averageScore, streak });
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
    // Listen for userProgressUpdated event
    const handleUserProgressUpdated = () => fetchDashboardData();
    window.addEventListener('userProgressUpdated', handleUserProgressUpdated);
    return () => {
      window.removeEventListener('userProgressUpdated', handleUserProgressUpdated);
    };
  }, []);

type Quiz = {
  id: string;
  title: string;
  difficulty: string;
  animal_id?: string;
};
type Animal = {
  id: string;
  name: string;
  image_url?: string;
  status: string;
};
type Badge = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  badges?: any;
};
type QuizResult = {
  id: string;
  quiz_id: string;
  score: number;
  max_score: number;
  completed_at?: string;
};

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Welcome to Your Dashboard!</h1>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-3 mr-4">
              <BookOpenIcon size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">{userStats.quizzesCompleted}</h3>
              <p className="text-sm text-gray-500">Quizzes Completed</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-full p-3 mr-4">
              <AwardIcon size={24} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">{userStats.badgesEarned}</h3>
              <p className="text-sm text-gray-500">Badges Earned</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-full p-3 mr-4">
              <TrendingUpIcon size={24} className="text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">{userStats.averageScore}%</h3>
              <p className="text-sm text-gray-500">Average Score</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-full p-3 mr-4">
              <CalendarIcon size={24} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">{userStats.streak}</h3>
              <p className="text-sm text-gray-500">Days Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* All Quizzes */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><ListChecksIcon className="mr-2" />My Quizzes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-sm border border-gray-100">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-4 text-left">Quiz</th>
                <th className="py-2 px-4 text-left">Difficulty</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Score</th>
                <th className="py-2 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {allQuizzes.map((quiz) => {
                const result = quizResults.find((r) => r.quiz_id === quiz.id);
                return (
                  <tr key={quiz.id} className="border-t">
                    <td className="py-2 px-4">{quiz.title}</td>
                    <td className="py-2 px-4 capitalize">{quiz.difficulty}</td>
                    <td className="py-2 px-4">
                      {result ? (
                        <span className="text-green-600 font-medium">Completed</span>
                      ) : (
                        <span className="text-gray-400">Not Taken</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {result ? `${result.score} / ${result.max_score}` : '-'}
                    </td>
                    <td className="py-2 px-4">
                      <Link
                        to={`/quiz?id=${quiz.id}`}
                        className="inline-block bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                      >
                        {result ? 'Retake' : 'Take Quiz'}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* My Badges */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><AwardIcon className="mr-2" />My Badges</h2>
        <div className="flex flex-wrap gap-4">
          {earnedBadges.length === 0 && <span className="text-gray-500">No badges earned yet.</span>}
          {earnedBadges.map((badge) => (
            <div key={badge.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center w-40">
              <img src={badge.badges?.image_url || badge.image_url} alt={badge.badges?.name || badge.name} className="w-16 h-16 object-contain mb-2" />
              <div className="font-bold text-green-700 text-center">{badge.badges?.name || badge.name}</div>
              <div className="text-xs text-gray-500 text-center">{badge.badges?.description || badge.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* All Animals */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><LeafIcon className="mr-2" />All Animals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {allAnimals.map((animal) => {
            // Find quizzes for this animal
            const animalQuizzes = allQuizzes.filter((quiz) => quiz.animal_id === animal.id);
            return (
              <div
                key={animal.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col"
              >
                <Link
                  to={`/animals?id=${animal.id}`}
                  className="block"
                >
                  <img src={animal.image_url} alt={animal.name} className="w-full h-40 object-cover" />
                  <div className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-800">{animal.name}</h3>
                      <span className="inline-block text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                        {animal.status.charAt(0).toUpperCase() + animal.status.slice(1).replace('_', ' ')}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <LeafIcon size={14} className="mr-1" />
                      <span>Click to learn more</span>
                    </div>
                  </div>
                </Link>
                <div className="px-4 pb-4 pt-1">
                  {animalQuizzes.length === 0 ? (
                    <span className="inline-block text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full mb-2">Untracked Quizzes</span>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {animalQuizzes.map((quiz) => (
                        <Link
                          key={quiz.id}
                          to={`/quiz?id=${quiz.id}`}
                          className="inline-block bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs font-medium"
                        >
                          {quiz.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quiz History */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><BookOpenIcon className="mr-2" />My Quiz History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-sm border border-gray-100">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-4 text-left">Quiz</th>
                <th className="py-2 px-4 text-left">Score</th>
                <th className="py-2 px-4 text-left">Completed At</th>
              </tr>
            </thead>
            <tbody>
              {quizResults.length === 0 && (
                <tr><td colSpan={3} className="text-center text-gray-400 py-4">No quiz history yet.</td></tr>
              )}
              {quizResults.map((result) => {
                const quiz = allQuizzes.find((q) => q.id === result.quiz_id);
                return (
                  <tr key={result.id} className="border-t">
                    <td className="py-2 px-4">{quiz ? quiz.title : 'Quiz'}</td>
                    <td className="py-2 px-4">{result.score} / {result.max_score}</td>
                    <td className="py-2 px-4">{result.completed_at ? new Date(result.completed_at).toLocaleString() : '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
