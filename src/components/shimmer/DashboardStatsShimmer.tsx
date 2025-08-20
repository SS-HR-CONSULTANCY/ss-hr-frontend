import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface DashboardStatsShimmerProps {
    count: number;
}

const DashboardStatsShimmer: React.FC<DashboardStatsShimmerProps> = ({
    count = 4
}) => {

    const ShimmerCount = Array.from({ length: count });

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2">
            {ShimmerCount.map((_,index) => (
                <Card key={index} className='shimmer h-32'>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0'>
                        <CardTitle className='text-lg font-medium shimmer'></CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold shimmer'></div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default DashboardStatsShimmer