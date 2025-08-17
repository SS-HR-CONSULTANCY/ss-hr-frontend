import { cn } from "@/lib/utils";
import type { ContentCardProps } from "@/types/omponentTypes/services";

const ContentCard = ({
  title,
  description,
  hoverDescription,
  imageUrl,
}: ContentCardProps) => {
  return (
    <div className="w-full group/card flex">
      <div
        className={cn(
          "border-0 cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl flex flex-col justify-end p-2 bg-cover bg-center w-full"
        )}
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>

        <div className="relative z-10 dark:bg-black/70 bg-white/70 rounded-lg p-4 overflow-hidden">
          <h1 className="font-bold text-xl md:text-2xl">{title}</h1>

          <div
            className={cn(
              "relative overflow-hidden transition-all duration-500",
              "max-h-16 group-hover/card:max-h-40" 
            )}
          >
            <p
              className={cn(
                "font-normal text-sm transition-all duration-500 transform mt-2",
                "opacity-100 translate-y-0 group-hover/card:opacity-0 group-hover/card:-translate-y-2 absolute"
              )}
            >
              {description}
            </p>

            {hoverDescription && (
              <p
                className={cn(
                  "font-normal text-sm transition-all duration-500 transform",
                  "opacity-0 translate-y-2 group-hover/card:opacity-100 group-hover/card:translate-y-0"
                )}
              >
                {hoverDescription}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
