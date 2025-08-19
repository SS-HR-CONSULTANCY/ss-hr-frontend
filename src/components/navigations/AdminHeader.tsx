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

                    <div className="relative flex rounded-full cursor-pointer" onClick={() => dispatch(toggleTheme())}>
                        {theme === "dark" ? <Sun /> : <Moon />}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default AdminHeader