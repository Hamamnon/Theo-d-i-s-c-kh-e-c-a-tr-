import React, { useState, useEffect } from 'react';
import type { Student, Assessment } from '../types';
import { UserIcon, RulerIcon, WeightIcon, ChartIcon, EditIcon, SaveIcon } from './icons';
import { calculateAgeInMonths, formatDate } from '../utils/helpers';
import { GrowthChart } from './GrowthChart';
import { AssessmentCard } from './AssessmentCard';
import { MeasurementForm } from './MeasurementForm';

interface StudentDetailProps {
  student: Student;
  userRole: 'teacher' | 'parent';
  onAddMeasurement: (studentId: string, height: number, weight: number, date: string) => void;
  onUpdateAssessment: (studentId: string, measurementId: string, assessment: Assessment) => void;
  onUpdateStudentInfo: (studentId: string, updatedInfo: Partial<Pick<Student, 'parentPhone' | 'healthNotes'>>) => void;
}

export const StudentDetail: React.FC<StudentDetailProps> = ({ student, userRole, onAddMeasurement, onUpdateAssessment, onUpdateStudentInfo }) => {
  const latestMeasurement = student.measurements.length > 0 ? [...student.measurements].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] : null;
  const ageInMonths = latestMeasurement ? calculateAgeInMonths(student.dob, latestMeasurement.date) : calculateAgeInMonths(student.dob, new Date().toISOString().split('T')[0]);

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editableInfo, setEditableInfo] = useState({
    parentPhone: student.parentPhone || '',
    healthNotes: student.healthNotes || '',
  });

  useEffect(() => {
    setEditableInfo({
      parentPhone: student.parentPhone || '',
      healthNotes: student.healthNotes || '',
    });
    setIsEditingInfo(false);
  }, [student]);

  const handleInfoSave = () => {
    onUpdateStudentInfo(student.id, editableInfo);
    setIsEditingInfo(false);
  };

  const handleInfoCancel = () => {
    setEditableInfo({
      parentPhone: student.parentPhone || '',
      healthNotes: student.healthNotes || '',
    });
    setIsEditingInfo(false);
  };

  const handleAddMeasurement = (height: number, weight: number, date: string) => {
    onAddMeasurement(student.id, height, weight, date);
  };
  
  return (
    <main className="flex-1 p-6 overflow-y-auto bg-blue-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 flex items-center space-x-6">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden ring-4 ring-blue-200 shadow-md">
            {student.photo ? (
                <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
            ) : (
                <UserIcon className="w-12 h-12 text-gray-500" />
            )}
        </div>
        <div>
            <h2 className="text-3xl font-bold text-gray-800">{student.name}</h2>
            <p className="text-lg text-gray-600">{student.gender}, {ageInMonths} tháng tuổi</p>
            <p className="text-sm text-gray-500">Ngày sinh: {formatDate(student.dob)}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Thông tin bổ sung</h3>
            {userRole === 'teacher' && !isEditingInfo && (
            <button
                onClick={() => setIsEditingInfo(true)}
                className="flex items-center px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
            >
                <EditIcon className="w-4 h-4 mr-2" />
                Cập nhật
            </button>
            )}
        </div>

        {isEditingInfo ? (
            <div className="space-y-4">
            <div>
                <label htmlFor="parentPhone" className="block text-sm font-medium text-gray-700">SĐT Phụ huynh</label>
                <input
                type="tel"
                id="parentPhone"
                value={editableInfo.parentPhone}
                onChange={(e) => setEditableInfo({ ...editableInfo, parentPhone: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <label htmlFor="healthNotes" className="block text-sm font-medium text-gray-700">Ghi chú sức khỏe</label>
                <textarea
                id="healthNotes"
                value={editableInfo.healthNotes}
                onChange={(e) => setEditableInfo({ ...editableInfo, healthNotes: e.target.value })}
                rows={3}
                placeholder="Ví dụ: Dị ứng sữa, hen suyễn..."
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div className="flex justify-end space-x-3 pt-2">
                <button onClick={handleInfoCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Hủy</button>
                <button onClick={handleInfoSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
                <SaveIcon className="w-4 h-4 mr-2" />
                Lưu
                </button>
            </div>
            </div>
        ) : (
            <div className="space-y-4 text-gray-700">
                <div className="flex items-center">
                    <p className="font-semibold w-32">SĐT PH:</p>
                    <p>{student.parentPhone || <span className="text-gray-400 italic">Chưa cập nhật</span>}</p>
                </div>
                <div className="flex items-start">
                    <p className="font-semibold w-32">Sức khỏe:</p>
                    <p className="flex-1">{student.healthNotes || <span className="text-gray-400 italic">Bình thường</span>}</p>
                </div>
                <div className="border-t my-2"></div>
                <div className="flex items-center space-x-8 text-gray-600">
                    <span className="font-semibold">Điểm danh trong ngày:</span>
                    <span className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span> Ăn
                    </span>
                    <span className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span> Ngủ
                    </span>
                    <span className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span> Học
                    </span>
                </div>
            </div>
        )}
        </div>


      {userRole === 'teacher' && <MeasurementForm onAddMeasurement={handleAddMeasurement} />}

      {latestMeasurement && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white border-l-4 border-blue-400 p-4 rounded-lg shadow-md flex items-center space-x-4">
                <RulerIcon className="w-10 h-10 text-blue-500" />
                <div>
                    <p className="text-sm text-gray-600">Chiều cao gần nhất</p>
                    <p className="text-2xl font-bold text-gray-800">{latestMeasurement.height} cm</p>
                </div>
            </div>
             <div className="bg-white border-l-4 border-green-400 p-4 rounded-lg shadow-md flex items-center space-x-4">
                <WeightIcon className="w-10 h-10 text-green-500" />
                <div>
                    <p className="text-sm text-gray-600">Cân nặng gần nhất</p>
                    <p className="text-2xl font-bold text-gray-800">{latestMeasurement.weight} kg</p>
                </div>
            </div>
             <div className="bg-white border-l-4 border-purple-400 p-4 rounded-lg shadow-md flex items-center space-x-4">
                <ChartIcon className="w-10 h-10 text-purple-500" />
                <div>
                    <p className="text-sm text-gray-600">Chỉ số BMI</p>
                    <p className="text-2xl font-bold text-gray-800">{latestMeasurement.bmi || 'N/A'}</p>
                </div>
            </div>
        </div>
      )}

      {latestMeasurement && <AssessmentCard student={student} measurement={latestMeasurement} onAssessmentLoaded={(assessment) => onUpdateAssessment(student.id, latestMeasurement.id, assessment)} />}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <GrowthChart data={student.measurements} dataKey="height" title="Biểu đồ tăng trưởng chiều cao" color="#ef4444" />
          <GrowthChart data={student.measurements} dataKey="weight" title="Biểu đồ tăng trưởng cân nặng" color="#ef4444" />
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Lịch sử các lần đo</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-gray-50 border-b">
                        <th className="p-3 font-semibold text-gray-600">Ngày đo</th>
                        <th className="p-3 font-semibold text-gray-600">Tuổi (tháng)</th>
                        <th className="p-3 font-semibold text-gray-600">Chiều cao (cm)</th>
                        <th className="p-3 font-semibold text-gray-600">Cân nặng (kg)</th>
                        <th className="p-3 font-semibold text-gray-600">BMI</th>
                    </tr>
                </thead>
                <tbody>
                    {[...student.measurements].reverse().map(m => {
                        const ageMonths = calculateAgeInMonths(student.dob, m.date);
                        return (
                            <tr key={m.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{formatDate(m.date)}</td>
                                <td className="p-3">{ageMonths}</td>
                                <td className="p-3">{m.height}</td>
                                <td className="p-3">{m.weight}</td>
                                <td className="p-3">{m.bmi || 'N/A'}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            {student.measurements.length === 0 && <p className="text-center text-gray-500 py-4">Chưa có dữ liệu đo nào.</p>}
        </div>
      </div>
    </main>
  );
};