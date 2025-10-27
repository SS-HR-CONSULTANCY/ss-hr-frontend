import React from "react";
import { Loader } from "lucide-react";

const FormLoading: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-700 p-6 max-w-4xl mx-auto flex flex-col items-center justify-center">
      <Loader className="animate-spin" />
      <p>Loading....</p>
    </div>
  );
};

export default FormLoading;
