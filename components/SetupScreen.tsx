import React, { useState } from 'react';
import type { ClassInfo } from '../types';
import { MortarBoardIcon } from './icons';

interface SetupScreenProps {
  onSave: (info: ClassInfo) => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onSave }) => {
  const [className, setClassName] = useState('');
  const [teacher1, setTeacher1] = useState('');
  const [teacher2, setTeacher2] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (className.trim() && teacher1.trim() && teacher2.trim()) {
      onSave({
        className,
        teachers: [{ name: teacher1 }, { name: teacher2 }],
        healthSchedule: [],
        menu: [
            { id: 'monday', day: 'Thứ Hai', meals: '' },
            { id: 'tuesday', day: 'Thứ Ba', meals: '' },
            { id: 'wednesday', day: 'Thứ Tư', meals: '' },
            { id: 'thursday', day: 'Thứ Năm', meals: '' },
            { id: 'friday', day: 'Thứ Sáu', meals: '' },
        ]
      });
    } else {
      alert('Vui lòng điền đầy đủ thông tin.');
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-blue-50">
      <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
            <MortarBoardIcon className="w-12 h-12 text-blue-500 mx-auto mb-3" />
            <h1 className="text-3xl font-bold text-blue-600">Thiết lập Lớp học của bạn</h1>
            <p className="text-gray-600 mt-2">Vui lòng nhập thông tin ban đầu để bắt đầu sử dụng.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="className" className="block text-sm font-medium text-gray-700">Tên lớp học</label>
            <input
              type="text"
              id="className"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Ví dụ: Lớp Lá 1"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="teacher1" className="block text-sm font-medium text-gray-700">Tên Giáo viên 1</label>
            <input
              type="text"
              id="teacher1"
              value={teacher1}
              onChange={(e) => setTeacher1(e.target.value)}
              placeholder="Ví dụ: Nguyễn Thị Mai"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
           <div>
            <label htmlFor="teacher2" className="block text-sm font-medium text-gray-700">Tên Giáo viên 2</label>
            <input
              type="text"
              id="teacher2"
              value={teacher2}
              onChange={(e) => setTeacher2(e.target.value)}
              placeholder="Ví dụ: Trần Minh Anh"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Lưu và Bắt đầu
          </button>
        </form>
      </div>
    </div>
  );
};