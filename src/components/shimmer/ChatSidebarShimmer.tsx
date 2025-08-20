import React from 'react';

const ChatSidebarShimmer: React.FC = () => {
    return (
        <div className="p-2">
            {[...Array(9)].map((_, index) => (
                <div key={index} className="flex items-center space-x-4 h-20 w-full mb-2 animate-pulse">
                    <div className="w-12 h-12 shimmer rounded-full"></div>
                    <div className="flex-1 space-y-2">
                        <div className="w-3/4 h-4 shimmer rounded"></div>
                        <div className="w-1/2 h-3 shimmer rounded"></div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ChatSidebarShimmer;