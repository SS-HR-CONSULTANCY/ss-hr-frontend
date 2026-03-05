import React from "react";
import { Button } from "../ui/button";
import { LogIn, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginPrompt: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="bg-blue-50 p-6 rounded-full mb-6">
        <Briefcase className="h-12 w-12 text-blue-600" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Explore Exclusive Opportunities
      </h2>
      <p className="text-lg text-gray-600 max-w-md mb-8">
        To view our latest vacancies and apply for roles that match your skills, please log in to your account.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={() => navigate("/login")}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl text-lg font-semibold flex items-center gap-2 transition-all hover:scale-105"
        >
          <LogIn className="h-5 w-5" />
          Login Now
        </Button>
      </div>
    </div>
  );
};

export default LoginPrompt;
