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
  dummyData: T;
  showDummyData: boolean;
}

const DashboardStats = <T extends Record<string, number>>({
  queryFunction,
  queryKey,
  statsMap,
  shimmerCount,
  dummyData,
  showDummyData,
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
    enabled: !showDummyData, // 🔑 skip query if showing dummy data
  });

  // ✅ Use dummyData if showDummyData = true, else API data
  const statsSource = showDummyData ? dummyData : dashboardStats;

  return (
    <>
      {isNumericDataLoading && !showDummyData ? (
        <DashboardStatsShimmer count={shimmerCount} />
      ) : isNumericDataError && numericDataError && !showDummyData ? (
        <DataFetchingError message="Data fetching failed" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {statsMap.length > 0
            ? statsMap.map(({ title, key, icon, price }) => (
                <StatsCard
                  key={key as string}
                  title={title}
                  value={statsSource?.[key] ?? 0}
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
