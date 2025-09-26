import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Database, Map, Fish, Dna, BookOpen, Bot } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: null },
    { path: '/datasets', label: 'Datasets', icon: Database },
    { path: '/visualization', label: 'Visualization', icon: Map },
    { path: '/otolith', label: 'Otolith Analysis', icon: Fish },
    { path: '/taxonomy', label: 'Taxonomy', icon: Search },
    { path: '/edna', label: 'eDNA', icon: Dna },
    { path: '/api', label: 'API Docs', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#30345E] rounded-lg flex items-center justify-center">
              <Fish className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-[#30345E]">Shark</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 text-sm font-medium transition-all duration-200 hover:text-[#30345E] ${
                  location.pathname === path
                    ? 'text-[#30345E] border-b-2 border-[#30345E] pb-1'
                    : 'text-gray-600 hover:border-b-2 hover:border-[#30345E] hover:pb-1'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          <Link to="/ai" className="bg-[#30345E] text-white px-6 py-2 rounded-md font-medium hover:scale-105 hover:shadow-md transition-all duration-200 flex items-center space-x-2">
            <Bot className="w-4 h-4" />
            <span>AI Assistant</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;