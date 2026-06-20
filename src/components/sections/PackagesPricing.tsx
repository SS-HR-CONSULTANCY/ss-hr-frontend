import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
} from "../ui/card";
import React from "react";
import { Button } from "../ui/button";
import Heading from "../common/Heading";
import { useQuery } from "@tanstack/react-query";
import { getPublicPackages } from "@/utils/apis/adminPackageApi";
import { useAppSelector } from "@/hooks/redux";

const PackagesPricing: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const { data, isLoading } = useQuery({
    queryKey: ["publicPackages"],
    queryFn: getPublicPackages,
  });

  const packageList = data?.data ?? [];

  return (
    <section id="packages" className="py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-0">
        <Heading
          heading="Packages & Pricing"
          dataaos="fade-up"
          headingDescription="Checkout our packages & Pricing."
          mainDivClassName="text-center mx-auto max-w-2xl"
        />

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading packages...</div>
        ) : packageList.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No packages available.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-6">
            {packageList.map((item) => (
              <Card
                key={item._id}
                className="p-4 rounded-2xl shadow-sm flex flex-col border-2 hover:border-[#01487e]"
                data-aos="fade-up"
              >
                <CardHeader className="text-center">
                  <CardTitle className="text-xl md:text-2xl font-semibold mb-4 sm:mb-6">
                    {item.packageName}
                  </CardTitle>

                  <span className="font-bold text-xl sm:text-2xl md:text-3xl">
                    {item.currency} {item.price}
                  </span>
                </CardHeader>

                <CardContent className="flex-1">
                  <p className="mt-4 text-sm text-muted-foreground whitespace-pre-wrap">
                    {item.packageIncludes}
                  </p>
                </CardContent>

                {isAuthenticated ? (
                  <div className="mt-auto">
                    <a
                      href="https://wa.me/971542326584"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="w-full cursor-pointer text-sm sm:text-base py-5">
                        Contact
                      </Button>
                    </a>
                  </div>
                ) : (
                  <CardFooter>
                    <Button
                      className="w-full border-0 shadow-md hover:font-bold text-white hover:text-white cursor-pointer bg-gradient-to-r to-[#ffd93e] from-[#01487e] text-sm sm:text-base py-5"
                      variant="outline"
                    >
                      Sign up
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PackagesPricing;
