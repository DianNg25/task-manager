import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import type { Task } from '../../types';

interface TaskFormProps {
  onAddTask: (task: Task) => void;
}

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');

  const todayString = new Date().toISOString().split('T')[0];

  const executeAddTask = () => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      status: 'TODO',
      deadline: deadline || undefined,
    };

    onAddTask(newTask);
    setTitle('');
    setDeadline('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (deadline) {
      const selectedDate = new Date(deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0); 
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        Swal.fire({
          icon: 'error',
          title: 'Deadline không hợp lệ!',
          text: 'Vui lòng chọn ngày trong tương lai hoặc hôm nay.',
          confirmButtonColor: '#3b82f6'
        });
        return; 
      }
      executeAddTask();
    } 
    else {
      Swal.fire({
        title: 'Chưa chọn deadline!',
        text: "Bạn có muốn lưu công việc này vào danh sách 'Vô thời hạn' không?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#9ca3af',
        confirmButtonText: 'Có, cứ lưu!',
        cancelButtonText: 'Để tôi chọn ngày'
      }).then((result) => {
        if (result.isConfirmed) {
          executeAddTask();
        }
      });
    }
  };

  return (
    <div className="bg-white p-7 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2.5">
        <PlusCircle className="w-6 h-6 text-blue-500" />
        Thêm công việc mới
      </h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-600 mb-1.5">
            Tên công việc <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="VD: Học TypeScript cơ bản..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-colors"
            required
          />
        </div>

        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-600 mb-1.5">
            Deadline <span className="text-xs font-normal text-gray-400">(Không bắt buộc)</span>
          </label>
          <input
            id="deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            type="date"
            min={todayString} 
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-colors"
          />
        </div>

        <button
          type="submit"
          className="mt-2 flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded-xl transition-all shadow-sm active:scale-[0.98]"
        >
          <PlusCircle className="w-5 h-5" />
          Thêm Công Việc
        </button>
      </form>
    </div>
  );
}