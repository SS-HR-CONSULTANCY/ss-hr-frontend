import type { SingleTabProps } from "@/types/componentTypes/singleTabTypes";

export const SingleTab: React.FC<SingleTabProps> = ({
    icon,
    text,
    sidebarOpen,
    onClick,
    className = '',
}) => {
    return (
        <li
            title={text}
            onClick={onClick}
            className={`p-3 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer rounded-md ${!sidebarOpen && 'flex justify-center'} ${className} text-[var(--textOne)] hover:text-[var(--textOneHover)]`}
        >
            {sidebarOpen ? (
                <div className='flex cursor-pointer'>
                    <span className='text-2xl font-bold'>{icon}</span>
                    <span className='ml-2'>{text}</span>
                </div>
            ) : (
                <span className='text-2xl font-bold cursor-pointer'>{icon}</span>
            )}
        </li>
    );
};