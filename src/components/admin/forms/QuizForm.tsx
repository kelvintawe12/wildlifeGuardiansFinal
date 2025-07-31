import React, { useEffect, useState } from 'react';
import { PlusIcon, TrashIcon, XIcon } from 'lucide-react';
import { QuizWithQuestions, QuizInput, QuestionInput } from '../../../backend/api/quizzes';
import { Animal } from '../../../backend/api/animals';
interface QuizFormProps {
  quiz?: QuizWithQuestions;
  animals: Animal[];
  onSubmit: (quiz: QuizInput, questions: QuestionInput[]) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}
const QuizForm: React.FC<QuizFormProps> = ({
  quiz,
  animals,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [published, setPublished] = useState(false);
  const [animalId, setAnimalId] = useState<string>('');
  const [questions, setQuestions] = useState<{
    question_text: string;
    options: string[];
    correct_answer: string;
    explanation?: string;
    order_num: number;
  }[]>([{
    question_text: '',
    options: ['', '', '', ''],
    correct_answer: '',
    explanation: '',
    order_num: 1
  }]);
  const [errors, setErrors] = useState<{
    quiz?: Record<string, string>;
    questions?: Record<number, Record<string, string>>;
  }>({});
  useEffect(() => {
    if (quiz) {
      setTitle(quiz.title);
      setDescription(quiz.description);
      setDifficulty(quiz.difficulty);
      setPublished(quiz.published);
      setAnimalId(quiz.animal_id || '');
      if (quiz.questions && quiz.questions.length > 0) {
        setQuestions(quiz.questions.map(q => ({
          question_text: q.question_text,
          options: q.options,
          correct_answer: q.correct_answer,
          explanation: q.explanation || '',
          order_num: q.order_num
        })));
      }
    }
  }, [quiz]);
  const validateForm = (): boolean => {
    const newErrors: {
      quiz?: Record<string, string>;
      questions?: Record<number, Record<string, string>>;
    } = {};
    // Validate quiz fields
    const quizErrors: Record<string, string> = {};
    if (!title.trim()) quizErrors.title = 'Title is required';
    if (!description.trim()) quizErrors.description = 'Description is required';
    if (Object.keys(quizErrors).length > 0) {
      newErrors.quiz = quizErrors;
    }
    // Validate questions
    const questionErrors: Record<number, Record<string, string>> = {};
    questions.forEach((question, index) => {
      const errors: Record<string, string> = {};
      if (!question.question_text.trim()) {
        errors.question_text = 'Question text is required';
      }
      // Check options
      const validOptions = question.options.filter(opt => opt.trim() !== '');
      if (validOptions.length < 2) {
        errors.options = 'At least 2 options are required';
      }
      // Check if correct answer is set and valid
      if (!question.correct_answer) {
        errors.correct_answer = 'Correct answer is required';
      } else if (!question.options.includes(question.correct_answer)) {
        errors.correct_answer = 'Correct answer must be one of the options';
      }
      if (Object.keys(errors).length > 0) {
        questionErrors[index] = errors;
      }
    });
    if (Object.keys(questionErrors).length > 0) {
      newErrors.questions = questionErrors;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    // Prepare quiz data
    const quizData: QuizInput = {
      title,
      description,
      difficulty,
      published,
      animal_id: animalId || undefined
    };
    // Prepare questions data
    const questionsData: QuestionInput[] = questions.map((q, index) => ({
      question_text: q.question_text,
      options: q.options.filter(opt => opt.trim() !== ''),
      correct_answer: q.correct_answer,
      explanation: q.explanation || undefined,
      order_num: index + 1,
      quiz_id: quiz?.id || '' // This will be set by the backend for new quizzes
    }));
    onSubmit(quizData, questionsData);
  };
  const handleAddQuestion = () => {
    setQuestions([...questions, {
      question_text: '',
      options: ['', '', '', ''],
      correct_answer: '',
      explanation: '',
      order_num: questions.length + 1
    }]);
  };
  const handleRemoveQuestion = (index: number) => {
    if (questions.length > 1) {
      const newQuestions = [...questions];
      newQuestions.splice(index, 1);
      // Update order numbers
      const updatedQuestions = newQuestions.map((q, i) => ({
        ...q,
        order_num: i + 1
      }));
      setQuestions(updatedQuestions);
    }
  };
  const handleQuestionChange = (index: number, field: string, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = {
      ...newQuestions[index],
      [field]: value
    };
    setQuestions(newQuestions);
  };
  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    // If this option was the correct answer, update the correct answer too
    if (newQuestions[questionIndex].correct_answer === newQuestions[questionIndex].options[optionIndex]) {
      newQuestions[questionIndex].correct_answer = value;
    }
    setQuestions(newQuestions);
  };
  const handleAddOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push('');
    setQuestions(newQuestions);
  };
  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    if (questions[questionIndex].options.length > 2) {
      const newQuestions = [...questions];
      // Check if we're removing the correct answer
      const removedOption = newQuestions[questionIndex].options[optionIndex];
      if (newQuestions[questionIndex].correct_answer === removedOption) {
        newQuestions[questionIndex].correct_answer = '';
      }
      newQuestions[questionIndex].options.splice(optionIndex, 1);
      setQuestions(newQuestions);
    }
  };
  const handleSetCorrectAnswer = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].correct_answer = newQuestions[questionIndex].options[optionIndex];
    setQuestions(newQuestions);
  };
  return <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Quiz Information
        </h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Quiz Title *
              </label>
              <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className={`mt-1 block w-full rounded-md border ${errors.quiz?.title ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} />
              {errors.quiz?.title && <p className="mt-1 text-sm text-red-600">{errors.quiz.title}</p>}
            </div>
            <div>
              <label htmlFor="animal" className="block text-sm font-medium text-gray-700">
                Related Animal (Optional)
              </label>
              <select id="animal" value={animalId} onChange={e => setAnimalId(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option value="">None</option>
                {animals.map(animal => <option key={animal.id} value={animal.id}>
                    {animal.name}
                  </option>)}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className={`mt-1 block w-full rounded-md border ${errors.quiz?.description ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} />
            {errors.quiz?.description && <p className="mt-1 text-sm text-red-600">
                {errors.quiz.description}
              </p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                Difficulty Level
              </label>
              <select id="difficulty" value={difficulty} onChange={e => setDifficulty(e.target.value as any)} className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="flex items-center h-full pt-6">
              <input id="published" name="published" type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                Publish quiz (make it available to students)
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Quiz Questions</h2>
          <button type="button" onClick={handleAddQuestion} className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <PlusIcon size={16} className="mr-1" />
            Add Question
          </button>
        </div>
        {questions.map((question, questionIndex) => <div key={questionIndex} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-md font-medium text-gray-900">
                Question {questionIndex + 1}
              </h3>
              {questions.length > 1 && <button type="button" onClick={() => handleRemoveQuestion(questionIndex)} className="text-red-600 hover:text-red-800">
                  <TrashIcon size={18} />
                </button>}
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor={`question-${questionIndex}`} className="block text-sm font-medium text-gray-700">
                  Question Text *
                </label>
                <input type="text" id={`question-${questionIndex}`} value={question.question_text} onChange={e => handleQuestionChange(questionIndex, 'question_text', e.target.value)} className={`mt-1 block w-full rounded-md border ${errors.questions?.[questionIndex]?.question_text ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} />
                {errors.questions?.[questionIndex]?.question_text && <p className="mt-1 text-sm text-red-600">
                    {errors.questions[questionIndex].question_text}
                  </p>}
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Answer Options *
                  </label>
                  <button type="button" onClick={() => handleAddOption(questionIndex)} className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <PlusIcon size={14} className="mr-1" />
                    Add Option
                  </button>
                </div>
                {errors.questions?.[questionIndex]?.options && <p className="mt-1 text-sm text-red-600 mb-2">
                    {errors.questions[questionIndex].options}
                  </p>}
                {errors.questions?.[questionIndex]?.correct_answer && <p className="mt-1 text-sm text-red-600 mb-2">
                    {errors.questions[questionIndex].correct_answer}
                  </p>}
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => <div key={optionIndex} className="flex items-center">
                      <input type="radio" id={`question-${questionIndex}-option-${optionIndex}`} name={`question-${questionIndex}-correct`} checked={option === question.correct_answer} onChange={() => handleSetCorrectAnswer(questionIndex, optionIndex)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                      <input type="text" value={option} onChange={e => handleOptionChange(questionIndex, optionIndex, e.target.value)} className="ml-2 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder={`Option ${optionIndex + 1}`} />
                      {question.options.length > 2 && <button type="button" onClick={() => handleRemoveOption(questionIndex, optionIndex)} className="ml-2 text-red-600 hover:text-red-800">
                          <XIcon size={16} />
                        </button>}
                    </div>)}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Select the radio button next to the correct answer
                </p>
              </div>
              <div>
                <label htmlFor={`explanation-${questionIndex}`} className="block text-sm font-medium text-gray-700">
                  Explanation (Optional)
                </label>
                <textarea id={`explanation-${questionIndex}`} value={question.explanation} onChange={e => handleQuestionChange(questionIndex, 'explanation', e.target.value)} rows={2} className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Explain why the correct answer is right (shown after answering)" />
              </div>
            </div>
          </div>)}
      </div>
      <div className="flex justify-end space-x-3 pt-5">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed">
          {isSubmitting ? 'Saving...' : quiz ? 'Update Quiz' : 'Create Quiz'}
        </button>
      </div>
    </form>;
};
export default QuizForm;