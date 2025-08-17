import { useAppSelector } from '@/hooks/redux';
import React from 'react'
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {

      const { isAuthenticated } = useAppSelector((state) => state.auth);
    
  return (
    <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 font-['Prata']">
              Your Gateway to Career Success
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto font-['Open_Sans']">
              Connect with top employers and discover opportunities that match your skills. 
              We're here to bridge the gap between talent and opportunity.
            </p>
            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register" 
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition-colors"
                >
                  Find Jobs
                </Link>
                <Link 
                  to="/register" 
                  className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg hover:bg-blue-50 transition-colors"
                >
                  Post Jobs
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/jobs" 
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Jobs
                </Link>
                <Link 
                  to="/dashboard" 
                  className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg hover:bg-blue-50 transition-colors"
                >
                  My Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
  )
}

export default Hero