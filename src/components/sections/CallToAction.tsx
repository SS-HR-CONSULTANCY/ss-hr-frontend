import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { callToActionData } from "@/utils/constants";

const CallToAction = () => {
  return (
    <section
      className={cn(
        "w-full py-16 md:py-24 bg-gradient-to-b from-background to-muted text-center",
      )}
    >
      <div
        className="container mx-auto max-w-3xl flex flex-col items-center gap-6 px-4"
        data-aos="fade-up"
        data-aos-duration="3000"
      >
        <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
          {callToActionData.title}
        </h2>

        {callToActionData.description && (
          <p className="text-lg text-muted-foreground max-w-2xl">
            {callToActionData.description}
          </p>
        )}

        {callToActionData.buttons.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mt-4 overflow-hidden">
            {callToActionData.buttons.map((button, i) => (
              <Button
                key={i}
                variant={button.variant || "default"}
                size="lg"
                data-aos={i === 0 ? "fade-right" : "fade-left"}
                asChild
              >
                <a href={button.href}>{button.text}</a>
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CallToAction;
