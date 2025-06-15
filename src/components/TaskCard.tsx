import type { Task } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, CalendarDays, AlertTriangle, Info, ChevronsRight } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from './ui/button';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isDragging }) => {
  const isUrgent = task.priority === 1;
  const deadlineDate = new Date(task.deadline);
  const now = new Date();
  const isPastDue = deadlineDate < now && task.status !== 'Done';

  return (
    <Card
      className={`task-card mb-4 text-card-foreground shadow-lg rounded-lg border-l-4 ${
        isUrgent ? 'border-accent' : 'border-primary'
      } ${isDragging ? 'opacity-50 ring-2 ring-primary' : ''} bg-slate-900/80 backdrop-blur-sm`}
      data-ai-hint="task logistics"
    >
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-headline flex justify-between items-center">
          {task.task}
          {task.priority !== undefined && (
             <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className={`h-6 w-6 ${isUrgent ? 'text-accent' : 'text-primary'}`}>
                  <Info className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4 bg-popover text-popover-foreground">
                <div className="grid gap-2">
                  <h4 className="font-medium leading-none">AI Prioritization</h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Priority:</strong> {task.priority}
                  </p>
                  {task.explanation && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Explanation:</strong> {task.explanation}
                    </p>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">Shipment ID: {task.shipmentId}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-sm">
        <div className="flex items-center mb-2 text-muted-foreground">
          <Users className="h-4 w-4 mr-2 text-neutral-400" />
          <span>{task.assignee}</span>
        </div>
        <div className={`flex items-center mb-2 ${isPastDue ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
          <CalendarDays className="h-4 w-4 mr-2 text-neutral-400" />
          <span>Deadline: {new Date(task.deadline).toLocaleDateString()}</span>
          {isPastDue && <AlertTriangle className="h-4 w-4 ml-2 text-destructive" />}
        </div>
        {task.dependencies.length > 0 && (
          <div className="flex items-center text-xs text-muted-foreground">
             <ChevronsRight className="h-4 w-4 mr-1 text-neutral-400" />
            <span>Depends on: {task.dependencies.join(', ')}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Badge variant={task.status === 'Done' ? 'default' : task.status === 'In-Progress' ? 'secondary' : 'outline'}
               className={task.status === 'Done' ? 'bg-primary/80 text-primary-foreground' : task.status === 'In-Progress' ? 'bg-blue-500/80 text-white' : 'border-neutral-500 text-neutral-300'}>
          {task.status}
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
