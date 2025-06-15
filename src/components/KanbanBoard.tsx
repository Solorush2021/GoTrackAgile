'use client';

import type { Task, TaskStatus } from '@/types';
import { aiTaskPrioritization, AiTaskPrioritizationInput } from '@/ai/flows/ai-task-prioritization';
import KanbanColumn from './KanbanColumn';
import { Button } from '@/components/ui/button';
import { ListFilter, Archive, Download, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect } from 'react';

const initialTasksData: Task[] = [
  {id: "1", task: "Inspect Incoming Goods for SHP-001", shipmentId: "SHP-001", deadline: "2024-08-15", dependencies: [], assignee: "Warehouse Team", status: "To-Do"},
  {id: "2", task: "Allocate Storage for SHP-001", shipmentId: "SHP-001", deadline: "2024-08-16", dependencies: ["1"], assignee: "Alice Johnson", status: "To-Do"},
  {id: "3", task: "Prepare Customs Docs for SHP-002", shipmentId: "SHP-002", deadline: "2024-08-10", dependencies: [], assignee: "Bob Lee", status: "To-Do"},
  {id: "4", task: "Schedule Pickup for SHP-002", shipmentId: "SHP-002", deadline: "2024-08-12", dependencies: ["3"], assignee: "Carol White", status: "In-Progress"},
  {id: "5", task: "Quality Check for SHP-003", shipmentId: "SHP-003", deadline: "2024-08-20", dependencies: [], assignee: "David Green", status: "To-Do"},
  {id: "6", task: "Package SHP-003 for Dispatch", shipmentId: "SHP-003", deadline: "2024-08-22", dependencies: ["5"], assignee: "Eve Black", status: "To-Do"},
  {id: "7", task: "Confirm Delivery of SHP-004", shipmentId: "SHP-004", deadline: "2024-08-05", dependencies: [], assignee: "Logistics AI", status: "Done"}
];

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [archivedTasks, setArchivedTasks] = useState<Task[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading tasks, preserving explanations if any task already has one
    // In a real app, this would be an API call
    const loadedTasks = initialTasksData.map(task => ({
      ...task,
      explanation: task.explanation || undefined, // Keep existing explanation
      priority: task.priority || undefined // Keep existing priority
    }));
    setTasks(loadedTasks);
  }, []);


  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, taskId: string) => {
    event.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, newStatus: TaskStatus) => {
    const taskId = event.dataTransfer.getData('taskId');
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handlePrioritizeTasks = async () => {
    setIsLoadingAI(true);
    try {
      // Filter out Done tasks from AI input, or handle as per AI's capability
      const tasksToPrioritize: AiTaskPrioritizationInput = tasks
        .filter(task => task.status !== 'Done')
        .map(({priority, explanation, ...taskRest}) => taskRest); // Strip previous priority/explanation for AI

      if (tasksToPrioritize.length === 0) {
        toast({ title: "No tasks to prioritize", description: "All tasks are marked as Done or there are no tasks." });
        setIsLoadingAI(false);
        return;
      }

      const prioritizedOutput = await aiTaskPrioritization(tasksToPrioritize);
      
      setTasks(prevTasks => {
        const updatedTasks = prevTasks.map(task => {
          const aiData = prioritizedOutput.find(pt => pt.id === task.id);
          if (aiData) {
            return { ...task, priority: aiData.priority, explanation: aiData.explanation };
          }
          // If task was 'Done' and not sent to AI, or not found in AI output for some reason
          return task; 
        });
        
        // Sort primarily 'To-Do' tasks by new priority. Others can maintain order or also be sorted.
        return updatedTasks.sort((a, b) => {
          if (a.status === 'To-Do' && b.status === 'To-Do') {
            return (a.priority ?? Infinity) - (b.priority ?? Infinity);
          }
          if (a.status === 'To-Do') return -1; // To-Do tasks first
          if (b.status === 'To-Do') return 1;
          return (a.priority ?? Infinity) - (b.priority ?? Infinity); // Sort other tasks by priority as well
        });
      });

      toast({ title: "Tasks Prioritized", description: "AI has reordered tasks based on priority." });
    } catch (error) {
      console.error("AI Prioritization Error:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to prioritize tasks with AI." });
    }
    setIsLoadingAI(false);
  };
  
  const handleArchiveDoneTasks = () => {
    const doneTasks = tasks.filter(task => task.status === 'Done');
    if (doneTasks.length === 0) {
      toast({ title: "No tasks to archive", description: "There are no tasks in the 'Done' column." });
      return;
    }
    setArchivedTasks(prevArchived => [...prevArchived, ...doneTasks]);
    setTasks(prevTasks => prevTasks.filter(task => task.status !== 'Done'));
    toast({ title: "Tasks Archived", description: `${doneTasks.length} task(s) moved to archive.` });
  };

  const generateCSV = () => {
    const completedTasks = tasks.filter(task => task.status === 'Done');
    if (completedTasks.length === 0) {
      toast({ title: "No completed tasks", description: "There are no tasks in 'Done' to report." });
      return;
    }
    const headers = ["ID", "Task", "Shipment ID", "Deadline", "Assignee", "Status", "Priority", "Explanation"];
    const rows = completedTasks.map(task => [
      task.id,
      task.task,
      task.shipmentId,
      task.deadline,
      task.assignee,
      task.status,
      task.priority ?? 'N/A',
      task.explanation ?? 'N/A'
    ].join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "completed_tasks_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Report Generated", description: "CSV report downloaded." });
    setIsReportDialogOpen(false);
  };

  const columns: { title: string; status: TaskStatus }[] = [
    { title: 'To-Do', status: 'To-Do' },
    { title: 'In-Progress', status: 'In-Progress' },
    { title: 'Done', status: 'Done' },
  ];

  return (
    <div className="flex flex-col flex-grow p-4 md:p-6 lg:p-8">
      <div className="flex flex-wrap gap-2 mb-6 justify-center md:justify-end">
        <Button onClick={handlePrioritizeTasks} disabled={isLoadingAI} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          {isLoadingAI ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ListFilter className="mr-2 h-4 w-4" />}
          AI Prioritize Tasks
        </Button>
        <Button onClick={() => setIsReportDialogOpen(true)} variant="outline" className="border-accent text-accent hover:bg-accent/10 hover:text-accent">
          <Download className="mr-2 h-4 w-4" />
          Generate Status Report
        </Button>
        <Button onClick={handleArchiveDoneTasks} variant="outline">
          <Archive className="mr-2 h-4 w-4" />
          Archive Done Tasks
        </Button>
      </div>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8 flex-grow">
        {columns.map((col) => (
          <KanbanColumn
            key={col.status}
            title={col.title}
            status={col.status}
            tasks={tasks.filter((task) => task.status === col.status)}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragStartTask={handleDragStart}
          />
        ))}
      </div>
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="bg-background text-foreground">
          <DialogHeader>
            <DialogTitle className="font-headline">Generate Status Report</DialogTitle>
            <DialogDescription>
              This will generate a CSV report of all tasks currently in the 'Done' column.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={generateCSV} className="bg-primary hover:bg-primary/90 text-primary-foreground">Download CSV</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KanbanBoard;
