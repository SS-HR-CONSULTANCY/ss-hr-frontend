import React from "react";
import { CardDescription, CardHeader, CardTitle } from "../ui/card";
import logoImage from "../../assets/logos/brand-icon.png";

interface FormHeader {
  title: string;
  description: string;
}

const FormHeader: React.FC<FormHeader> = ({ title, description }) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-center">
        <img src={logoImage} className="size-16" />
      </div>
      <CardTitle className="text-center">{title}</CardTitle>
      <CardDescription className="text-center">{description}</CardDescription>
    </CardHeader>
  );
};

export default FormHeader;
