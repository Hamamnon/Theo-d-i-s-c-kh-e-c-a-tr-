import React, { useState, useEffect } from 'react';
import { UserIcon, CalendarIcon, ClipboardListIcon, MortarBoardIcon, EditIcon, SaveIcon, TrashIcon, PlusIcon } from './icons';
import type { ClassInfo, HealthEvent } from '../types';
import { formatDate } from '../utils/helpers';
import type { UserRole } from '../App';

interface DashboardProps {
  classInfo: ClassInfo;
  studentCount: number;
  userRole: UserRole;
  onUpdateClassInfo: (info: ClassInfo) => void;
  onSelectStudent: () => void;
}


export const Dashboard: React.FC<DashboardProps> = ({ classInfo, studentCount, userRole, onUpdateClassInfo, onSelectStudent }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableInfo, setEditableInfo] = useState<ClassInfo>(classInfo);

  useEffect(() => {
    setEditableInfo(classInfo);
  }, [classInfo]);

  const handleSave = () => {
    onUpdateClassInfo(editableInfo);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditableInfo(classInfo);
    setIsEditing(false);
  };

  const handleMenuChange = (id: string, value: string) => {
    const updatedMenu = editableInfo.menu.map(item =>
      item.id === id ? { ...item, meals: value } : item
    );
    setEditableInfo({ ...editableInfo, menu: updatedMenu });
  };

  const handleScheduleChange = (id: string, field: keyof HealthEvent, value: string) => {
    const updatedSchedule = editableInfo.healthSchedule.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setEditableInfo({ ...editableInfo, healthSchedule: updatedSchedule });
  };
  
  const handleAddScheduleItem = () => {
      const newItem: HealthEvent = { id: `event-${Date.now()}`, date: '', title: '', description: '' };
      setEditableInfo({ ...editableInfo, healthSchedule: [...editableInfo.healthSchedule, newItem] });
  };

  const handleRemoveScheduleItem = (id: string) => {
      setEditableInfo({ ...editableInfo, healthSchedule: editableInfo.healthSchedule.filter(item => item.id !== id) });
  };

  const sortedSchedule = (schedule: HealthEvent[]) => [...schedule].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


  return (
    <main className="flex-1 p-6 overflow-y-auto bg-blue-50">
        <div className="mb-6 flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Tổng quan {classInfo.className}</h1>
                <p className="text-gray-600">Chào mừng bạn quay trở lại!</p>
            </div>
            {userRole === 'teacher' && (
                <div className="flex space-x-2">
                    {isEditing ? (
                        <>
                            <button onClick={handleSave} className="px-4 py-2 flex items-center space-x-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                                <SaveIcon className="w-5 h-5" />
                                <span>Lưu</span>
                            </button>
                            <button onClick={handleCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition">
                                Hủy
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="px-4 py-2 flex items-center space-x-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                            <EditIcon className="w-5 h-5" />
                            <span>Chỉnh sửa</span>
                        </button>
                    )}
                </div>
            )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                    <MortarBoardIcon className="w-8 h-8 text-blue-500"/>
                </div>
                <div>
                    <p className="text-sm text-gray-500">GV Phụ trách</p>
                    <p className="text-lg font-bold text-gray-800">{classInfo.teachers[0].name}</p>
                    <p className="text-lg font-bold text-gray-800">{classInfo.teachers[1].name}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                    <UserIcon className="w-8 h-8 text-green-500"/>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Sĩ số lớp</p>
                    <p className="text-xl font-bold text-gray-800">{studentCount} học sinh</p>
                </div>
            </div>
             <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                    <CalendarIcon className="w-8 h-8 text-yellow-500"/>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Sự kiện tiếp theo</p>
                    <p className="text-lg font-bold text-gray-800">
                        {sortedSchedule(classInfo.healthSchedule)[0] ? formatDate(sortedSchedule(classInfo.healthSchedule)[0].date) : 'Chưa có'}
                    </p>
                </div>
            </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Schedule */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <CalendarIcon className="w-6 h-6 mr-3 text-blue-500" />
                    Lịch hoạt động & Sức khỏe
                </h2>
                <ul className="space-y-4">
                    {isEditing ? (
                        <>
                            {editableInfo.healthSchedule.map(item => (
                                <li key={item.id} className="space-y-2 bg-gray-50 p-3 rounded-md border relative">
                                    <input type="date" value={item.date} onChange={e => handleScheduleChange(item.id, 'date', e.target.value)} className="w-full p-1 border rounded" />
                                    <input type="text" placeholder="Tiêu đề" value={item.title} onChange={e => handleScheduleChange(item.id, 'title', e.target.value)} className="w-full p-1 border rounded font-semibold" />
                                    <input type="text" placeholder="Mô tả" value={item.description} onChange={e => handleScheduleChange(item.id, 'description', e.target.value)} className="w-full p-1 border rounded text-sm" />
                                    <button onClick={() => handleRemoveScheduleItem(item.id)} className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </li>
                            ))}
                            <button onClick={handleAddScheduleItem} className="w-full flex items-center justify-center mt-2 px-4 py-2 text-sm bg-blue-100 text-blue-700 font-semibold rounded-md hover:bg-blue-200">
                                <PlusIcon className="w-4 h-4 mr-2" /> Thêm sự kiện
                            </button>
                        </>
                    ) : (
                       sortedSchedule(classInfo.healthSchedule).map(item => (
                            <li key={item.id} className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-lg flex flex-col items-center justify-center">
                                    <span className="text-xs font-bold text-blue-600">THG {new Date(item.date).getMonth() + 1}</span>
                                    <span className="text-2xl font-bold text-blue-800">{new Date(item.date).getDate()}</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-700">{item.title}</p>
                                    <p className="text-sm text-gray-500">{item.description}</p>
                                </div>
                            </li>
                        ))
                    )}
                     {!isEditing && classInfo.healthSchedule.length === 0 && <p className="text-gray-500 text-sm">Chưa có lịch hoạt động nào.</p>}
                </ul>
            </div>
            
            {/* Menu */}
            <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-lg">
                 <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <ClipboardListIcon className="w-6 h-6 mr-3 text-green-500" />
                    Thực đơn tuần này
                </h2>
                <div className="space-y-3">
                    {isEditing ? (
                        editableInfo.menu.map(item => (
                            <div key={item.id} className="flex items-center text-sm">
                                <span className="font-bold text-gray-700 w-20 flex-shrink-0">{item.day}:</span>
                                <input type="text" value={item.meals} onChange={e => handleMenuChange(item.id, e.target.value)} className="w-full p-1 border rounded" placeholder="Nhập thực đơn..." />
                            </div>
                        ))
                    ) : (
                         classInfo.menu.map(item => (
                            <div key={item.id} className="flex items-start text-sm">
                                <span className="font-bold text-gray-700 w-20 flex-shrink-0">{item.day}:</span>
                                <span className="text-gray-600">{item.meals || <span className="italic text-gray-400">Chưa nhập</span>}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
        
         <div className="mt-8 text-center">
            <button onClick={onSelectStudent} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
                Xem chi tiết học sinh
            </button>
        </div>
    </main>
  );
};