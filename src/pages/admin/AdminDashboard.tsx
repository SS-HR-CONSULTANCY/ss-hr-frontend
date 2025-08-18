import React, { useState } from 'react';
import Sidebar from '@/components/navigations/Sidebar';
import AdminHeader from '@/components/navigations/AdminHeader';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  FileText,
  BarChart3,
  FileChartColumn,
  Settings
} from "lucide-react";


export interface sidebarItems {
    id: string;
    label: string;
    icon: LucideIcon;
    active?: boolean;
    count?: string;
  }

const AdminDashboard: React.FC = () => {

  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('overview');



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

const sidebarItems: sidebarItems[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, active: true },
  { id: "users", label: "User Management", icon: Users, count: "1,247" },
  { id: "companies", label: "Companies", icon: Building2, count: "156" },
  { id: "jobs", label: "Job Listings", icon: Briefcase, count: "89" },
  { id: "applications", label: "Applications", icon: FileText, count: "2,156" },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "reports", label: "Reports", icon: FileChartColumn },
  { id: "settings", label: "Settings", icon: Settings }
];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-balck dark:text-white flex">
      {/* Sidebar */}
      <Sidebar user={user} sidebarItems={sidebarItems} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-2">
        {/* Header */}
      <AdminHeader user={user} />

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