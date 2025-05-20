import { Card, CardContent } from "@/components/ui/card";
import { Circle, TrendingUp } from "lucide-react";

interface QuickStatsProps {
  totalSavedTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
}

const QuickStats = ({ 
  totalSavedTasks, 
  completionRate 
}: QuickStatsProps) => {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mt-4">
      {/* Total Tasks Card */}
      <Card className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
        <CardContent className="p-3 sm:p-4 md:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm sm:text-base text-slate-600">Total Tasks</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-900">{totalSavedTasks}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Circle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completion Rate Card */}
      <Card className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
        <CardContent className="p-3 sm:p-4 md:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm sm:text-base text-slate-600">Completion Rate</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-900">{completionRate}%</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStats;