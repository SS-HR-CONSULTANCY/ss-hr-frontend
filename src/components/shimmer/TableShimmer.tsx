import type { TableShimmerProps } from "@/types/componentTypes/shimmerTypes";

const TableShimmer: React.FC<TableShimmerProps> = ({
    columnsCount
}) => {
    
    return (
        <>
        <div className="flex flex-col rounded-md overflow-hidden">
            <div className="h-15 flex items-center justify-between">
                <div className="h-8 w-4/12 shimmer"></div>
                <div className="h-8 w-1/12 shimmer"></div>
            </div>
        </div>
        <div className="flex flex-col rounded-md overflow-hidden border-1">
            {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-10 flex items-center border-b-1 mb-1">
                    {Array.from({ length: columnsCount || 5 }).map((_, index) => (
                        <div key={index} className="h-5 w-1/5 shimmer mx-2"></div>
                    ))}
                </div>
            ))}
        </div>
            </>
    );
};

export default TableShimmer;