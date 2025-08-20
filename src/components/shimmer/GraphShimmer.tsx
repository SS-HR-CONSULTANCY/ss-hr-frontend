import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface DashboardStatsShimmerProps {
    count: number;
}

const GraphShimmer: React.FC<DashboardStatsShimmerProps> = ({
    count = 2
}) => {

    const ShimmerCount = Array.from({ length: count });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {ShimmerCount.map((_,index) => (
                <Card key={index} className='shimmer md:h-96 lg:h-[29rem]'>
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

export default GraphShimmer