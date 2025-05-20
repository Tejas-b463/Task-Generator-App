import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import TaskItem from "./TaskItem";
import {CheckCircle2} from "lucide-react";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  userId?: string;
  topic?: string;
};

interface SavedTasksProps {
  groupedTasks: Record<string, Task[]>;
  toggleTaskCompletion: (taskId: string, completed: boolean) => void;
  navigateToUpdate: (task: Task) => void;
  deleteTask: (taskId: string) => void;
}

const SavedTasks = ({
  groupedTasks,
  toggleTaskCompletion,
  navigateToUpdate,
  deleteTask
}: SavedTasksProps) => {
  if (Object.keys(groupedTasks).length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-slate-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-xl font-medium text-slate-900 mb-2">No tasks yet</h3>
        <p className="text-lg text-slate-600">Generate and save your first task to get started!</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-120">
      <div className="space-y-6 pr-3">
        {Object.entries(groupedTasks).map(([topicName, tasks]) => (
          <div key={topicName} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900">{topicName}</h3>
              <Badge variant="outline" className="bg-slate-50 text-slate-700 text-base">
                {tasks.filter(t => t.completed).length}/{tasks.length} completed
              </Badge>
            </div>
            <div className="space-y-2">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  toggleTaskCompletion={toggleTaskCompletion}
                  navigateToUpdate={navigateToUpdate}
                  deleteTask={deleteTask}
                />
              ))}
            </div>
            {Object.keys(groupedTasks).indexOf(topicName) < Object.keys(groupedTasks).length - 1 && (
              <Separator className="mt-4" />
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default SavedTasks;