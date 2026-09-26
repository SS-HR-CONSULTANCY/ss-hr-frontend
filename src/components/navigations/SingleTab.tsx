import type { SingleTabProps } from "@/types/componentTypes/singleTabTypes";

export const SingleTab: React.FC<SingleTabProps> = ({
  icon,
  text,
  sidebarOpen,
  onClick,
  className = "",
  badge,
}) => {
  return (
    <li
      title={text}
      onClick={onClick}
      className={`px-3 py-2.5 my-1 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white cursor-pointer rounded-lg transition-all ${!sidebarOpen && "flex justify-center"} ${className}`}
    >
      {sidebarOpen ? (
        <div className="flex items-center justify-between w-full">
          <div className="flex cursor-pointer items-center">
            <span className="text-2xl font-bold">{icon}</span>
            <span className="ml-2">{text}</span>
          </div>
          {!!badge && Number(badge) > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mr-2">
              {badge}
            </span>
          )}
        </div>
      ) : (
        <div className="relative">
          <span className="text-2xl font-bold cursor-pointer">{icon}</span>
          {!!badge && Number(badge) > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
      )}
    </li>
  );
};
