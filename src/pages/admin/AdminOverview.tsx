import React from 'react';
import { BriefcaseConveyorBelt, Building, Building2, ClipboardPlus, LayoutGrid, ShieldCheck, Ticket, User, Users } from 'lucide-react';

const AdminOverview: React.FC = () => {

    const stats = [
        { label: 'Total Users', value: '1,247', change: '+12%', icon: <Users /> },
        { label: 'Total Packages', value: '4', icon: <Ticket /> },
        { label: 'Active Jobs', value: '89', change: '+5%', icon: <BriefcaseConveyorBelt /> },
        { label: 'Applications', value: '2,156', change: '+18%', icon: <LayoutGrid /> },
        { label: 'Companies', value: '156', change: '+3%', icon: <Building /> }
    ];

    const recentActivities = [
        { action: 'New user registration', user: 'John Doe', time: '2 minutes ago', type: 'user' },
        { action: 'Job application submitted', user: 'Sarah Wilson', time: '15 minutes ago', type: 'application' },
        { action: 'New job posted', user: 'Tech Corp', time: '1 hour ago', type: 'job' },
        { action: 'Company profile updated', user: 'StartupXYZ', time: '2 hours ago', type: 'company' },
        { action: 'User profile verified', user: 'Mike Johnson', time: '3 hours ago', type: 'verification' }
    ];

    return (
        <div className="space-y-6 text-black dark:text-white mt-4">

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-gray-200 dark:bg-[#0d0d0d] rounded-xl p-6 border border-slate-400 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center`}>
                                <span className="text-xl">{stat.icon}</span>
                            </div>
                            <span className={`text-sm font-medium`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                        <p className="ext-sm">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Charts and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Analytics Chart */}
                <div className="bg-gray-200 dark:bg-[#0d0d0d] rounded-xl p-6 border border-slate-400 dark:border-slate-700">
                    <h3 className="text-lg font-semibold mb-4">Analytics Overview</h3>
                    <div className="h-64 bg-gray-300 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-4xl mb-2">📈</div>
                            <p className="">Chart Placeholder</p>
                            <p className="text-sm">Integrate with Chart.js or Recharts</p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-200 dark:bg-[#0d0d0d] rounded-xl p-6 border border-slate-400 dark:border-slate-700">
                    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {recentActivities.map((activity, index) => (
                            <div key={index} className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-slate-300 dark:bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs">
                                        {activity.type === 'user' && <User />}
                                        {activity.type === 'application' && <LayoutGrid />}
                                        {activity.type === 'job' && <BriefcaseConveyorBelt />}
                                        {activity.type === 'company' && <Building2 />}
                                        {activity.type === 'verification' && <ShieldCheck />}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm">
                                        <span className="font-medium">{activity.user}</span> {activity.action}
                                    </p>
                                    <p className="text-xs">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 text-blue-400 hover:text-blue-500 text-sm font-medium cursor-pointer">
                        View All Activity
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-200 dark:bg-[#0d0d0d] rounded-xl p-6 border border-slate-400 dark:border-slate-700">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    
                    <button className="p-4 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 rounded-lg transition-colors group cursor-pointer">
                        <div className="text-2xl mb-2 group-hover:scale-110 transition-transform"><BriefcaseConveyorBelt /> </div>
                        <p className="text-sm font-medium">Post Job</p>
                    </button>
                    <button className="p-4 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 rounded-lg transition-colors group cursor-pointer">
                        <div className="text-2xl mb-2 group-hover:scale-110 transition-transform"><Building2 /></div>
                        <p className="text-sm font-medium">Add Company</p>
                    </button>
                    <button className="p-4 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 rounded-lg transition-colors group cursor-pointer">
                        <div className="text-2xl mb-2 group-hover:scale-110 transition-transform"><ClipboardPlus /></div>
                        <p className="text-sm font-medium">Generate Report</p>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AdminOverview;