import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-white dark:bg-black">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
    </div>
  );
};

export default Loading;
