import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Target} from "lucide-react";
import GeneratedTasksList from "./GeneratedTasksList";
import QuickStats from "./QuickStats";


interface TaskGeneratorProps {
  topic: string;
  setTopic: (topic: string) => void;
  loading: boolean;
  generateTasks: () => void;
  generatedTasks: string[];
  isTaskSaved: (taskTitle: string) => boolean;
  savingTasks: Set<string>;
  saveTask: (title: string) => void;
  saveAllGeneratedTasks: (tasks: string[]) => void;
  totalSavedTasks: number;
  completionRate: number;
}

const TaskGenerator = ({
  topic,
  setTopic,
  loading,
  generateTasks,
  generatedTasks,
  isTaskSaved,
  savingTasks,
  saveTask,
  saveAllGeneratedTasks,
  totalSavedTasks,
  completionRate
}: TaskGeneratorProps) => {
  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-slate-900 text-xl">
          <Target className="w-6 h-6 mr-2 text-blue-600" />
          Generate Tasks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic (e.g., React, Python, Design...)"
            className="bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-base py-6"
            onKeyDown={(e) => e.key === 'Enter' && generateTasks()}
          />
          <Button
            onClick={generateTasks}
            disabled={loading || !topic.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base py-6"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 mr-2" />
                Generate Tasks
              </>
            )}
          </Button>
        </div>

        <GeneratedTasksList
          generatedTasks={generatedTasks}
          isTaskSaved={isTaskSaved}
          savingTasks={savingTasks}
          saveTask={saveTask}
          saveAllGeneratedTasks={saveAllGeneratedTasks}
        />

        <QuickStats
          totalSavedTasks={totalSavedTasks}
          completionRate={completionRate}
        />
      </CardContent>
    </Card>
  );
};
export default TaskGenerator;