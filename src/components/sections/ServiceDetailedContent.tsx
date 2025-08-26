import React from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { ServiceDetailedContentProps } from "@/types/componentTypes/serviceDetailedContentTypes";

const ServiceDetailedContent: React.FC<ServiceDetailedContentProps> = ({
  banner,
  bannerTitle,
  hoverDescription,
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
        <h1 className="relative z-10 text-4xl md:text-6xl font-bold text-white text-center" data-aos="fade-down">
          {bannerTitle}
        </h1>
      </div>


      <div className="w-full py-12 px-4 md:px-0">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="mb-10">
            <p className="textsm md:text-lg text-justify" data-aos="fade-down">{hoverDescription || "Loading description"}</p>
          </div>
          <ul className="space-y-4" data-aos="fade-down">
            {points.map((point, index) => (
              <li key={index} className="flex items-start gap-3" >
                <CheckCircle className="text-green-600 w-5 h-5 shrink-0 mt-1" />
                <span className="text-sm md:text-lg">{point || "loading..."}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="w-full py-3 md:py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-lg font-medium" data-aos="fade-right">{contactText}</p>
          <Button onClick={() => navigate(contactUrl)} data-aos="fade-left">{contactButtonText}</Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailedContent;
