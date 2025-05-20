"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BASE_URL } from "@/lib/constants";
import { toast } from "sonner";
import { useAuth } from "../../lib/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";

export default function UpdatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  
  // Get task details from URL parameters
  const taskId = searchParams.get("id");
  const taskTitle = searchParams.get("title") || "";
  const taskTopic = searchParams.get("topic") || "";
  
  const [title, setTitle] = useState(taskTitle);
  const [topic, setTopic] = useState(taskTopic);
  const [loading, setLoading] = useState(false);

  // Redirect if no taskId or user is not logged in
  useEffect(() => {
    if (!authLoading && (!taskId || !user)) {
      toast.error("Invalid task or not logged in");
      router.push("/dashboard");
    }
  }, [taskId, user, authLoading, router]);

  // Handle form submission
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
          topic: topic.trim() || undefined  // Only send topic if it's not empty
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

  // Cancel and return to dashboard
  const handleCancel = () => {
    router.push("/dashboard");
  };

  if (authLoading) {
    return (
      <main className="p-6 max-w-3xl mx-auto">
        <div className="text-center py-8">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
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
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={loading || !title.trim()}
              >
                {loading ? "Updating..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
