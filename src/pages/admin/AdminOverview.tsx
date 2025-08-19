import React from 'react';
import AreaGroupedChart from '@/components/chart/AreaGroupedChart';
import BarChartVertical from '@/components/chart/BarChartVertical';
import { BriefcaseConveyorBelt, Building, CreditCard, DollarSign, LayoutGrid, Ticket, Users } from 'lucide-react';
import { formatNumberToPrice } from '@/utils/helpers/priceFormater';

const AdminOverview: React.FC = () => {

    const stats = [
        { label: 'Total Users', value: '1,247', change: '+12%', icon: <Users /> },
        { label: 'New Users', value: '1,247', change: '+12%', icon: <Users /> },
        { label: 'Total Packages', value: '4', icon: <Ticket /> },
        { label: 'Active Jobs', value: '89', change: '+5%', icon: <BriefcaseConveyorBelt /> },
        { label: 'Applications', value: '2,156', change: '+18%', icon: <LayoutGrid /> },
        { label: 'Companies', value: '156', change: '+3%', icon: <Building /> },
        { label: 'Payments', value: '400', change: '+3%', icon: <CreditCard />, },
        { label: 'Revenue', value: 4200754, change: '+3%', icon: <DollarSign />, price: true },
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

const analyticsData = [
  { date: "01-08-2025", package: 12, hiring: 8 },
  { date: "02-08-2025", package: 15, hiring: 11 },
  { date: "03-08-2025", package: 9, hiring: 5 },
  { date: "04-08-2025", package: 18, hiring: 14 },
  { date: "05-08-2025", package: 22, hiring: 17 },
  { date: "06-08-2025", package: 14, hiring: 9 },
  { date: "07-08-2025", package: 19, hiring: 13 },
  { date: "08-08-2025", package: 25, hiring: 20 },
  { date: "09-08-2025", package: 11, hiring: 7 },
  { date: "10-08-2025", package: 16, hiring: 12 },
];

const paymentChartConfig = {
  package: {
    label: "Package",
    color: "#ffd93e",
  },
  hiring: {
    label: "Hiring",
    color: "#01487e",
  },
};



    return (
        <div className="space-y-6 text-black dark:text-white mt-4">

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="shadow-md rounded-xl p-6 bg-white dark:bg-[#171717]">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`rounded-lg flex items-center justify-center`}>
                                <span className="text-xl">{stat.icon}</span>
                            </div>
                            <span className={`text-sm font-medium`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{
                            stat.price ? formatNumberToPrice(stat.value) : stat.value
                        }</h3>
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
                    dataKeyOne="package"
                    dataKeyTwo="hiring"
                    chartConfig={paymentChartConfig}
                />

            </div>


        </div>
    )
}

export default AdminOverview;