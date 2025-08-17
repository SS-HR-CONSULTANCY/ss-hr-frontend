import React from 'react';
import { useAppSelector } from '@/hooks/redux';
import { Link } from 'react-router-dom';

const Cta: React.FC = () => {

    const { isAuthenticated } = useAppSelector((state) => state.auth);

    return (
        <>
            {!isAuthenticated && (
                <section className="py-20 bg-blue-600">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Ready to Take the Next Step?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Join thousands of professionals who have found their dream jobs through our platform.
                        </p>
                        <Link
                            to="/register"
                            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Get Started Today
                        </Link>
                    </div>
                </section>
            )}
        </>
    )
}

export default Cta