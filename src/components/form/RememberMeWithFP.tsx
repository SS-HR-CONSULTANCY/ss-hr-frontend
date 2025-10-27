import React from "react";
import { Label } from "../ui/label";
import { Link } from "react-router-dom";
import { Checkbox } from "../ui/checkbox";

const RememberMeWithFP: React.FC = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Checkbox id="remember-me" />
        <Label htmlFor="remember-me">Remember me</Label>
      </div>
      <Link
        to="/forgot-password"
        className="text-sm text-muted-foreground hover:underline"
      >
        Forgot password?
      </Link>
    </div>
  );
};

export default RememberMeWithFP;
