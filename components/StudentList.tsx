import React from 'react';
import type { Student } from '../types';
import { UserIcon, PlusIcon } from './icons';

interface StudentListProps {
  students: Student[];
  selectedStudentId: string | null;
  onSelectStudent: (id: string) => void;
  onAddStudent: () => void;
  userRole: 'teacher' | 'parent';
}

export const StudentList: React.FC<StudentListProps> = ({ students, selectedStudentId, onSelectStudent, onAddStudent, userRole }) => {
  return (
    <aside className="w-1/4 bg-white p-4 overflow-y-auto border-r no-print">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-700">Danh sách học sinh</h2>
        {userRole === 'teacher' && (
          <button onClick={onAddStudent} className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-transform hover:scale-110">
            <PlusIcon className="w-5 h-5" />
          </button>
        )}
      </div>
      <ul className="space-y-2">
        {students.map((student) => (
          <li key={student.id}>
            <button
              onClick={() => onSelectStudent(student.id)}
              className={`w-full text-left p-3 rounded-lg flex items-center space-x-4 transition-all duration-200 ${
                selectedStudentId === student.id ? 'bg-blue-500 text-white shadow-lg scale-105' : 'hover:bg-gray-100 hover:translate-x-1'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                {student.photo ? (
                  <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className={`w-6 h-6 ${selectedStudentId === student.id ? 'text-blue-200' : 'text-gray-500'}`} />
                )}
              </div>
              <span className="font-semibold">{student.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};
