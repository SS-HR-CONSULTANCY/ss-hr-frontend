import React from 'react';
import RadialChart from '@/components/chart/RadialChart';

const AdminReports: React.FC = () => {
        const topBookingDaysChartConfig = {
        Monday: {
            label: "Monday",
            color: "#6366F1",
        },
        Tuesday: {
            label: "Tuesday",
            color: "#10B981",
        },
        Wednesday: {
            label: "Wednesday",
            color: "#F59E0B",
        },
        Thursday: {
            label: "Thursday",
            color: "#EF4444",
        },
        Friday: {
            label: "Friday",
            color: "#3B82F6",
        },
        Saturday: {
            label: "Saturday",
            color: "#8B5CF6",
        },
        Sunday: {
            label: "Sunday",
            color: "#EC4899",
        },
    };
      const weeklyData = [
        { day: "Monday", count: 52 },
        { day: "Tuesday", count: 61 },
        { day: "Wednesday", count: 47 },
        { day: "Thursday", count: 66 },
        { day: "Friday", count: 59 },
        { day: "Saturday", count: 73 },
        { day: "Sunday", count: 64 },
    ];
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RadialChart
                title="Top Package Booking Days"
                description="Distribution of bookings throughout the week"
                chartData={weeklyData}
                dataKeyOne="count"
                dataKeyTwo="day"
                chartConfig={topBookingDaysChartConfig}
            />
        </div>
    )
}

export default AdminReports