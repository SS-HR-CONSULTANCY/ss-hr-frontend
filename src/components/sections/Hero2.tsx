import { useEffect, useState } from "react";
import { services } from "@/utils/constants";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const Hero2 = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev === services.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen flex items-center py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-4">

        <div className="relative w-full h-[300px] sm:h-[350px] md:h-[450px] lg:h-[550px]">
          <AnimatePresence mode="wait">
            <motion.img
              key={services[index].imageUrl}
              src={services[index].imageUrl}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-full h-full object-contain"
            />
          </AnimatePresence>
        </div>

        <div className="flex flex-col">
          <div className="relative min-h-[160px]">
            <AnimatePresence mode="wait">
              <motion.h1
                key={services[index].heroTitle}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6 }}
                className="text-4xl lg:text-6xl font-extrabold leading-tight tracking-tight"
              >
                {services[index].heroTitle}
              </motion.h1>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p
                key={services[index].hoverDescription}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.5 }}
                className="mt-4 text-lg max-w-2xl"
              >
                {services[index].hoverDescription}
              </motion.p>
            </AnimatePresence>
          </div>

          <Badge className="mt-4 w-fit">India & Dubai</Badge>

          <Card className="mt-8 max-w-md">
            <CardContent className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="text-sm font-medium">Sign up to your dream</p>
                <p className="text-xs">availability services</p>
              </div>

              <div className="hidden md:flex items-center gap-3">
                <div className="rounded-md border p-2 text-sm">
                  {services[index].title}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </section>
  );
};

export default Hero2;
