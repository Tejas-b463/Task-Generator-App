import { Separator } from "./ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ShimmerLine = ({ width = "w-full", height = "h-4" }) => (
  <div className={`${width} ${height} bg-slate-200 rounded animate-pulse`}></div>
);

export const ShimmerTaskItem = () => (
  <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-4">
    <div className="flex items-center gap-3 flex-1">
      <div className="w-5 h-5 bg-slate-200 rounded animate-pulse"></div>
      <ShimmerLine width="w-3/4" />
    </div>
    <div className="flex gap-2">
      <div className="w-8 h-8 bg-slate-200 rounded animate-pulse"></div>
      <div className="w-8 h-8 bg-slate-200 rounded animate-pulse"></div>
    </div>
  </div>
);

export const ShimmerGeneratedTaskItem = () => (
  <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-3">
    <ShimmerLine width="w-3/4" />
    <div className="w-20 h-8 bg-slate-200 rounded animate-pulse ml-3"></div>
  </div>
);

export const ShimmerChart = () => (
  <Card className="shadow-sm border-slate-200 h-full">
    <CardHeader>
      <CardTitle className="text-slate-900 text-xl">
        <ShimmerLine width="w-48" height="h-6" />
      </CardTitle>
    </CardHeader>
    <CardContent className="flex items-center justify-center h-80">
      <div className="w-60 h-60 rounded-full bg-slate-200 animate-pulse"></div>
    </CardContent>
  </Card>
);


export const ShimmerTaskGenerator = () => (
  <Card className="shadow-sm border-slate-200">
    <CardHeader>
      <CardTitle className="text-slate-900 text-xl">
        <ShimmerLine width="w-40" height="h-6" />
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {/* Input field shimmer */}
      <div className="space-y-2">
        <ShimmerLine width="w-20" height="h-4" />
        <div className="h-10 bg-slate-200 rounded animate-pulse"></div>
      </div>
      
      {/* Generate button shimmer */}
      <div className="h-10 bg-slate-200 rounded animate-pulse w-full"></div>
      
      {/* Stats section shimmer */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="text-center space-y-2">
          <ShimmerLine width="w-16" height="h-6" />
          <ShimmerLine width="w-24" height="h-4" />
        </div>
        <div className="text-center space-y-2">
          <ShimmerLine width="w-16" height="h-6" />
          <ShimmerLine width="w-20" height="h-4" />
        </div>
      </div>
      
      {/* Generated tasks shimmer */}
      <div className="space-y-3 mt-6">
        <div className="flex items-center justify-between">
          <ShimmerLine width="w-32" height="h-5" />
          <div className="w-20 h-8 bg-slate-200 rounded animate-pulse"></div>
        </div>
        {[1, 2, 3, 4].map((i) => (
          <ShimmerGeneratedTaskItem key={i} />
        ))}
      </div>
    </CardContent>
  </Card>
);

export const ShimmerSavedTasks = () => (
  <div className="space-y-6">
    {/* Multiple topic sections */}
    {[1, 2, 3].map((topicIndex) => (
      <div key={topicIndex} className="space-y-3">
        <div className="flex items-center justify-between">
          <ShimmerLine width="w-48" height="h-6" />
          <ShimmerLine width="w-20" height="h-5" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((taskIndex) => (
            <ShimmerTaskItem key={`${topicIndex}-${taskIndex}`} />
          ))}
        </div>
        {topicIndex < 3 && <Separator className="mt-4" />}
      </div>
    ))}
  </div>
);

export const ShimmerHeader = () => (
  <header className="bg-white shadow-sm border-b border-slate-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between h-16 gap-y-2 sm:gap-y-0">
        
        {/* Logo section */}
        <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
          <div className="w-8 h-8 bg-slate-200 rounded animate-pulse"></div>
          <ShimmerLine width="w-24 sm:w-32" height="h-6" />
        </div>

        {/* Stats section */}
        <div className="flex flex-wrap items-center justify-center space-x-2 sm:space-x-6 order-3 sm:order-none w-full sm:w-auto mt-2 sm:mt-0">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <ShimmerLine width="w-16 sm:w-20" height="h-4" />
            <div className="w-6 sm:w-8 h-6 sm:h-8 bg-slate-200 rounded-full animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <ShimmerLine width="w-16 sm:w-20" height="h-4" />
            <div className="w-6 sm:w-8 h-6 sm:h-8 bg-slate-200 rounded-full animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <ShimmerLine width="w-16 sm:w-20" height="h-4" />
            <div className="w-10 sm:w-12 h-6 bg-slate-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* User profile section */}
        <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-end">
          <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse"></div>
          <ShimmerLine width="w-20 sm:w-24" height="h-5" />
        </div>
      </div>
    </div>
  </header>
);













