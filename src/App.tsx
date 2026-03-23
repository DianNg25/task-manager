import { useState, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Task, TaskStatus } from './types';
import TaskForm from './components/task/TaskForm';
import TaskList from './components/task/TaskList';
import Swal from 'sweetalert2'; // <-- Import thư viện xịn xò vào đây
import { 
  LayoutGrid, 
  CheckCircle2, 
  AlertCircle, 
  ListTodo,
  Search,
  Filter
} from 'lucide-react';

function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('my-tasks', []);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'ALL'>('ALL');

  // Nâng cấp: Hiển thị Toast thông báo khi thêm thành công
  const handleAddTask = (newTask: Task) => {
    setTasks([newTask, ...tasks]);
    
    // Cấu hình Toast nhỏ gọn ở góc màn hình
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Đã thêm công việc mới!',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };
  
  const handleUpdateStatus = (id: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, status: newStatus } : task));
  };

  // Nâng cấp: Thay thế window.confirm bằng Popup xịn xò
  const handleDeleteTask = (id: string) => {
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: "Công việc này sẽ bị xóa và không thể khôi phục!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', // Màu đỏ Tailwind (red-500)
      cancelButtonColor: '#9ca3af', // Màu xám (gray-400)
      confirmButtonText: 'Đúng, xóa nó!',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        setTasks(tasks.filter(task => task.id !== id));
        
        // Hiện thông báo đã xóa nhanh
        Swal.fire({
          title: 'Đã xóa!',
          text: 'Công việc đã được dọn dẹp.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'DONE').length;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const overdue = tasks.filter(t => {
      if (!t.deadline || t.status === 'DONE') return false;
      return new Date(t.deadline) < today;
    }).length;

    return { total, completed, overdue };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = filterStatus === 'ALL' || task.status === filterStatus;
      
      return matchSearch && matchStatus;
    });
  }, [tasks, searchQuery, filterStatus]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        <header className="flex flex-col items-center justify-center gap-2 mb-10 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <LayoutGrid className="w-9 h-9 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Quản Lý Công Việc Cá Nhân
            </h1>
          </div>
          <p className="text-gray-500">Sắp xếp công việc, tối ưu thời gian.</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 lg:sticky lg:top-8 h-fit">
            <TaskForm onAddTask={handleAddTask} />
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
                  <ListTodo className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Tổng số</div>
              </div>
              
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2">
                <div className="p-2 bg-green-50 text-green-600 rounded-full">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold text-gray-800">{stats.completed}</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Đã xong</div>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2">
                <div className="p-2 bg-red-50 text-red-600 rounded-full">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold text-gray-800">{stats.overdue}</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Quá hạn</div>
              </div>
            </div>

            <div className="bg-white p-6 md:p-7 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
              
              <div className="flex flex-col sm:flex-row gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Tìm kiếm công việc..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white outline-none transition-colors text-sm"
                  />
                </div>

                <div className="relative min-w-[160px]">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="w-4 h-4 text-gray-400" />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'ALL')}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white outline-none transition-colors text-sm appearance-none cursor-pointer font-medium text-gray-700"
                  >
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="TODO">Cần làm</option>
                    <option value="IN_PROGRESS">Đang làm</option>
                    <option value="DONE">Hoàn thành</option>
                  </select>
                </div>
              </div>

              <TaskList 
                tasks={filteredTasks} 
                onUpdateStatus={handleUpdateStatus} 
                onDelete={handleDeleteTask} 
              />
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

export default App;