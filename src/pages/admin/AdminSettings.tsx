import React, { useState } from 'react';
import { SaveIcon, AlertCircleIcon, CheckCircleIcon, BellIcon, GlobeIcon, ShieldIcon, DatabaseIcon } from 'lucide-react';
const AdminSettings = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    siteName: 'Wildlife Guardians',
    siteDescription: 'Educational platform for wildlife conservation',
    emailNotifications: true,
    quizAutoPublish: false,
    maintenanceMode: false,
    dataRetentionDays: 90,
    backupFrequency: 'weekly',
    logLevel: 'error'
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value,
      type
    } = e.target as HTMLInputElement;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(null);
    setError(null);
    try {
      // In a real app, this would be an API call to save settings
      await new Promise(resolve => setTimeout(resolve, 800));
      // Save to localStorage for demo purposes
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      setSuccess('Settings saved successfully');
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>
        <button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed">
          <SaveIcon size={16} className="mr-2" />
          {isSubmitting ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
      {error && <div className="bg-red-50 border-l-4 border-red-400 p-4 flex items-center">
          <AlertCircleIcon size={20} className="text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>}
      {success && <div className="bg-green-50 border-l-4 border-green-400 p-4 flex items-center">
          <CheckCircleIcon size={20} className="text-green-500 mr-2" />
          <span className="text-green-700">{success}</span>
        </div>}
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* General Settings */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center">
                <GlobeIcon size={20} className="mr-2 text-gray-500" />
                <h2 className="text-lg font-medium text-gray-800">
                  General Settings
                </h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                  Site Name
                </label>
                <input type="text" id="siteName" name="siteName" value={settings.siteName} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Site Description
                </label>
                <input type="text" id="siteDescription" name="siteDescription" value={settings.siteDescription} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="maintenanceMode" name="maintenanceMode" checked={settings.maintenanceMode} onChange={handleInputChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-700">
                  Enable Maintenance Mode
                </label>
              </div>
            </div>
          </div>
          {/* Notification Settings */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center">
                <BellIcon size={20} className="mr-2 text-gray-500" />
                <h2 className="text-lg font-medium text-gray-800">
                  Notification Settings
                </h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center">
                <input type="checkbox" id="emailNotifications" name="emailNotifications" checked={settings.emailNotifications} onChange={handleInputChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                  Enable Email Notifications
                </label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="quizAutoPublish" name="quizAutoPublish" checked={settings.quizAutoPublish} onChange={handleInputChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                <label htmlFor="quizAutoPublish" className="ml-2 block text-sm text-gray-700">
                  Auto-publish New Quizzes
                </label>
              </div>
            </div>
          </div>
          {/* System Settings */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center">
                <DatabaseIcon size={20} className="mr-2 text-gray-500" />
                <h2 className="text-lg font-medium text-gray-800">
                  System Settings
                </h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="dataRetentionDays" className="block text-sm font-medium text-gray-700 mb-1">
                  Data Retention (days)
                </label>
                <input type="number" id="dataRetentionDays" name="dataRetentionDays" value={settings.dataRetentionDays} onChange={handleInputChange} min="1" max="365" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label htmlFor="backupFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                  Backup Frequency
                </label>
                <select id="backupFrequency" name="backupFrequency" value={settings.backupFrequency} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label htmlFor="logLevel" className="block text-sm font-medium text-gray-700 mb-1">
                  Log Level
                </label>
                <select id="logLevel" name="logLevel" value={settings.logLevel} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="error">Error</option>
                  <option value="warn">Warning</option>
                  <option value="info">Info</option>
                  <option value="debug">Debug</option>
                </select>
              </div>
            </div>
          </div>
          {/* Security Settings */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center">
                <ShieldIcon size={20} className="mr-2 text-gray-500" />
                <h2 className="text-lg font-medium text-gray-800">
                  Security Settings
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100">
                <p className="text-yellow-700 text-sm">
                  Security settings are managed through the admin portal
                  settings. Please contact the system administrator for changes.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button type="submit" disabled={isSubmitting} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed">
            <SaveIcon size={16} className="mr-2" />
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>;
};
export default AdminSettings;