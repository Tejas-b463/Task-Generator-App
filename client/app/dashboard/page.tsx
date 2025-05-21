"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BASE_URL } from "@/lib/constants";
import { toast } from "sonner";
import { useAuth } from "../../lib/AuthContext";
import { useRouter } from "next/navigation";


// Components
import Header from "@/components/Header";
import TaskGenerator from "@/components/TaskGenerator";
import TaskDistributionCard from "@/components/TaskDistributionCard";
import SavedTasks from "@/components/SavedTasks";
import {
  ShimmerGeneratedTaskItem,
  ShimmerChart,
  ShimmerTaskGenerator,
  ShimmerSavedTasks,
  ShimmerHeader
} from "@/components/ShimmerUI"

// Types
type Task = {
  id: string;
  title: string;
  completed: boolean;
  userId?: string;
  topic?: string;
};


export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [topic, setTopic] = useState("");
  const [generatedTasks, setGeneratedTasks] = useState<string[]>([]);
  const [savedTasks, setSavedTasks] = useState<Task[]>([]);
  const [savingTasks, setSavingTasks] = useState<Set<string>>(new Set());
  const [generatingTasks, setGeneratingTasks] = useState(false);
  const [loadingSavedTasks, setLoadingSavedTasks] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);


  // Calculate task statistics
  const completedTasksCount = savedTasks.filter(task => task.completed).length;
  const pendingTasksCount = savedTasks.filter(task => !task.completed).length;
  const generatedNotSavedCount = generatedTasks.filter(task =>
    !savedTasks.some(savedTask =>
      savedTask.title.toLowerCase() === task.toLowerCase()
    )
  ).length;
  const totalSavedTasks = savedTasks.length;
  const completionRate = totalSavedTasks > 0 ? Math.round((completedTasksCount / totalSavedTasks) * 100) : 0;

  // Define fetchSavedTasks with useCallback
  const fetchSavedTasks = useCallback(async () => {
    if (!user) {
      console.log("No user found, skipping fetch");
      setLoadingSavedTasks(false);
      setInitialLoad(false);
      return;
    }

    console.log("Fetching tasks for user:", user.uid);
    setLoadingSavedTasks(true);

    try {
      const res = await fetch(`${BASE_URL}/api/tasks/${user.uid}`);
      console.log("Fetch response status:", res.status);

      if (res.ok) {
        const data = await res.json();
        console.log("Fetched tasks data:", data);

        if (Array.isArray(data) && data.length > 0) {
          const missingTopics = data.filter(task => !task.topic).length;
          if (missingTopics > 0) {
            console.warn(`${missingTopics} tasks are missing topic information`);
          }
        } else {
          console.log("No saved Tasks")
        }

        setSavedTasks(Array.isArray(data) ? data : []);
      } else {
        console.log('failed tasks')
      }
    } catch (error) {
      console.error('Failed fetching tasks:', error);
    } finally {
      setLoadingSavedTasks(false);
      setInitialLoad(false);
    }
  }, [user]); // Only depends on user

  // Use useEffect to call fetchSavedTasks
  useEffect(() => {
    if (!user || authLoading) return;
    fetchSavedTasks();
  }, [user, authLoading, fetchSavedTasks]);


  // Generate tasks from Gemini
  const generateTasks = async () => {
    if (!user) {
      toast.error("Please login first to generate tasks", {
        id: "login-error",
        duration: 3000
      });
      return;
    }

    setGeneratingTasks(true);
    setGeneratedTasks([]);


    try {
      const res = await fetch(`${BASE_URL}/api/tasks/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      console.log("Generate API response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to generate tasks:", res.status, errorText);
        toast.error(`Failed to generate tasks: ${res.status}`, {
          id: "generating-tasks"
        });
        return;
      }

      const data = await res.json();
      console.log("Generated tasks:", data);

      let tasksArray;
      if (Array.isArray(data)) {
        tasksArray = data;
      } else if (data && Array.isArray(data.tasks)) {
        tasksArray = data.tasks;
      } else {
        console.error("Invalid response format:", data);
        toast.error("Failed to generate tasks.", {
          id: "generating-tasks"
        });
        return;
      }

      setGeneratedTasks(tasksArray);
      toast.success(`Generated ${tasksArray.length} tasks!`, {
        id: "generating-tasks"
      });
    } catch (error) {
      console.error("Error generating tasks:", error);
      toast.error("Error calling backend.", {
        id: "generating-tasks"
      });
    } finally {
      setGeneratingTasks(false);
    }
  };

  // Save all generated tasks at once
  const saveAllGeneratedTasks = async (tasks: string[]) => {
    if (!user) return;

    const currentTopic = topic.trim();
    if (!currentTopic) {
      console.warn("No topic specified when bulk saving tasks");
    }

    console.log("Bulk saving tasks with topic:", currentTopic);

    toast.loading("Saving all tasks...", {
      id: "save-all-tasks"
    });

    try {
      const tasksToSave = tasks.filter(task =>
        !savedTasks.some(savedTask =>
          savedTask.title.toLowerCase() === task.toLowerCase()
        )
      );

      if (tasksToSave.length === 0) {
        toast.success("All tasks already saved!", {
          id: "save-all-tasks"
        });
        return;
      }

      setSavingTasks(new Set(tasksToSave));

      const promises = tasksToSave.map(async (title) => {
        const taskData = {
          title: title.trim(),
          userId: user.uid,
          completed: false,
          topic: currentTopic
        };

        console.log("Sending task data to backend:", taskData);

        const res = await fetch(`${BASE_URL}/api/tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskData),
        });

        if (res.ok) {
          const savedTask = await res.json();
          console.log("Received saved task from backend:", savedTask);

          if (!savedTask.topic && currentTopic) {
            console.warn("Topic not returned from backend, adding it manually");
            savedTask.topic = currentTopic;
          }

          return savedTask;
        } else {
          throw new Error(`Failed to save: ${title}`);
        }
      });

      const savedTasksResults = await Promise.all(promises);
      setSavedTasks(prev => [...prev, ...savedTasksResults]);
      toast.success(`Saved ${savedTasksResults.length} tasks!`, {
        id: "save-all-tasks"
      });

    } catch (error) {
      console.error("Error saving tasks:", error);
      toast.error("Some tasks couldn't be saved", {
        id: "save-all-tasks"
      });
    } finally {
      setSavingTasks(new Set());
    }
  };

  // saved tasks by topic
  const groupedTasks = savedTasks.reduce((groups, task) => {
    const topicName = task.topic || 'Uncategorized';
    if (!groups[topicName]) {
      groups[topicName] = [];
    }
    groups[topicName].push(task);
    return groups;
  }, {} as Record<string, Task[]>);

  // Save a generated task to DB
  const saveTask = async (title: string) => {
    if (!user) {
      toast.error("User not logged in", {
        id: "save-task-error"
      });
      return;
    }

    const taskExists = savedTasks.some(task => task.title.toLowerCase() === title.toLowerCase());
    if (taskExists) {
      toast.error("Task already saved!", {
        id: `task-exists-${title.substring(0, 10)}`
      });
      return;
    }

    const currentTopic = topic.trim();
    if (!currentTopic) {
      console.warn("No topic specified when saving task");
    }

    console.log("Saving task with topic:", currentTopic);

    setSavingTasks(prev => new Set([...prev, title]));

    try {
      const taskData = {
        title: title.trim(),
        userId: user.uid,
        completed: false,
        topic: currentTopic
      };

      console.log("Sending task data to backend:", taskData);

      const res = await fetch(`${BASE_URL}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });

      console.log("Save task response status:", res.status);

      if (res.ok) {
        const savedTask = await res.json();
        console.log("Received saved task from backend:", savedTask);

        if (!savedTask.topic && currentTopic) {
          console.warn("Topic not returned from backend, adding it manually");
          savedTask.topic = currentTopic;
        }

        setSavedTasks(prev => [...prev, savedTask]);
        toast.success("Task saved successfully!", {
          id: `saving-task-${title.substring(0, 10)}`
        });
      } else {
        const errorData = await res.text();
        console.error("Save task error:", errorData);
        toast.error(`Failed to save task: ${res.status}`, {
          id: `saving-task-${title.substring(0, 10)}`
        });
      }
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("Error saving task.", {
        id: `saving-task-${title.substring(0, 10)}`
      });
    } finally {
      setSavingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(title);
        return newSet;
      });
    }
  };

  // Check task is already saved
  const isTaskSaved = (taskTitle: string) => {
    return savedTasks.some(task => task.title.toLowerCase() === taskTitle.toLowerCase());
  };

  // Toggle task completion
  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    if (!user) return;

    // Show loading toast
    toast.loading(completed ? "Marking as incomplete..." : "Marking as complete...", {
      id: `toggle-task-${taskId}`
    });

    try {
      const res = await fetch(`${BASE_URL}/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });

      if (res.ok) {
        setSavedTasks(prev => prev.map(task =>
          task.id === taskId ? { ...task, completed: !completed } : task
        ));
        toast.success(completed ? "Task marked as incomplete" : "Task completed!", {
          id: `toggle-task-${taskId}`
        });
      } else {
        toast.error("Failed to update task", {
          id: `toggle-task-${taskId}`
        });
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Error updating task", {
        id: `toggle-task-${taskId}`
      });
    }
  };

  // Navigate to update page
  const navigateToUpdate = (task: Task) => {
    toast.info(`Editing: ${task.title.substring(0, 20)}...`);
    router.push(`/update?id=${task.id}&title=${encodeURIComponent(task.title)}&topic=${encodeURIComponent(task.topic || '')}`);
  };

  // Delete a saved task
  const deleteTask = async (taskId: string) => {
    if (!user) return;

    const taskToDelete = savedTasks.find(task => task.id === taskId);
    if (!taskToDelete) return;

    // Show deleting toast
    toast.loading(`Deleting: ${taskToDelete.title.substring(0, 20)}...`, {
      id: `delete-task-${taskId}`
    });

    try {
      const res = await fetch(`${BASE_URL}/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSavedTasks(prev => prev.filter(task => task.id !== taskId));
        toast.success("Task deleted!", {
          id: `delete-task-${taskId}`
        });
      } else {
        toast.error("Failed to delete task", {
          id: `delete-task-${taskId}`
        });
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Error deleting task", {
        id: `delete-task-${taskId}`
      });
    }
  };

  // Show initial loading screen only when user is logged in and data is loading
  const shouldShowShimmer = user && (initialLoad || authLoading);

  if (shouldShowShimmer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <ShimmerHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ShimmerTaskGenerator />
              <ShimmerChart />
            </div>
            <ShimmerSavedTasks />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header
        completedTasksCount={completedTasksCount}
        pendingTasksCount={pendingTasksCount}
        completionRate={completionRate}
        user={user}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Top Row - Task Generation and Task Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {user && generatingTasks ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <ShimmerGeneratedTaskItem key={i} />
                ))}
              </div>
            ) : (
              <TaskGenerator
                topic={topic}
                setTopic={setTopic}
                loading={generatingTasks}
                generateTasks={generateTasks}
                generatedTasks={generatedTasks}
                isTaskSaved={isTaskSaved}
                savingTasks={savingTasks}
                saveTask={saveTask}
                saveAllGeneratedTasks={saveAllGeneratedTasks}
                totalSavedTasks={totalSavedTasks}
                completionRate={completionRate}
                completedTasks={completedTasksCount}
                pendingTasks={pendingTasksCount}
              />
            )}

            {user && loadingSavedTasks ? (
              <ShimmerChart />
            ) : (
              <TaskDistributionCard
                savedTasks={savedTasks}
                generatedNotSavedCount={generatedNotSavedCount}
              />
            )}
          </div>

          {/* Bottom Row - Saved Tasks */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900 text-xl">Saved Tasks by Topic</CardTitle>
            </CardHeader>
            <CardContent>
              {user && loadingSavedTasks ? (
                <ShimmerSavedTasks />
              ) : (
                <SavedTasks
                  groupedTasks={groupedTasks}
                  toggleTaskCompletion={toggleTaskCompletion}
                  navigateToUpdate={navigateToUpdate}
                  deleteTask={deleteTask}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}