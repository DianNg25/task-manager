import { Trash2, Calendar, AlertCircle } from 'lucide-react';
import type { Task, TaskStatus } from '../../types';

interface TaskItemProps {
  task: Task;
  onUpdateStatus: (id: string, newStatus: TaskStatus) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onUpdateStatus, onDelete }: TaskItemProps) {
  const getDeadlineStatus = () => {
    if (!task.deadline || task.status === 'DONE') return 'normal';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(task.deadline);
    
    if (deadlineDate < today) return 'overdue';
    if (deadlineDate.getTime() === today.getTime()) return 'today';
    return 'normal';
  };

  const deadlineStatus = getDeadlineStatus();

  const cardClasses = `p-4 rounded-xl border transition-all ${
    task.status === 'DONE' 
      ? 'bg-gray-50 border-gray-200 opacity-75'
      : deadlineStatus === 'overdue'
      ? 'bg-red-50 border-red-200'
      : deadlineStatus === 'today'
      ? 'bg-orange-50 border-orange-200'
      : 'bg-white border-gray-200 hover:shadow-md'
  }`;

  return (
    <div className={cardClasses}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex-1">
          <h3 className={`font-semibold text-lg ${task.status === 'DONE' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {task.title}
          </h3>
          
          {task.deadline && (
            <div className={`flex items-center gap-1.5 text-sm mt-1.5 ${
              deadlineStatus === 'overdue' ? 'text-red-600 font-medium' 
              : deadlineStatus === 'today' ? 'text-orange-600 font-medium'
              : 'text-gray-500'
            }`}>
              {deadlineStatus === 'overdue' ? <AlertCircle className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
              <span>Hạn chót: {new Date(task.deadline).toLocaleDateString('vi-VN')}</span>
              {deadlineStatus === 'overdue' && <span className="ml-1 text-xs px-2 py-0.5 bg-red-100 rounded-full">Quá hạn</span>}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <select
            value={task.status}
            onChange={(e) => onUpdateStatus(task.id, e.target.value as TaskStatus)}
            className={`text-sm rounded-lg border px-3 py-1.5 outline-none font-medium cursor-pointer ${
              task.status === 'TODO' ? 'bg-gray-100 text-gray-700 border-gray-300'
              : task.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-green-50 text-green-700 border-green-200'
            }`}
          >
            <option value="TODO">Cần làm</option>
            <option value="IN_PROGRESS">Đang làm</option>
            <option value="DONE">Hoàn thành</option>
          </select>

          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Xóa công việc"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}