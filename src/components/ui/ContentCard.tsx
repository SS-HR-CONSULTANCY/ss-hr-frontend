import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ContentCardProps } from "@/types/componentTypes/servicesTypes";
import { Button } from "./button";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ContentCard = ({
  title,
  description,
  hoverDescription,
  imageUrl,
  buttonText,
  buttonUrl,
  buttonAction,
}: ContentCardProps) => {

  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full group/card flex text-white" data-aos="fade-up">
      <div
        className={cn(
          "border-0 cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl flex flex-col justify-end p-2 bg-contain bg-no-repeat bg-center w-full"
        )}
        style={{ backgroundImage: `url(${imageUrl})` }}
        onClick={() => {
          if (buttonAction === "share_interest") {
            if (!isAuthenticated) {
              setIsOpen(true);
            } else {
              navigate("/user/jobs");
            }
          } else if (buttonUrl) {
            navigate(buttonUrl);
          }
        }}
      >
        <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>

        <div className="relative z-10 bg-black/50 rounded-lg p-4 overflow-hidden">
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
              <div className="flex flex-col h-full">
                <p
                  className={cn(
                    "font-normal text-sm transition-all duration-500 transform overflow-hidden line-clamp-5",
                    "opacity-0 translate-y-2 group-hover/card:opacity-100 group-hover/card:translate-y-0"
                  )}
                >
                  {hoverDescription}
                </p>
                <Button
                  variant="link"
                  className="justify-center mt-auto cursor-pointer text-white pointer-events-none"
                >
                  {buttonText}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ready to explore careers?</AlertDialogTitle>
            <AlertDialogDescription>
              To view available vacancies and share your interest, please log in or create an account with us.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsOpen(false)}>Maybe Later</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setIsOpen(false);
              navigate("/login");
            }}>
              Log In
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContentCard;
