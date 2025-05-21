'use client';

import React, { useState, useEffect, Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BASE_URL } from "@/lib/constants";
import { toast } from "sonner";
import { useAuth } from "../../lib/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";


function LoadingState() {
  return (
    <div className="text-center py-8">
      <p>Loading task information...</p>
    </div>
  );
}

function UpdateTaskForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  
  const taskId = searchParams.get("id");
  const taskTitle = searchParams.get("title") || "";
  const taskTopic = searchParams.get("topic") || "";
  
  const [title, setTitle] = useState(taskTitle);
  const [topic, setTopic] = useState(taskTopic);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && (!taskId || !user)) {
      toast.error("Invalid task or not logged in");
      router.push("/dashboard");
    }
  }, [taskId, user, authLoading, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in");
      return;
    }
    
    if (!title.trim()) {
      toast.error("Task title cannot be empty");
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await fetch(`${BASE_URL}/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: title.trim(),
          topic: topic.trim() || undefined 
        }),
      });
      
      if (res.ok) {
        toast.success("Task updated successfully!");
        router.push("/dashboard");
      } else {
        const errorText = await res.text();
        console.error("Failed to update task:", res.status, errorText);
        toast.error(`Failed to update task: ${res.status}`);
      }
    } catch (err) {
      console.error("Error updating task:", err);
      toast.error("Error updating task");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  if (authLoading) {
    return (
      <div className="text-center py-8">
        <p>Checking authentication...</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Update Task</h1>
        <p className="text-gray-600">Edit your task details below</p>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium">
                Task Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="topic" className="block text-sm font-medium">
                Topic (Category)
              </label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter topic (optional)"
              />
            </div>
            
            <div className="pt-4 flex justify-end space-x-3">
              <Button 
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={loading || !title.trim()}
                className="cursor-pointer"
              >
                {loading ? "Updating..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

export default function UpdatePage() {
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <Suspense fallback={<LoadingState />}>
        <UpdateTaskForm />
      </Suspense>
    </main>
  );
}