import type { Task, TaskStatus } from '@/types';
import TaskCard from './TaskCard';
import { ScrollArea } from '@/components/ui/scroll-area';

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>, status: TaskStatus) => void;
  onDragStartTask: (event: React.DragEvent<HTMLDivElement>, taskId: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, status, tasks, onDragOver, onDrop, onDragStartTask }) => {
  
  const getColumnBgColor = () => {
    if (status === 'To-Do') return 'bg-secondary/10';
    if (status === 'In-Progress') return 'bg-blue-500/10';
    if (status === 'Done') return 'bg-primary/10';
    return 'bg-card';
  };

  const getColumnTitleColor = () => {
    if (status === 'To-Do') return 'bg-neutral-600';
    if (status === 'In-Progress') return 'bg-blue-600';
    if (status === 'Done') return 'bg-green-600';
    return 'bg-primary';
  }

  return (
    <div
      className={`flex-1 p-1 rounded-lg shadow-md min-h-[calc(100vh-200px)] ${getColumnBgColor()}`}
      onDragOver={onDragOver}
      onDrop={(event) => onDrop(event, status)}
      aria-label={`${title} column`}
    >
      <h2 className={`column-title text-center ${getColumnTitleColor()}`}>{title} ({tasks.length})</h2>
      <ScrollArea className="h-[calc(100vh-280px)] p-3">
        {tasks.length === 0 && <p className="text-sm text-muted-foreground text-center mt-4">No tasks here.</p>}
        {tasks.map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={(event) => onDragStartTask(event, task.id)}
            tabIndex={0} // Make draggable elements focusable
            aria-label={`Task: ${task.task}, Status: ${task.status}`}
          >
            <TaskCard task={task} />
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

export default KanbanColumn;
