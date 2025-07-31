import React, { useEffect, useState } from 'react';
import { Badge, BadgeInput } from '../../../backend/api/badges';
interface BadgeFormProps {
  badge?: Badge;
  onSubmit: (badge: BadgeInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}
const BadgeForm: React.FC<BadgeFormProps> = ({
  badge,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [requirementType, setRequirementType] = useState('quiz_completion');
  const [requirementValue, setRequirementValue] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    if (badge) {
      setName(badge.name);
      setDescription(badge.description);
      setCategory(badge.category);
      setImageUrl(badge.image_url || '');
      // Extract requirement data
      const requirements = badge.requirements;
      if (requirements.type) {
        setRequirementType(requirements.type);
        setRequirementValue(requirements.value || '');
      }
    }
  }, [badge]);
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!category.trim()) newErrors.category = 'Category is required';
    // Validate requirement value based on type
    if (requirementType === 'quiz_score' || requirementType === 'quiz_completion') {
      if (!requirementValue.trim()) {
        newErrors.requirementValue = 'Value is required';
      } else if (requirementType === 'quiz_score') {
        const score = parseInt(requirementValue);
        if (isNaN(score) || score < 0 || score > 100) {
          newErrors.requirementValue = 'Score must be between 0 and 100';
        }
      } else if (requirementType === 'quiz_completion') {
        const count = parseInt(requirementValue);
        if (isNaN(count) || count <= 0) {
          newErrors.requirementValue = 'Must be a positive number';
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    // Build requirements object
    const requirements: Record<string, any> = {
      type: requirementType
    };
    if (requirementType === 'quiz_score') {
      requirements.value = parseInt(requirementValue);
    } else if (requirementType === 'quiz_completion') {
      requirements.value = parseInt(requirementValue);
    } else if (requirementType === 'login_streak') {
      requirements.value = parseInt(requirementValue);
    }
    const badgeData: BadgeInput = {
      name,
      description,
      category,
      image_url: imageUrl || undefined,
      requirements
    };
    onSubmit(badgeData);
  };
  return <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Badge Name *
          </label>
          <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className={`mt-1 block w-full rounded-md border ${errors.name ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category *
          </label>
          <input type="text" id="category" value={category} onChange={e => setCategory(e.target.value)} className={`mt-1 block w-full rounded-md border ${errors.category ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} placeholder="Achievement, Quiz, Engagement" />
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className={`mt-1 block w-full rounded-md border ${errors.description ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} placeholder="Describe how to earn this badge" />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>
      <div>
        <label htmlFor="image-url" className="block text-sm font-medium text-gray-700">
          Badge Image URL
        </label>
        <input type="url" id="image-url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="https://example.com/badge.png" />
      </div>
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-medium text-gray-900">
          Badge Requirements
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Define what a user needs to do to earn this badge
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="requirement-type" className="block text-sm font-medium text-gray-700">
              Requirement Type
            </label>
            <select id="requirement-type" value={requirementType} onChange={e => setRequirementType(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option value="quiz_completion">Complete Quizzes</option>
              <option value="quiz_score">Achieve Quiz Score</option>
              <option value="login_streak">Login Streak</option>
              <option value="view_animals">View Animals</option>
              <option value="special">Special Achievement</option>
            </select>
          </div>
          <div>
            <label htmlFor="requirement-value" className="block text-sm font-medium text-gray-700">
              Requirement Value
            </label>
            <input type="text" id="requirement-value" value={requirementValue} onChange={e => setRequirementValue(e.target.value)} className={`mt-1 block w-full rounded-md border ${errors.requirementValue ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} placeholder={requirementType === 'quiz_score' ? 'Score (e.g., 100)' : requirementType === 'quiz_completion' ? 'Number of quizzes' : requirementType === 'login_streak' ? 'Days in a row' : requirementType === 'view_animals' ? 'Number of animals' : 'Special requirement'} />
            {errors.requirementValue && <p className="mt-1 text-sm text-red-600">
                {errors.requirementValue}
              </p>}
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-5">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed">
          {isSubmitting ? 'Saving...' : badge ? 'Update Badge' : 'Create Badge'}
        </button>
      </div>
    </form>;
};
export default BadgeForm;