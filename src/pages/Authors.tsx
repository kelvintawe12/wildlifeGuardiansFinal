import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, GithubIcon, LinkedinIcon, TwitterIcon, GlobeIcon } from 'lucide-react';
const Authors = () => {
  const authors = [{
    name: 'John Doe',
    role: 'Lead Developer',
    bio: 'John is a full-stack developer with over 8 years of experience building educational platforms. He specializes in React and has a passion for wildlife conservation.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      website: 'https://example.com'
    }
  }, {
    name: 'Jane Smith',
    role: 'UI/UX Designer',
    bio: 'Jane is a designer who focuses on creating intuitive and engaging user experiences. She has worked on multiple educational applications and is dedicated to making learning accessible.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      website: 'https://example.com'
    }
  }, {
    name: 'Alex Johnson',
    role: 'Content Specialist',
    bio: 'Alex has a background in environmental science and wildlife conservation. They create educational content that is both accurate and engaging for students of all ages.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      website: 'https://example.com'
    }
  }];
  return <div className="space-y-8 pb-10">
      <div className="flex items-center">
        <Link to="/dashboard" className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Back to Dashboard">
          <ArrowLeftIcon size={20} />
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Meet the Team
        </h1>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <p className="text-lg text-gray-600 mb-4">
          Wildlife Guardians was created by a team of developers, designers, and
          educators passionate about wildlife conservation and interactive
          learning.
        </p>
        <p className="text-gray-600">
          Our mission is to educate the next generation about endangered species
          in Rwanda and inspire them to take action for conservation efforts
          worldwide.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {authors.map((author, index) => <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="h-48 overflow-hidden">
              <img src={author.image} alt={author.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800">{author.name}</h2>
              <p className="text-blue-600 font-medium text-sm mb-3">
                {author.role}
              </p>
              <p className="text-gray-600 text-sm mb-4">{author.bio}</p>
              <div className="flex space-x-3">
                <a href={author.social.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-800 transition-colors">
                  <GithubIcon size={18} />
                </a>
                <a href={author.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <LinkedinIcon size={18} />
                </a>
                <a href={author.social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400 transition-colors">
                  <TwitterIcon size={18} />
                </a>
                <a href={author.social.website} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-600 transition-colors">
                  <GlobeIcon size={18} />
                </a>
              </div>
            </div>
          </div>)}
      </div>
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
        <h2 className="text-xl font-bold text-gray-800 mb-3">
          Want to Contribute?
        </h2>
        <p className="text-gray-600 mb-4">
          We're always looking for passionate individuals to join our team and
          help improve Wildlife Guardians. Whether you're a developer, designer,
          educator, or conservationist, we'd love to hear from you!
        </p>
        <a href="mailto:contact@wildlifeguardians.org" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Get in Touch
        </a>
      </div>
    </div>;
};
export default Authors;