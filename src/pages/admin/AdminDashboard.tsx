import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logoutUser } from '../../store/slices/authSlice';
import logoTransparent from '../../assets/logo-tranparent.png';

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const stats = [
    { label: 'Total Users', value: '1,247', change: '+12%', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: '👥' },
    { label: 'Active Jobs', value: '89', change: '+5%', color: 'text-green-600', bgColor: 'bg-green-50', icon: '💼' },
    { label: 'Applications', value: '2,156', change: '+18%', color: 'text-purple-600', bgColor: 'bg-purple-50', icon: '📄' },
    { label: 'Companies', value: '156', change: '+3%', color: 'text-orange-600', bgColor: 'bg-orange-50', icon: '🏢' }
  ];

  const recentActivities = [
    { action: 'New user registration', user: 'John Doe', time: '2 minutes ago', type: 'user' },
    { action: 'Job application submitted', user: 'Sarah Wilson', time: '15 minutes ago', type: 'application' },
    { action: 'New job posted', user: 'Tech Corp', time: '1 hour ago', type: 'job' },
    { action: 'Company profile updated', user: 'StartupXYZ', time: '2 hours ago', type: 'company' },
    { action: 'User profile verified', user: 'Mike Johnson', time: '3 hours ago', type: 'verification' }
  ];

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: '📊', active: true },
    { id: 'users', label: 'User Management', icon: '👥', count: '1,247' },
    { id: 'companies', label: 'Companies', icon: '🏢', count: '156' },
    { id: 'jobs', label: 'Job Listings', icon: '💼', count: '89' },
    { id: 'applications', label: 'Applications', icon: '📄', count: '2,156' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'reports', label: 'Reports', icon: '📋' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-16'} bg-slate-800 transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <img src={logoTransparent} alt="SS HR" className="w-10 h-10 object-contain" />
            {isSidebarOpen && (
              <div>
                <h1 className="text-white font-bold text-lg">SS HR Admin</h1>
                <p className="text-slate-400 text-sm">Control Panel</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {isSidebarOpen && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.count && (
                    <span className="text-xs bg-slate-600 px-2 py-1 rounded-full">
                      {item.count}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {user?.fullName?.charAt(0) || 'A'}
              </span>
            </div>
            {isSidebarOpen && (
              <div className="flex-1">
                <p className="text-white font-medium">{user?.fullName || 'Admin'}</p>
                <p className="text-slate-400 text-sm">{user?.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-slate-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-white">
                {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h1>
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

        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                        <span className="text-xl">{stat.icon}</span>
                      </div>
                      <span className={`text-sm font-medium ${stat.color}`}>
                        {stat.change}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                    <p className="text-slate-400 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Charts and Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Analytics Chart */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Analytics Overview</h3>
                  <div className="h-64 bg-slate-700 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📈</div>
                      <p className="text-slate-400">Chart Placeholder</p>
                      <p className="text-slate-500 text-sm">Integrate with Chart.js or Recharts</p>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs">
                            {activity.type === 'user' && '👤'}
                            {activity.type === 'application' && '📄'}
                            {activity.type === 'job' && '💼'}
                            {activity.type === 'company' && '🏢'}
                            {activity.type === 'verification' && '✅'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-200 text-sm">
                            <span className="font-medium">{activity.user}</span> {activity.action}
                          </p>
                          <p className="text-slate-400 text-xs">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium">
                    View All Activity
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors group">
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">👥</div>
                    <p className="text-slate-200 text-sm font-medium">Add User</p>
                  </button>
                  <button className="p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors group">
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">💼</div>
                    <p className="text-slate-200 text-sm font-medium">Post Job</p>
                  </button>
                  <button className="p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors group">
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🏢</div>
                    <p className="text-slate-200 text-sm font-medium">Add Company</p>
                  </button>
                  <button className="p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors group">
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📊</div>
                    <p className="text-slate-200 text-sm font-medium">Generate Report</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Other Tab Contents */}
          {activeTab !== 'overview' && (
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
              <div className="text-6xl mb-4">
                {sidebarItems.find(item => item.id === activeTab)?.icon}
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {sidebarItems.find(item => item.id === activeTab)?.label}
              </h2>
              <p className="text-slate-400 mb-4">
                This section is under development. Coming soon with full functionality!
              </p>
              <button
                onClick={() => setActiveTab('overview')}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Back to Overview
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;