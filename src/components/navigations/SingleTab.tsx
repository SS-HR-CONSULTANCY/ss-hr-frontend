import type { SingleTabProps } from "@/types/componentTypes/singleTabTypes";

export const SingleTab: React.FC<SingleTabProps> = ({
  icon,
  text,
  sidebarOpen,
  onClick,
  className = "",
}) => {
  return (
    <li
      title={text}
      onClick={onClick}
      className={`p-1 my-2 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white cursor-pointer rounded-md transition-colors ${!sidebarOpen && "flex justify-center"} ${className}`}
    >
      {sidebarOpen ? (
        <div className="flex cursor-pointer">
          <span className="text-2xl font-bold">{icon}</span>
          <span className="ml-2">{text}</span>
        </div>
      ) : (
        <span className="text-2xl font-bold cursor-pointer">{icon}</span>
      )}
    </li>
  );
};
