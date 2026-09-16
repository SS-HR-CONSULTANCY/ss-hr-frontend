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

import { staticPackages } from "@/utils/constants";

const PackagesPricing: React.FC = () => {
  const { data } = useQuery({
    queryKey: ["publicPackages"],
    queryFn: getPublicPackages,
  });

  const packageList =
    data?.data && data.data.length > 0 ? data.data : staticPackages;

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

              <CardFooter className="mt-auto pt-4">
                <a
                  href="https://wa.me/971542326584"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button className="w-full cursor-pointer text-sm sm:text-base py-5 bg-gradient-to-r from-[#01487e] to-[#0267b5] text-white hover:opacity-95 shadow-md">
                    Enquire on WhatsApp
                  </Button>
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackagesPricing;
