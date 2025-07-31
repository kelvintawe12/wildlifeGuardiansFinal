import React, { useEffect, useState, useRef } from 'react';
import { MessageCircleIcon, SendIcon, XIcon, MinimizeIcon, MaximizeIcon, BotIcon, UserIcon, ImageIcon, RefreshCwIcon } from 'lucide-react';
interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}
const predefinedResponses = {
  greeting: ["Hi there! I'm your Wildlife Guardians assistant. How can I help you today?", "Hello! I'm here to help with your wildlife learning journey. What would you like to know?"],
  quiz: ['Our quizzes test your knowledge about endangered species and conservation efforts. You can earn badges by completing them!', 'Each quiz has 5 questions about a specific animal or conservation topic. Try to get a perfect score!'],
  animals: ['We have information on many endangered species, including mountain gorillas, black rhinos, and African elephants.', 'You can learn about animal habitats, threats they face, and conservation efforts to protect them.'],
  badges: ['Badges are awarded for completing quizzes, achieving high scores, and consistent learning.', "Check your profile to see all the badges you've earned and those you can still unlock!"],
  offline: ['You can still access previously viewed content while offline. Your progress will sync when you reconnect.', 'Our offline mode allows you to continue learning even without an internet connection.'],
  default: ["I'm not sure I understand. Could you rephrase your question?", "I don't have information about that yet. Would you like to know about our quizzes, animals, or badges instead?"]
};
const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    sender: 'bot',
    text: "👋 Hi! I'm your Wildlife Guardians assistant. How can I help with your learning today?",
    timestamp: new Date()
  }]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messagesEndRef.current && isOpen && !isMinimized) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, [messages, isOpen, isMinimized]);
  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    // Simulate bot typing
    setIsTyping(true);
    setTimeout(() => {
      generateResponse(inputText);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };
  const generateResponse = (query: string) => {
    const normalizedQuery = query.toLowerCase();
    let responseCategory = 'default';
    if (normalizedQuery.includes('hi') || normalizedQuery.includes('hello') || normalizedQuery.includes('hey')) {
      responseCategory = 'greeting';
    } else if (normalizedQuery.includes('quiz') || normalizedQuery.includes('test') || normalizedQuery.includes('question')) {
      responseCategory = 'quiz';
    } else if (normalizedQuery.includes('animal') || normalizedQuery.includes('species') || normalizedQuery.includes('wildlife')) {
      responseCategory = 'animals';
    } else if (normalizedQuery.includes('badge') || normalizedQuery.includes('award') || normalizedQuery.includes('achievement')) {
      responseCategory = 'badges';
    } else if (normalizedQuery.includes('offline') || normalizedQuery.includes('connection') || normalizedQuery.includes('internet')) {
      responseCategory = 'offline';
    }
    const responses = predefinedResponses[responseCategory as keyof typeof predefinedResponses];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const botMessage: Message = {
      id: Date.now().toString(),
      sender: 'bot',
      text: randomResponse,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMessage]);
  };
  return <>
      {/* Chat toggle button */}
      <button onClick={toggleChat} className="fixed bottom-4 right-4 bg-green-600 hover:bg-green-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all z-40" aria-label="Open chat assistant">
        {isOpen ? <XIcon size={24} /> : <MessageCircleIcon size={24} />}
      </button>
      {/* Chat window */}
      {isOpen && <div className={`fixed bottom-20 right-4 w-80 sm:w-96 bg-white rounded-lg shadow-xl z-40 transition-all overflow-hidden ${isMinimized ? 'h-14' : 'h-[32rem] max-h-[calc(100vh-120px)]'}`}>
          {/* Chat header */}
          <div className="bg-green-600 text-white p-3 flex items-center justify-between">
            <div className="flex items-center">
              <BotIcon size={20} className="mr-2" />
              <h3 className="font-medium">Wildlife Assistant</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={toggleMinimize} className="hover:bg-green-700 rounded p-1" aria-label={isMinimized ? 'Maximize chat' : 'Minimize chat'}>
                {isMinimized ? <MaximizeIcon size={16} /> : <MinimizeIcon size={16} />}
              </button>
              <button onClick={toggleChat} className="hover:bg-green-700 rounded p-1" aria-label="Close chat">
                <XIcon size={16} />
              </button>
            </div>
          </div>
          {!isMinimized && <>
              {/* Messages container */}
              <div className="p-4 h-[calc(100%-120px)] overflow-y-auto bg-gray-50">
                {messages.map(message => <div key={message.id} className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === 'user' ? 'bg-blue-100 ml-2' : 'bg-green-100 mr-2'}`}>
                        {message.sender === 'user' ? <UserIcon size={16} className="text-blue-600" /> : <BotIcon size={16} className="text-green-600" />}
                      </div>
                      <div className={`py-2 px-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200'}`}>
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                        </p>
                      </div>
                    </div>
                  </div>)}
                {isTyping && <div className="flex justify-start mb-4">
                    <div className="flex items-start max-w-[80%]">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                        <BotIcon size={16} className="text-green-600" />
                      </div>
                      <div className="py-3 px-4 rounded-lg bg-white border border-gray-200">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{
                    animationDelay: '0ms'
                  }}></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{
                    animationDelay: '150ms'
                  }}></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{
                    animationDelay: '300ms'
                  }}></div>
                        </div>
                      </div>
                    </div>
                  </div>}
                <div ref={messagesEndRef} />
              </div>
              {/* Input area */}
              <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 bg-white">
                <div className="flex items-center">
                  <input type="text" value={inputText} onChange={handleInputChange} placeholder="Ask me anything..." className="flex-1 border border-gray-300 rounded-l-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                  <button type="submit" className="bg-green-600 hover:bg-green-700 text-white rounded-r-lg px-4 py-2 transition-colors" disabled={!inputText.trim()}>
                    <SendIcon size={18} />
                  </button>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <button type="button" className="flex items-center hover:text-gray-700">
                    <ImageIcon size={14} className="mr-1" />
                    Upload image
                  </button>
                  <button type="button" className="flex items-center hover:text-gray-700">
                    <RefreshCwIcon size={14} className="mr-1" />
                    Reset chat
                  </button>
                </div>
              </form>
            </>}
        </div>}
    </>;
};
export default ChatBot;