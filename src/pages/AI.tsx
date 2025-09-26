import React, { useState } from 'react';
import { MessageCircle, Send, Bot, User, Zap, Database, Fish, Dna, Map, BarChart3 } from 'lucide-react';
import { aiService, type ChatMessage } from '../services/aiService';

const AI = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m Shark AI, your marine data assistant. I can help you analyze oceanographic data, identify species, interpret eDNA results, and provide insights about marine ecosystems. What would you like to explore today?',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quickActions = [
    { icon: Database, label: 'Find Datasets', query: 'Show me available marine datasets' },
    { icon: Fish, label: 'Identify Species', query: 'Help me identify a marine species' },
    { icon: Dna, label: 'Analyze eDNA', query: 'Explain eDNA analysis results' },
    { icon: Map, label: 'Ocean Mapping', query: 'Show me ocean temperature patterns' },
    { icon: BarChart3, label: 'Data Insights', query: 'Generate insights from fisheries data' }
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    setError(null);
    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Convert messages to the format expected by the AI service
      const chatHistory: ChatMessage[] = messages
        .filter(msg => msg.type !== 'bot' || msg.id !== 1) // Exclude initial greeting
        .map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }));
      
      // Add the new user message
      chatHistory.push({
        role: 'user',
        content: inputMessage
      });

      const response = await aiService.sendMessage(chatHistory);
      
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: response,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (err) {
      console.error('Error getting AI response:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while processing your request.';
      setError(errorMessage);
      
      const errorResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: `I apologize, but I encountered an error: ${errorMessage}. Please try again or contact support if the issue persists.`,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (query) => {
    setInputMessage(query);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="py-12 px-6 min-h-screen bg-[#F8F9FB]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-[#30345E] mb-4">Shark AI Assistant</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your intelligent companion for marine data analysis and ocean insights
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Chat Header */}
          <div className="bg-[#30345E] text-white p-4 flex items-center space-x-3">
            <Bot className="w-6 h-6" />
            <div>
              <h2 className="font-semibold">Shark AI</h2>
              <p className="text-sm opacity-90">Marine Data Specialist</p>
            </div>
            <div className="ml-auto flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm">Online</span>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' ? 'bg-[#3C7EDB]' : 'bg-[#30345E]'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-[#3C7EDB] text-white'
                    : 'bg-[#F8F9FB] text-gray-800'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#30345E] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-[#F8F9FB] px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="border-t border-gray-100 p-4">
            <p className="text-sm text-gray-600 mb-3">Quick Actions:</p>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.query)}
                  className="flex items-center space-x-2 px-3 py-2 bg-[#F8F9FB] hover:bg-[#30345E] hover:text-white rounded-lg transition-all duration-200 text-sm"
                >
                  <action.icon className="w-4 h-4" />
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-100 p-4">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-red-700 text-sm">
                  <strong>Error:</strong> {error}
                </p>
                {error.includes('API key') && (
                  <p className="text-red-600 text-xs mt-1">
                    Please configure your NVIDIA API key in the environment variables.
                  </p>
                )}
              </div>
            )}
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about marine data, species identification, or ocean insights..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#30345E] focus:ring-2 focus:ring-[#30345E]/10 resize-none"
                  rows="2"
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-[#30345E] text-white p-3 rounded-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Powered by NVIDIA Llama-3.1-Nemotron-70B-Instruct
            </p>
          </div>
        </div>

        {/* AI Capabilities */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
            <Zap className="w-10 h-10 text-[#3C7EDB] mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-[#30345E] mb-2">Smart Analysis</h3>
            <p className="text-gray-600 text-sm">AI-powered insights from complex marine datasets</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
            <MessageCircle className="w-10 h-10 text-[#3C7EDB] mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-[#30345E] mb-2">Natural Language</h3>
            <p className="text-gray-600 text-sm">Ask questions in plain English about ocean data</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
            <Database className="w-10 h-10 text-[#3C7EDB] mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-[#30345E] mb-2">Data Integration</h3>
            <p className="text-gray-600 text-sm">Seamless access to all platform datasets</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AI;