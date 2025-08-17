import { useAppSelector } from '@/hooks/redux';
import React from 'react';
import { Link } from 'react-router-dom';
import UserDropdown from '../common/UserDropdown';

const Header: React.FC = () => {

      const { isAuthenticated } = useAppSelector((state) => state.auth);
    

  return (
     <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600 font-['Prata']">
                SS HR Consultancy
              </h1>
            </div>
            <nav className="flex items-center space-x-6">
              <Link to="#services" className="text-gray-600 hover:text-blue-600 transition-colors">
                Services
              </Link>
              <Link to="#about" className="text-gray-600 hover:text-blue-600 transition-colors">
                About
              </Link>
              <Link to="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                Contact
              </Link>
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/dashboard" 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <UserDropdown />
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/login" 
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>
  )
}

export default Header