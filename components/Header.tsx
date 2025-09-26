import React from 'react';
import type { ViewType } from '../App';
import { SparklesIcon, LogoutIcon } from './icons';

interface HeaderProps {
    userRole: 'teacher' | 'parent' | null;
    onLogout: () => void;
    currentView: ViewType;
    onChangeView: (view: ViewType) => void;
}

export const Header: React.FC<HeaderProps> = ({ userRole, onLogout, currentView, onChangeView }) => {
    return (
        <header className="bg-white shadow-md p-4 flex justify-between items-center no-print">
            <div className="flex items-center space-x-3">
                <SparklesIcon className="w-8 h-8 text-yellow-400" />
                <h1 className="text-2xl font-bold text-blue-600">Trình Theo Dõi Tăng Trưởng</h1>
            </div>
            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-full">
                    <button 
                        onClick={() => onChangeView('dashboard')}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-300 ${currentView === 'dashboard' ? 'bg-blue-500 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                        Bảng điều khiển
                    </button>
                    <button 
                        onClick={() => onChangeView('class_report')}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-300 ${currentView === 'class_report' ? 'bg-blue-500 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                        Báo cáo Lớp
                    </button>
                </div>
                
                <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700">
                        Vai trò: <span className="font-bold text-blue-600">{userRole === 'teacher' ? 'Giáo viên' : 'Phụ huynh'}</span>
                    </span>
                     <button onClick={onLogout} className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors">
                        <LogoutIcon className="w-4 h-4" />
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </div>
        </header>
    );
};
