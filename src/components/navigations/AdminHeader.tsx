import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import type { User } from '@/types/authSliceTypes';
import { toggleTheme } from '@/store/slices/appSlice';
import type { AppDispatch, RootState } from '@/store/store';
import noProfile from '../../assets/defaultImgaes/noProfile.png';

interface AdminHeaderProps {
    user: User | null;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
    user,
}) => {

    const dispatch = useDispatch<AppDispatch>();
    const theme = useSelector((state: RootState) => state.app.theme);

    return (
        <header className="bg-gray-200 dark:bg-[#0d0d0d] p-3 rounded-lg text-balck dark:text-white border border-slate-400 dark:border-slate-700">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <img src={user?.profileImg || noProfile} className='rounded-full size-6' />
                    <h5>Hi, {user?.fullName || "Admin"}</h5>
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
                </div>
            </div>
        </header>
    )
}

export default AdminHeader