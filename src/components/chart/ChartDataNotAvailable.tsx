import React from 'react';
import { AlertCircle } from 'lucide-react';

const ChartDataNotAvailable: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
            <AlertCircle className="w-8 h-8 mb-3 text-gray-400" />
            <h2 className="text-lg font-semibold">No Data Available</h2>
            <p className="text-sm max-w-xs">
                We couldn’t find any data to display. Once your account is active with operations, this chart will update.
            </p>
        </div>
    )
}

export default ChartDataNotAvailable