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
    <section className="h-screen">
      <div className="max-w-7xl mx-auto flex md:flex-row h-full items-center justify-around">
        <div className="col-span-6">
          <AnimatePresence mode="wait">
            <motion.h1
              key={services[index].heroTitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="mb-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-6xl"
            >
              {services[index].heroTitle}
            </motion.h1>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p
              key={services[index].hoverDescription}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
              className="mb-6 max-w-2xl text-lg"
            >
              {services[index].hoverDescription}
            </motion.p>
          </AnimatePresence>

          <Badge className="mb-4">India & Dubai</Badge>

          <div className="mt-8">
            <Card className="max-w-xl">
              <CardContent className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Sign up to your dream</p>
                  <p className="text-xs">availability services</p>
                </div>
                <div className="hidden items-center gap-3 md:flex">
                  <div className="rounded-md border p-2 text-sm">
                    {services[index].title}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="col-span-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={services[index].imageUrl}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8 }}
              className=""
            >
              <img
                src={services[index].imageUrl}
                data-aos="fade-left"
                alt="Hero illustration"
                className="object-contain w-full h-full"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Hero2;
