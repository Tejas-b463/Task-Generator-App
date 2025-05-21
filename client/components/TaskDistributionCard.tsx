import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TaskStatisticsChart from "./TaskStatisticsChart"

type Task = {
  id: string;
  title: string;
  completed: boolean;
  userId?: string;
  topic?: string;
};

interface TaskDistributionCardProps {
  savedTasks: Task[];
  generatedNotSavedCount: number;
}

const TaskDistributionCard = ({ savedTasks, generatedNotSavedCount }: TaskDistributionCardProps) => {
  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader>
        <CardTitle className="text-slate-900 text-xl">Task Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-80" style={{ height: "320px" }}>
        <TaskStatisticsChart
          savedTasks={savedTasks}
          generatedNotSavedCount={generatedNotSavedCount}
        />
      </CardContent>
    </Card>
  );
};

export default TaskDistributionCard;