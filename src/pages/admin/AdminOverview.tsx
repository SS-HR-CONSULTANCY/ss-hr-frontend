import React from 'react';
import AreaGroupedChart from '@/components/chart/AreaGroupedChart';
import BarChartVertical from '@/components/chart/BarChartVertical';
import { BriefcaseConveyorBelt, Building, Building2, LayoutGrid, ShieldCheck, Ticket, User, Users } from 'lucide-react';

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

    const usersTimeChartConfig = {
        newUsers: {
            label: "New Users",
            color: "#ffd93e",
        },
        oldUsers: {
            label: "Old Users",
            color: "#01487e",
        },
    }

    const usersData = [
        { date: "01-08-2025", newUsers: 12, oldUsers: 40 },
        { date: "02-08-2025", newUsers: 15, oldUsers: 42 },
        { date: "03-08-2025", newUsers: 9, oldUsers: 38 },
        { date: "04-08-2025", newUsers: 14, oldUsers: 41 },
        { date: "05-08-2025", newUsers: 18, oldUsers: 44 },
        { date: "06-08-2025", newUsers: 20, oldUsers: 46 },
        { date: "07-08-2025", newUsers: 11, oldUsers: 39 },
        { date: "08-08-2025", newUsers: 17, oldUsers: 45 },
        { date: "09-08-2025", newUsers: 13, oldUsers: 40 },
        { date: "10-08-2025", newUsers: 22, oldUsers: 48 },
        { date: "11-08-2025", newUsers: 10, oldUsers: 37 },
        { date: "12-08-2025", newUsers: 19, oldUsers: 43 },
        { date: "13-08-2025", newUsers: 15, oldUsers: 42 },
        { date: "14-08-2025", newUsers: 21, oldUsers: 47 },
        { date: "15-08-2025", newUsers: 16, oldUsers: 41 },
        { date: "16-08-2025", newUsers: 23, oldUsers: 49 },
        { date: "17-08-2025", newUsers: 12, oldUsers: 39 },
        { date: "18-08-2025", newUsers: 14, oldUsers: 42 },
        { date: "19-08-2025", newUsers: 20, oldUsers: 45 },
    ];

    const paymentChartConfig = {
  online: {
    label: "Package",
    color: "#3b82f6",
  },
  offline: {
    label: "Hiring",
    color: "#10b981",
  },
};

const analyticsData = [
  { date: "01-08-2025", Package: 12, Hiring: 8 },
  { date: "02-08-2025", Package: 15, Hiring: 11 },
  { date: "03-08-2025", Package: 9,  Hiring: 5 },
  { date: "04-08-2025", Package: 18, Hiring: 14 },
  { date: "05-08-2025", Package: 22, Hiring: 17 },
  { date: "06-08-2025", Package: 14, Hiring: 9 },
  { date: "07-08-2025", Package: 19, Hiring: 13 },
  { date: "08-08-2025", Package: 25, Hiring: 20 },
  { date: "09-08-2025", Package: 11, Hiring: 7 },
  { date: "10-08-2025", Package: 16, Hiring: 12 },
];



    return (
        <div className="space-y-6 text-black dark:text-white mt-4">

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="shadow-md rounded-xl p-6 bg-white dark:bg-[#171717]">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <AreaGroupedChart
                    title="Users data graph"
                    description="New and old users comparison"
                    chartData={usersData}
                    dataKeyOne="newUsers"
                    dataKeyTwo="oldUsers"
                    chartConfig={usersTimeChartConfig}
                />

                   <BarChartVertical
                        title="Payment Chart"
                        description="Package and Hiring Payment"
                        chartData={analyticsData}
                        dataKeyOne="Package"
                        dataKeyTwo="Hiring"
                        chartConfig={paymentChartConfig}
                    />

                {/* Recent Activity */}
                <div className="bg-white dark:bg-[#171717] rounded-xl p-6 border border-slate-400 dark:border-slate-700">
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

           
        </div>
    )
}

export default AdminOverview;