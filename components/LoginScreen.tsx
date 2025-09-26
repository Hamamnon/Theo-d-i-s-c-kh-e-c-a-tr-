import React, { useState } from 'react';
import type { UserRole } from '../App';
import { SparklesIcon } from './icons';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [phone, setPhone] = useState('');

  const handleLogin = (role: UserRole) => {
    if (phone.trim().length > 5) { // Simple validation
        onLogin(role);
    } else {
        alert("Vui lòng nhập một số điện thoại hợp lệ.");
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-blue-50">
      <div className="w-full max-w-sm p-8 space-y-8 bg-white rounded-2xl shadow-xl text-center">
        <div className="flex flex-col items-center">
          <SparklesIcon className="w-12 h-12 text-yellow-400 mb-2" />
          <h1 className="text-3xl font-bold text-blue-600">Chào mừng bạn!</h1>
          <p className="text-gray-600 mt-2">Đăng nhập để theo dõi sự phát triển của các bé.</p>
        </div>
        
        <div className="space-y-4">
            <div>
                <label htmlFor="phone" className="sr-only">Số điện thoại</label>
                <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập số điện thoại của bạn"
                className="w-full px-4 py-3 text-center border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleLogin('teacher')}
            className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Đăng nhập với vai trò Giáo viên
          </button>
          <button
            onClick={() => handleLogin('parent')}
            className="w-full px-4 py-3 font-semibold text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-200"
          >
            Đăng nhập với vai trò Phụ huynh
          </button>
        </div>
      </div>
    </div>
  );
};
