import React from 'react';
import { HelpCircleIcon, BookOpenIcon, MailIcon, PhoneIcon, MessageSquareIcon, ExternalLinkIcon, FileTextIcon, PlayIcon, SearchIcon } from 'lucide-react';
const AdminHelp = () => {
  const faqs = [{
    question: 'How do I create a new quiz?',
    answer: 'Navigate to the Quizzes section in the sidebar, then click "Create Quiz" button. Fill in the quiz details and questions, then click Save.'
  }, {
    question: 'How do I add a new user?',
    answer: 'Go to the Users section, click "Add User", fill in the user details and assign a role. The user will receive an email with login instructions.'
  }, {
    question: 'How do I edit animal information?',
    answer: 'In the Animals section, find the animal you want to edit and click the edit icon. Make your changes and save the form.'
  }, {
    question: 'How do I award badges to users?',
    answer: 'Badges are automatically awarded when users complete certain achievements. You can also manually award badges from the user profile page.'
  }, {
    question: 'Can I customize the student dashboard?',
    answer: 'Yes, you can customize the dashboard widgets and content from the Settings page under the "Dashboard Settings" section.'
  }];
  return <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Help & Support</h1>
      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <SearchIcon size={20} className="mr-2 text-indigo-500" />
            Search Help Topics
          </h2>
          <div className="relative">
            <input type="search" placeholder="Search for help topics..." className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon size={18} className="text-gray-400" />
            </div>
            <button className="absolute inset-y-0 right-0 pr-3 flex items-center text-indigo-600 hover:text-indigo-800">
              Search
            </button>
          </div>
        </div>
      </div>
      {/* Quick Help Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <BookOpenIcon size={24} className="text-blue-600" />
            </div>
            <h2 className="ml-3 text-lg font-medium text-gray-800">
              Documentation
            </h2>
          </div>
          <p className="text-gray-600 mb-4">
            Browse our comprehensive documentation for detailed guides and
            tutorials.
          </p>
          <a href="#" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
            View Documentation
            <ExternalLinkIcon size={16} className="ml-1" />
          </a>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <PlayIcon size={24} className="text-green-600" />
            </div>
            <h2 className="ml-3 text-lg font-medium text-gray-800">
              Video Tutorials
            </h2>
          </div>
          <p className="text-gray-600 mb-4">
            Watch step-by-step video tutorials to learn how to use the admin
            dashboard.
          </p>
          <a href="#" className="text-green-600 hover:text-green-800 font-medium flex items-center">
            Watch Tutorials
            <ExternalLinkIcon size={16} className="ml-1" />
          </a>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <FileTextIcon size={24} className="text-purple-600" />
            </div>
            <h2 className="ml-3 text-lg font-medium text-gray-800">
              User Guides
            </h2>
          </div>
          <p className="text-gray-600 mb-4">
            Download printable PDF guides for different administrative tasks.
          </p>
          <a href="#" className="text-purple-600 hover:text-purple-800 font-medium flex items-center">
            Download Guides
            <ExternalLinkIcon size={16} className="ml-1" />
          </a>
        </div>
      </div>
      {/* FAQs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <HelpCircleIcon size={20} className="mr-2 text-gray-500" />
            <h2 className="text-lg font-medium text-gray-800">
              Frequently Asked Questions
            </h2>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {faqs.map((faq, index) => <div key={index} className="border-b border-gray-200 pb-5 last:border-0 last:pb-0">
                <h3 className="text-md font-medium text-gray-800 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </div>)}
          </div>
        </div>
      </div>
      {/* Contact Support */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          Contact Support
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex items-center mb-3">
              <MailIcon size={20} className="text-indigo-600 mr-2" />
              <h3 className="font-medium text-gray-800">Email Support</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Send us an email and we'll respond within 24 hours.
            </p>
            <a href="mailto:support@wildlifeguardians.com" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              support@wildlifeguardians.com
            </a>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex items-center mb-3">
              <PhoneIcon size={20} className="text-indigo-600 mr-2" />
              <h3 className="font-medium text-gray-800">Phone Support</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Call us Monday-Friday, 9am-5pm UTC.
            </p>
            <a href="tel:+1234567890" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              +1 (234) 567-890
            </a>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex items-center mb-3">
              <MessageSquareIcon size={20} className="text-indigo-600 mr-2" />
              <h3 className="font-medium text-gray-800">Live Chat</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Chat with our support team in real-time.
            </p>
            <button className="text-white bg-indigo-600 hover:bg-indigo-700 text-sm font-medium px-3 py-1 rounded-md transition-colors">
              Start Chat
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default AdminHelp;