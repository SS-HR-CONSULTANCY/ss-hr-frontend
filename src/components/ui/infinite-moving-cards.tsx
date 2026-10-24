import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import type { Testimonial } from "@/types/entities/testimonial";
import { Star } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./dialog";

dayjs.extend(relativeTime);

const GOOGLE_AVATAR_BG_COLORS = [
  "bg-[#9333ea] text-white", // Purple
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

const formatDesignation = (designation?: string) => {
  if (
    !designation ||
    ["Customer", "Local Guide", "Google Reviewer"].includes(designation.trim())
  ) {
    return "Client of SS HR Tours & Travels";
  }
  return designation;
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
  const [selectedReviewForModal, setSelectedReviewForModal] =
    useState<Testimonial | null>(null);

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

  // Event delegation to capture clicks from both original and cloned elements
  const handleScrollerClick = (e: React.MouseEvent) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>(
      "[data-readmore-id]",
    );
    if (target) {
      e.stopPropagation();
      const id = target.getAttribute("data-readmore-id");
      const found = items.find((t) => t._id === id);
      if (found) {
        setSelectedReviewForModal(found);
      }
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        className={cn(
          "scroller relative z-20 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]",
          className,
        )}
      >
        <ul
          ref={scrollerRef}
          onClick={handleScrollerClick}
          className={cn(
            "flex flex-row w-max shrink-0 flex-nowrap items-center gap-4 py-3",
            start && "animate-infinite-scroll",
            pauseOnHover && "hover:[animation-play-state:paused]",
          )}
        >
          {items.map((item) => {
            const isLongText = (item.testimonial?.length || 0) > 130;
            return (
              <li
                key={item._id}
                className="relative w-[280px] md:w-[320px] h-[185px] shrink-0 flex-none
                  rounded-2xl border border-zinc-200/90 
                  bg-white/95 backdrop-blur-sm shadow-sm hover:shadow-md transition-all
                  dark:border-zinc-800 dark:bg-zinc-900/95 p-3.5 flex flex-col justify-between"
              >
                <div>
                  {/* Reviewer Header */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {item.clientPhoto ? (
                        <img
                          src={item.clientPhoto}
                          alt={item.clientName}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          className="w-8 h-8 rounded-full object-cover shrink-0 shadow-sm border border-zinc-200 dark:border-zinc-700"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLElement;
                            target.style.display = "none";
                            const sibling =
                              target.nextElementSibling as HTMLElement;
                            if (sibling) {
                              sibling.style.display = "flex";
                              sibling.classList.remove("hidden");
                            }
                          }}
                        />
                      ) : null}
                      <div
                        className={cn(
                          "items-center justify-center w-8 h-8 rounded-full font-bold text-xs shrink-0 shadow-sm",
                          getAvatarBg(item.clientName),
                          item.clientPhoto ? "hidden" : "flex",
                        )}
                      >
                        {item.clientName?.charAt(0)?.toUpperCase() || "G"}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                          {item.clientName}
                        </span>
                        <span className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                          {formatDesignation(item.designation)}
                        </span>
                      </div>
                    </div>
                    {/* Google Logo */}
                    <span
                      className="w-4 h-4 shrink-0"
                      title="Google Verified Review"
                      style={{
                        backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJubm96ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=")`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "contain",
                      }}
                    />
                  </div>

                  {/* Rating stars & Date/Time */}
                  <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-3 h-3",
                            i < (item.rating ?? 5)
                              ? "fill-[#fbbc04] text-[#fbbc04]"
                              : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700",
                          )}
                        />
                      ))}
                    </div>
                    <span
                      className="text-[10px] text-zinc-400 dark:text-zinc-500 font-normal"
                      title={dayjs(item.reviewDate || item.createdAt).format(
                        "DD MMM YYYY, hh:mm A",
                      )}
                    >
                      {formatReviewTime(item.reviewDate || item.createdAt)}
                    </span>
                    {isRecentReview(item.reviewDate || item.createdAt) && (
                      <span className="px-1.5 py-0.5 text-[8px] font-bold tracking-wider rounded bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 leading-none">
                        NEW
                      </span>
                    )}
                  </div>

                  {/* Review Text: up to 5 lines */}
                  <p
                    className="text-xs leading-[1.45] text-zinc-600 dark:text-zinc-300 font-normal break-words"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: isLongText ? 4 : 5,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.testimonial}
                  </p>
                </div>

                {/* Read more footer if text exceeds 4-5 lines */}
                {isLongText && (
                  <div className="pt-1">
                    <button
                      type="button"
                      data-readmore-id={item._id}
                      className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline cursor-pointer inline-flex items-center gap-0.5"
                    >
                      Read more
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Full Review Modal */}
      <Dialog
        open={!!selectedReviewForModal}
        onOpenChange={(open) => {
          if (!open) setSelectedReviewForModal(null);
        }}
      >
        <DialogContent className="sm:max-w-md p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              {selectedReviewForModal?.clientPhoto ? (
                <img
                  src={selectedReviewForModal.clientPhoto}
                  alt={selectedReviewForModal.clientName}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover border shadow-sm"
                />
              ) : (
                <div
                  className={cn(
                    "flex items-center justify-center w-11 h-11 rounded-full font-bold text-base text-white shadow-sm",
                    selectedReviewForModal
                      ? getAvatarBg(selectedReviewForModal.clientName)
                      : "",
                  )}
                >
                  {selectedReviewForModal?.clientName?.charAt(0)?.toUpperCase() ||
                    "G"}
                </div>
              )}
              <div className="flex flex-col text-left">
                <DialogTitle className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {selectedReviewForModal?.clientName}
                </DialogTitle>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {formatDesignation(selectedReviewForModal?.designation)}
                </span>
              </div>
            </div>
            <span
              className="w-6 h-6 shrink-0"
              title="Google Verified Review"
              style={{
                backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJubm96ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=")`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
              }}
            />
          </DialogHeader>

          <DialogDescription className="sr-only">
            Google Review by {selectedReviewForModal?.clientName}
          </DialogDescription>

          <div className="pt-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      i < (selectedReviewForModal?.rating ?? 5)
                        ? "fill-[#fbbc04] text-[#fbbc04]"
                        : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700",
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {formatReviewTime(
                  selectedReviewForModal?.reviewDate ||
                    selectedReviewForModal?.createdAt,
                )}
              </span>
            </div>

            <div className="max-h-[300px] overflow-y-auto pr-1">
              <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-200 whitespace-pre-wrap">
                {selectedReviewForModal?.testimonial}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};


