import React from "react";
import { Smartphone, Sparkles, AppWindow } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const ShareMyAppsPage: React.FC = () => {
  return (
    <div className="space-y-6 text-black dark:text-white mt-0 w-full pb-14">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 shadow-sm">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              ShareMyApps
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <Card className="border border-emerald-100 dark:border-emerald-900/40 shadow-sm bg-gradient-to-br from-emerald-50/20 via-white to-white dark:from-emerald-950/10 dark:via-gray-900 dark:to-gray-900">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <AppWindow className="w-4 h-4 text-emerald-500" />
            ShareMyApps Dashboard
          </CardTitle>
          <CardDescription className="text-xs text-gray-500">
            This module is ready for your app distribution and management workflows.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 border-2 border-dashed border-emerald-200 dark:border-emerald-900/60 rounded-xl flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-base text-gray-800 dark:text-gray-200">
              ShareMyApps Module Created
            </h3>
            <p className="text-xs text-gray-500 max-w-md">
              The page and navigation routes have been initialized. Tell us what features, app lists, user downloads, or analytics you would like to include here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShareMyAppsPage;
