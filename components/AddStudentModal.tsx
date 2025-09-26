
import React, { useState } from 'react';
import { Gender } from '../types';
import type { Student } from '../types';
import { fileToBase64 } from '../utils/helpers';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (student: Omit<Student, 'id' | 'measurements'>) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, onAddStudent }) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<Gender>(Gender.MALE);
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [parentPhone, setParentPhone] = useState('');
  const [healthNotes, setHealthNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && dob) {
      onAddStudent({ name, dob, gender, photo, parentPhone, healthNotes });
      setName('');
      setDob('');
      setGender(Gender.MALE);
      setPhoto(undefined);
      setParentPhone('');
      setHealthNotes('');
      onClose();
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setPhoto(base64);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Thêm học sinh mới</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên học sinh</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Ngày sinh</label>
            <input type="date" id="dob" value={dob} onChange={(e) => setDob(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Giới tính</label>
            <select value={gender} onChange={(e) => setGender(e.target.value as Gender)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value={Gender.MALE}>Nam</option>
              <option value={Gender.FEMALE}>Nữ</option>
            </select>
          </div>
          <div>
            <label htmlFor="parentPhone" className="block text-sm font-medium text-gray-700">Số điện thoại PH</label>
            <input type="tel" id="parentPhone" value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="09..."/>
          </div>
           <div>
            <label htmlFor="healthNotes" className="block text-sm font-medium text-gray-700">Ghi chú sức khỏe</label>
            <textarea id="healthNotes" value={healthNotes} onChange={(e) => setHealthNotes(e.target.value)} rows={2} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Bình thường, dị ứng..."/>
          </div>
          <div>
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Ảnh đại diện</label>
            <input type="file" id="photo" accept="image/*" onChange={handlePhotoUpload} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Hủy</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Thêm</button>
          </div>
        </form>
      </div>
    </div>
  );
};