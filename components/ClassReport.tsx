import React, { useEffect } from 'react';
import type { Student, Assessment } from '../types';
import { formatDate, calculateAgeInMonths } from '../utils/helpers';
import { getGrowthAssessment } from '../services/geminiService';

interface ClassReportProps {
    students: Student[];
    onUpdateAssessment: (studentId: string, measurementId: string, assessment: Assessment) => void;
}

export const ClassReport: React.FC<ClassReportProps> = ({ students, onUpdateAssessment }) => {

    useEffect(() => {
        students.forEach(student => {
            const latestMeasurement = student.measurements.length > 0 ? student.measurements[student.measurements.length - 1] : null;
            if (latestMeasurement && !latestMeasurement.assessment) {
                getGrowthAssessment(student, latestMeasurement).then(assessment => {
                    if (assessment) {
                        onUpdateAssessment(student.id, latestMeasurement.id, assessment);
                    }
                });
            }
        });
    }, [students, onUpdateAssessment]);

    const handlePrint = () => {
        window.print();
    };
    
    // In a real app, this would use a library like 'xlsx' to generate an Excel file.
    const handleExportExcel = () => {
        alert("Chức năng xuất Excel đang được phát triển!");
    };

    return (
        <main className="flex-1 p-6 overflow-y-auto bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6 no-print">
                    <h2 className="text-2xl font-bold text-gray-800">Báo cáo Toàn lớp</h2>
                    <div className="space-x-2">
                        <button onClick={handleExportExcel} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                            Xuất Excel
                        </button>
                        <button onClick={handlePrint} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                            In / Lưu PDF
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left table-auto">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="p-3 font-semibold text-gray-600">STT</th>
                                <th className="p-3 font-semibold text-gray-600">Tên học sinh</th>
                                <th className="p-3 font-semibold text-gray-600">Ngày sinh</th>
                                <th className="p-3 font-semibold text-gray-600">Tuổi (tháng)</th>
                                <th className="p-3 font-semibold text-gray-600">Ngày đo cuối</th>
                                <th className="p-3 font-semibold text-gray-600">Chiều cao (cm)</th>
                                <th className="p-3 font-semibold text-gray-600">Cân nặng (kg)</th>
                                <th className="p-3 font-semibold text-gray-600">BMI</th>
                                <th className="p-3 font-semibold text-gray-600">Tình trạng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, index) => {
                                const latestMeasurement = student.measurements.length > 0 ? student.measurements[student.measurements.length - 1] : null;
                                const ageInMonths = latestMeasurement ? calculateAgeInMonths(student.dob, latestMeasurement.date) : calculateAgeInMonths(student.dob, new Date().toISOString().split('T')[0]);
                                
                                const status = latestMeasurement?.assessment?.overallStatus;
                                const rowClass = status === 'Cần chú ý' ? 'bg-yellow-100 hover:bg-yellow-200' : 'hover:bg-gray-50';

                                return (
                                    <tr key={student.id} className={`border-b ${rowClass} transition-colors`}>
                                        <td className="p-3">{index + 1}</td>
                                        <td className="p-3 font-medium text-gray-800">{student.name}</td>
                                        <td className="p-3">{formatDate(student.dob)}</td>
                                        <td className="p-3">{ageInMonths}</td>
                                        <td className="p-3">{latestMeasurement ? formatDate(latestMeasurement.date) : 'N/A'}</td>
                                        <td className="p-3">{latestMeasurement ? latestMeasurement.height : 'N/A'}</td>
                                        <td className="p-3">{latestMeasurement ? latestMeasurement.weight : 'N/A'}</td>
                                        <td className="p-3">{latestMeasurement?.bmi || 'N/A'}</td>
                                        <td className="p-3 font-medium">
                                            {status ? (
                                                <span className={`px-2 py-1 text-xs rounded-full ${status === 'Bình thường' ? 'bg-green-100 text-green-800' : 'bg-yellow-200 text-yellow-900'}`}>
                                                    {status}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-500">{latestMeasurement ? 'Đang tải...' : 'Chưa có'}</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                     {students.length === 0 && <p className="text-center text-gray-500 py-8">Chưa có học sinh nào trong danh sách.</p>}
                </div>
            </div>
        </main>
    );
};