import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '@/store/store';
import type { User } from '@/types/authSliceTypes';
import { logoutUser } from '@/store/slices/authSlice';
import { useSelector } from 'react-redux';
import { Moon, Sun } from 'lucide-react';
import { toggleTheme } from '@/store/slices/appSlice';

interface AdminHeaderProps {
    user: User | null;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
    user,
}) => {

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const theme = useSelector((state: RootState) => state.app.theme);

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            navigate('/admin/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };
    return (
        <header className="bg-gray-200 dark:bg-[#0d0d0d] p-3 rounded-lg text-balck dark:text-white border border-slate-400 dark:border-slate-700">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                </div>

                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <button className="relative text-slate-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            3
                        </span>
                    </button>

                    <div className="relative flex rounded-full cursor-pointer" onClick={() => dispatch(toggleTheme())}>
                        {theme === "dark" ? <Sun /> : <Moon />}
                    </div>

                    {/* User Menu */}
                    <div className="relative group">
                        <button className="flex items-center space-x-2 text-slate-300 hover:text-white">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-semibold">
                                    {user?.fullName?.charAt(0) || 'A'}
                                </span>
                            </div>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        <div className="absolute right-0 mt-2 w-48 bg-slate-700 rounded-lg shadow-lg border border-slate-600 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            <div className="p-3 border-b border-slate-600">
                                <p className="text-white font-medium">{user?.fullName}</p>
                                <p className="text-slate-400 text-sm">{user?.email}</p>
                            </div>
                            <div className="p-2">
                                <button className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-600 rounded">
                                    Profile Settings
                                </button>
                                <button className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-600 rounded">
                                    Admin Preferences
                                </button>
                                <hr className="my-2 border-slate-600" />
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-3 py-2 text-red-400 hover:text-red-300 hover:bg-slate-600 rounded"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default AdminHeader