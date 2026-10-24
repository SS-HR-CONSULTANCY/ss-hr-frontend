import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./card";
import type { Testimonial } from "@/types/entities/testimonial";
import { Star } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const GOOGLE_AVATAR_BG_COLORS = [
  "bg-[#9333ea] text-white", // Purple (like Anagha in screenshot)
  "bg-[#2563eb] text-white", // Blue
  "bg-[#059669] text-white", // Green
  "bg-[#dc2626] text-white", // Red
  "bg-[#d97706] text-white", // Amber
  "bg-[#0d9488] text-white", // Teal
  "bg-[#4f46e5] text-white", // Indigo
  "bg-[#e11d48] text-white", // Rose
];

const getAvatarBg = (name: string) => {
  if (!name) return GOOGLE_AVATAR_BG_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GOOGLE_AVATAR_BG_COLORS.length;
  return GOOGLE_AVATAR_BG_COLORS[index];
};

const formatReviewTime = (dateInput?: string | Date) => {
  if (!dateInput) return "recently";
  return dayjs(dateInput).fromNow();
};

const isRecentReview = (dateInput?: string | Date) => {
  if (!dateInput) return false;
  const d = dayjs(dateInput);
  const diffHours = dayjs().diff(d, "hour");
  return diffHours >= 0 && diffHours <= 48;
};

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
  const [start, setStart] = useState(false);

  useEffect(() => {
    addAnimation();
  }, [items]);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      // Clear any previously duplicated children if re-animating
      const originalCount = items.length;
      while (scrollerRef.current.children.length > originalCount) {
        scrollerRef.current.removeChild(scrollerRef.current.lastChild!);
      }

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
        "scroller relative z-20 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]",
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
            className="h-auto relative w-[280px] max-w-full shrink-0 flex-none
               rounded-2xl border border-zinc-200 
               bg-white/95 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow
               md:w-[320px] dark:border-zinc-800 
               dark:bg-zinc-900/95"
          >
            <CardContent className="flex flex-col h-full p-4">
              {/* Reviewer Header */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={cn(
                      "flex items-center justify-center w-9 h-9 rounded-full font-bold text-sm shrink-0 shadow-sm",
                      getAvatarBg(item.clientName)
                    )}
                  >
                    {item.clientName?.charAt(0)?.toUpperCase() || "G"}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      {item.clientName}
                    </span>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                      {item.designation || "Google Reviewer"}
                    </span>
                  </div>
                </div>
                {/* Google Logo */}
                <span
                  className="w-5 h-5 shrink-0"
                  title="Google Verified Review"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJubm96ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=")`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                  }}
                />
              </div>

              {/* Rating stars & Date/Time */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-3.5 h-3.5",
                        i < (item.rating ?? 5)
                          ? "fill-[#fbbc04] text-[#fbbc04]"
                          : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                      )}
                    />
                  ))}
                </div>
                <span
                  className="text-[11px] text-zinc-500 dark:text-zinc-400 font-normal"
                  title={dayjs(item.reviewDate || item.createdAt).format("DD MMM YYYY, hh:mm A")}
                >
                  {formatReviewTime(item.reviewDate || item.createdAt)}
                </span>
                {isRecentReview(item.reviewDate || item.createdAt) && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold tracking-wider rounded bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 leading-none">
                    NEW
                  </span>
                )}
              </div>

              {/* Review Text */}
              <p className="text-xs leading-[1.6] text-zinc-700 dark:text-zinc-300 font-normal break-words mt-1">
                {item.testimonial}
              </p>
            </CardContent>
          </Card>
        ))}
      </ul>
    </div>
  );
};

