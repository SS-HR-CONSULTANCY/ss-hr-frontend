import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
  CardDescription,
} from "../ui/card";
import React from "react";
import { Button } from "../ui/button";
import Heading from "../common/Heading";
import { CheckIcon } from "lucide-react";
import { packages } from "@/utils/constants";
import { useAppSelector } from "@/hooks/redux";

const PackagesPricing: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <section id="packages" className="py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-0">
        <Heading
          heading="Packages & Pricing"
          dataaos="fade-up"
          headingDescription="Checkout our packages & Pricing."
          mainDivClassName="text-center mx-auto max-w-2xl"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-6">
          {packages.map((item) => (
            <Card
              key={item.name}
              className={`p-4 rounded-2xl shadow-sm flex flex-col border-2 hover:border-[#01487e] ${
                item.popular && "border-2 border-[#01487e]"
              }`}
              data-aos="fade-up"
            >
              <CardHeader className="text-center">
                <CardTitle className="text-xl md:text-2xl font-semibold mb-4 sm:mb-6">
                  {item.name}
                </CardTitle>

                <span className="font-bold text-xl sm:text-2xl md:text-3xl">
                  AED {item.price === 0 ? "FREE" : item.price}
                </span>
              </CardHeader>

              <CardDescription className="text-center text-sm sm:text-base mt-2">
                {item.description}
              </CardDescription>

              <CardContent className="flex-1">
                <ul className="mt-6 space-y-2.5 text-xs sm:text-sm md:text-base">
                  {item.features.map((feature, i) => (
                    <li key={i} className="flex space-x-2">
                      <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              {isAuthenticated ? (
                <div className="mt-auto">
                  <Button className="w-full cursor-pointer text-sm sm:text-base py-5">
                    Choose Plan
                  </Button>
                </div>
              ) : (
                <CardFooter>
                  <Button
                    className="w-full border-0 shadow-md hover:font-bold text-white hover:text-white cursor-pointer bg-gradient-to-r to-[#ffd93e] from-[#01487e] text-sm sm:text-base py-5"
                    variant={"outline"}
                  >
                    Sign up
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackagesPricing;
