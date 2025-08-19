import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { toggleTheme } from '@/store/slices/appSlice';
import type { AppDispatch, RootState } from '@/store/store';
import noProfile from '../../assets/defaultImgaes/noProfile.png';
import type { AdminHeaderProps } from '@/types/componentTypes/AdminHeaderTypes';

const AdminHeader: React.FC<AdminHeaderProps> = ({
    user,
}) => {

    const dispatch = useDispatch<AppDispatch>();
    const theme = useSelector((state: RootState) => state.app.theme);

    return (
        <header className="bg-gradient-to-r from-slate-900 to-slate-700 p-3 rounded-lg text-white border border-slate-400 dark:border-slate-700">
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