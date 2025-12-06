import StatsCard from "./StatsCard";
import { useQuery } from "@tanstack/react-query";
import type { statsMapIntrface } from "@/types/commonTypes";
import DataFetchingError from "../common/DataFetchingError";
import DashboardStatsShimmer from "../shimmer/DashboardStatsShimmer";

interface DashboardStatsProps<T extends Record<string, number>> {
  queryFunction(): Promise<T>;
  queryKey: string;
  statsMap: Array<statsMapIntrface<T>>;
  plan?: string;
  shimmerCount: number;
}

const DashboardStats = <T extends Record<string, number>>({
  queryFunction,
  queryKey,
  statsMap,
  shimmerCount,
}: DashboardStatsProps<T>) => {
  const {
    data: dashboardStats,
    isLoading: isNumericDataLoading,
    isError: isNumericDataError,
    error: numericDataError,
  } = useQuery({
    queryKey: [queryKey],
    queryFn: queryFunction,
    staleTime: 1 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return (
    <>
      {isNumericDataLoading ? (
        <DashboardStatsShimmer count={shimmerCount} />
      ) : isNumericDataError && numericDataError ? (
        <DataFetchingError message="Data fetching failed" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {statsMap.length > 0
            ? statsMap.map(({ title, key, icon, price }) => (
                <StatsCard
                  key={key as string}
                  title={title}
                  value={dashboardStats?.[key] ?? 0}
                  icon={icon}
                  price={price}
                />
              ))
            : null}
        </div>
      )}
    </>
  );
};

export default DashboardStats;
