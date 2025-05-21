import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import {CheckCircle2} from "lucide-react";


type Task = {
  id: string;
  title: string;
  completed: boolean;
  userId?: string;
  topic?: string;
};

const COLORS = ['#10b981', '#f59e0b', '#6b7280'];

interface TaskStatisticsChartProps {
  savedTasks: Task[];
  generatedNotSavedCount: number;
}

 const TaskStatisticsChart = ({ savedTasks, generatedNotSavedCount }: TaskStatisticsChartProps) => {
  const completedTasksCount = savedTasks.filter(task => task.completed).length;
  const pendingTasksCount = savedTasks.filter(task => !task.completed).length;

  const data = [
    { name: 'Completed Tasks', value: completedTasksCount },
    { name: 'Pending Tasks', value: pendingTasksCount },
    { name: 'Generated (Not Saved)', value: generatedNotSavedCount }
  ].filter(item => item.value > 0);

  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500">
        <div className="text-center">
          <div className="bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No task data yet</h3>
          <p className="text-slate-600">Generate and save tasks to see analytics</p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={100}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`${value} tasks`, 'Count']}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
export default TaskStatisticsChart;