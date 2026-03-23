import type { Task, TaskStatus } from '../../types';
import TaskItem from './TaskItem';
import { ClipboardList } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onUpdateStatus: (id: string, newStatus: TaskStatus) => void;
  onDelete: (id: string) => void;
}

export default function TaskList({ tasks, onUpdateStatus, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <ClipboardList className="w-16 h-16 mb-4 opacity-50" />
        <p className="text-lg font-medium">Chưa có công việc nào!</p>
        <p className="text-sm">Hãy thêm một công việc mới ở form bên cạnh.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 mt-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdateStatus={onUpdateStatus}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}