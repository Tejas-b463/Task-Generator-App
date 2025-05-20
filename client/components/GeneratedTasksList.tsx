import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {Loader2, Save, CheckCheck} from "lucide-react";

interface GeneratedTasksListProps {
  generatedTasks: string[];
  isTaskSaved: (taskTitle: string) => boolean;
  savingTasks: Set<string>;
  saveTask: (title: string) => void;
  saveAllGeneratedTasks: (tasks: string[]) => void;
}

const GeneratedTasksList = ({
  generatedTasks,
  isTaskSaved,
  savingTasks,
  saveTask,
  saveAllGeneratedTasks
}: GeneratedTasksListProps) => {
  if (generatedTasks.length === 0) return null;

  return (
    <div className="space-y-3 pt-4 border-t border-slate-200">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-medium text-slate-700">Generated Tasks</h4>
        <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-base">
          {generatedTasks.length} tasks
        </Badge>
      </div>
      <ScrollArea className="h-64" style={{ maxHeight: "256px" }}>
        <div className="space-y-2 pr-3">
          {generatedTasks.map((task, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-3 hover:border-slate-300 transition-colors"
            >
              <span className="text-base text-slate-700 flex-1 mr-3">{task}</span>
              <Button
                variant={isTaskSaved(task) ? "secondary" : "default"}
                size="sm"
                onClick={() => saveTask(task)}
                disabled={isTaskSaved(task) || savingTasks.has(task)}
                className={isTaskSaved(task)
                  ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 text-base py-2 px-3"
                  : "bg-blue-600 hover:bg-blue-700 text-white text-base py-2 px-3"
                }
              >
                {savingTasks.has(task) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    Saving...
                  </>
                ) : isTaskSaved(task) ? (
                  <>
                    <CheckCheck className="w-4 h-4 mr-1" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
      <Button
        onClick={() => saveAllGeneratedTasks(generatedTasks)}
        variant="outline"
        className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 text-base py-5"
      >
        <Save className="w-5 h-5 mr-2" />
        Save All Tasks
      </Button>
    </div>
  );
};
export default GeneratedTasksList;