import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./card";
import type { Testimonial } from "@/types/entities/testimonial";
import { Star } from "lucide-react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: Testimonial[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards",
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse",
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex flex-row w-max shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-infinite-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {items.map((item) => (
          <Card
            key={item._id}
            className="h-auto relative w-[250px] max-w-full shrink-0 flex-none
               rounded-2xl border border-b-0 border-zinc-200 
               bg-[linear-gradient(180deg,#fafafa,#f5f5f5)] 
               md:w-[300px] dark:border-zinc-700 
               dark:bg-[linear-gradient(180deg,#27272a,#18181b)]"
          >
            <CardContent className="flex flex-col h-full px-3 py-2 md:px-4 md:py-3">
              <blockquote className="flex flex-col h-full">
                <div
                  aria-hidden="true"
                  className="user-select-none pointer-events-none absolute 
                     -top-0.5 -left-0.5 -z-1 
                     h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
                ></div>

                {/* Rating stars */}
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-3 h-3",
                        i < (item.rating || 5)
                          ? "fill-[#fbbc04] text-[#fbbc04]" // Google yellow
                          : "fill-gray-200 text-gray-200"
                      )}
                    />
                  ))}
                </div>

                {/* Quote text */}
                <span className="relative z-20 text-xs leading-[1.5] font-normal text-black dark:text-white">
                  {item.testimonial}
                </span>

                {/* Footer at bottom */}
                <div className="relative z-20 mt-auto flex flex-row items-center justify-between pt-4">
                  <div className="flex flex-row items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-300 text-slate-700 font-bold text-sm shrink-0">
                      {item.clientName?.charAt(0)?.toUpperCase() || "C"}
                    </div>
                    <span className="flex flex-col">
                      <span className="text-xs leading-[1.5] font-semibold text-black dark:text-white">
                        {item.clientName}
                      </span>
                      <span className="text-[10px] leading-[1.5] font-normal text-gray-500 dark:text-gray-300">
                        {item.designation}
                      </span>
                    </span>
                  </div>
                  {/* Google Icon */}
                  <span
                    className="w-5 h-5 shrink-0"
                    title="Google Review"
                    style={{
                      backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJubm96ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=")`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "contain",
                    }}
                  />
                </div>
              </blockquote>
            </CardContent>
          </Card>
        ))}
      </ul>
    </div>
  );
};
