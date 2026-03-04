import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { userFetchAllPackages } from "@/utils/apis/userApi";
import type { Package, PackageCategoryType } from "@/types/entities/package";

const CATEGORY_LABELS: Record<PackageCategoryType, string> = {
  general: "General",
  visitvisa: "Visit Visa",
  visa: "Visa",
};

const CATEGORY_COLORS: Record<PackageCategoryType, string> = {
  general: "bg-gray-100 text-gray-700 border-gray-200",
  visitvisa: "bg-blue-50 text-blue-700 border-blue-200",
  visa: "bg-green-50 text-green-700 border-green-200",
};

const FILTER_TABS: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "General", value: "general" },
  { label: "Visit Visa", value: "visitvisa" },
  { label: "Visa", value: "visa" },
];

const PackageCard: React.FC<{ pkg: Package }> = ({ pkg }) => {
  const category = pkg.packageCategory as PackageCategoryType;
  const colors = CATEGORY_COLORS[category] ?? "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <div className="relative flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
      {/* Category Badge */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
          {pkg.packageName}
        </h3>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${colors}`}>
          {CATEGORY_LABELS[category] ?? category}
        </span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
          {pkg.currency} {pkg.price}
        </span>
      </div>

      {/* Package Includes */}
      <div className="flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
          What's Included
        </p>
        <ul className="space-y-1.5">
          {pkg.packageIncludes
            .split("\n")
            .filter(Boolean)
            .map((line, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                {line}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

const UserPackages: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userPackages", activeCategory],
    queryFn: () =>
      userFetchAllPackages({
        pagination: { page: 1, limit: 50 },
        category: activeCategory === "all" ? undefined : activeCategory,
      }),
  });

  const packages = data?.data ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Packages</h1>
        <p className="text-sm text-gray-500 mt-1">Browse available visa and travel packages</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveCategory(tab.value)}
            className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
              activeCategory === tab.value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-gray-100 animate-pulse dark:bg-gray-700" />
          ))}
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center h-48 text-red-500 font-medium">
          Failed to load packages. Please try again.
        </div>
      ) : packages.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-gray-400 font-medium">
          No packages found{activeCategory !== "all" ? ` for ${CATEGORY_LABELS[activeCategory as PackageCategoryType] ?? activeCategory}` : ""}.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <PackageCard key={pkg._id} pkg={pkg} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPackages;
