import React from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ServiceDetailedContentProps {
  banner: string;
  bannerTitle: string;
  points: string[];
  contactText: string;
  contactUrl: string;
  contactButtonText: string;
}

const ServiceDetailedContent: React.FC<ServiceDetailedContentProps> = ({
  banner,
  bannerTitle,
  points,
  contactText,
  contactUrl,
  contactButtonText,
}) => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <div
        className="relative w-full h-[50vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <h1 className="relative z-10 text-4xl md:text-6xl font-bold text-white text-center">
          {bannerTitle}
        </h1>
      </div>

      <div className="w-full py-12 px-4 md:px-0">
        <div className="max-w-7xl mx-auto">
          <ul className="space-y-4">
            {points.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="text-green-600 w-5 h-5 shrink-0 mt-1" />
                <span className="text-lg">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="w-full py-12 bg-muted">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-lg font-medium">{contactText}</p>
          <Button onClick={() => navigate(contactUrl)}>{contactButtonText}</Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailedContent;
