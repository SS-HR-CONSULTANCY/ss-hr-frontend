import { cn } from "@/utils/cn";
import React from "react";

interface HeadingProps {
  heading: string;
  headingDescription: string;
  mainDivClassName: string;
  headingClassName?: string;
  dataaos?: string;
}

const Heading: React.FC<HeadingProps> = ({
  heading,
  headingDescription,
  mainDivClassName,
  headingClassName = "w-[100%]",
  dataaos,
}) => {
  return (
    <div
      className={cn(mainDivClassName, "mb-10 lg:mb-14")}
      data-aos={`${dataaos}`}
    >
      <h2
        className={`text-black dark:text-white scroll-m-20 border-b border-gray-500 dark:border-gray-400 pb-2 text-3xl font-semibold first:mt-0 ${headingClassName}`}
      >
        {heading}
      </h2>
      <p className="mt-1 text-muted-foreground">{headingDescription}</p>
    </div>
  );
};

export default Heading;
