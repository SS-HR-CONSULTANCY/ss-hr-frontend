import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <Loader2 className="h-10 w-10 animate-spin" />
    </div>
  );
};

export default Loading;
