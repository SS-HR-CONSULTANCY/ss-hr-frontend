import React from 'react';
import useAuthHook from '@/hooks/useAuthHook';
import { HomeIcon, LogOut, Moon, Sun } from 'lucide-react';
import { toggleTheme } from '@/store/slices/appSlice';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import noProfile from '../../assets/defaultImgaes/noProfile.png';
import type { DashboardHeaderProps } from '@/types/componentTypes/adminHeaderTypes';
import { useNavigate } from 'react-router-dom';

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    user
}) => {

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const theme = useSelector((state: RootState) => state.app.theme);
    const { handleLogout } = useAuthHook({
            route: user?.role === "admin" ? "/admin/login" : user?.role === "user" ? "/login" : '/superAdmin/login'
    });

  return (
     <header className="bg-gradient-to-r from-slate-50 to-sky-50 dark:from-slate-900 dark:to-slate-700 p-3 border border-slate-400 dark:border-slate-700">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <img src={user?.profileImg || noProfile} className='rounded-full size-6' />
                    <h5>Hi, {user?.fullName || user?.role}</h5>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="relative flex rounded-full cursor-pointer" onClick={() => navigate('/')}>
                        <HomeIcon />
                    </button>
                    <button className="relative flex rounded-full cursor-pointer" onClick={() => dispatch(toggleTheme())}>
                        {theme === "dark" ? <Sun /> : <Moon />}
                    </button>
                    <button className="relative flex rounded-full cursor-pointer" onClick={handleLogout}>
                        <LogOut />
                    </button>
                </div>
            </div>
        </header>
  )
}

export default DashboardHeader