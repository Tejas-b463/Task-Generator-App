import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {Edit, Trash2} from "lucide-react";

type Task = {
  id: string;
  title: string;
  
  completed: boolean;
  userId?: string;
  topic?: string;
};

interface TaskItemProps {
  task: Task;
  toggleTaskCompletion: (taskId: string, completed: boolean) => void;
  navigateToUpdate: (task: Task) => void;
  deleteTask: (taskId: string) => void;
}

const TaskItem = ({ task, toggleTaskCompletion, navigateToUpdate, deleteTask }: TaskItemProps) => {
  return (
    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors group">
      <div className="flex items-center gap-3 flex-1">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => toggleTaskCompletion(task.id, task.completed)}
          className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 w-5 h-5"
        />
        <span className={`text-base transition-all ${task.completed
            ? "text-slate-500"
            : "text-slate-700"
          }`}>
          {task.title}
        </span>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          onClick={() => navigateToUpdate(task)}
          variant="ghost"
          size="sm"
          className="h-9 px-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => deleteTask(task.id)}
          variant="ghost"
          size="sm"
          className="h-9 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default TaskItem;