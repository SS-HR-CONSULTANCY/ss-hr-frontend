import React from 'react';
import { shimmerMessages } from '@/utils/constants';

interface NoChatSelectedSShimmerProps {
    className: string;
}

const NoChatSelectedSShimmer: React.FC<NoChatSelectedSShimmerProps> = ({
    className
}) => {
    
    return (
        <div className={`flex-1 overflow-y-auto p-4 no-scrollbar ${className}`}>
            <div className="flex flex-col space-y-1">
                {shimmerMessages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex justify-${msg.align}`}
                    >
                        <div
                            className={`rounded-lg p-2 max-w-xs ${msg.height} ${msg.width} shimmer`}
                        ></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default NoChatSelectedSShimmer