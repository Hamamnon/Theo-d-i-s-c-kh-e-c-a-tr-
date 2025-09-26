import React, { useState, useEffect } from 'react';
import type { Student, Measurement, Assessment } from '../types';
import { getGrowthAssessment } from '../services/geminiService';
import { LightbulbIcon } from './icons';

interface AssessmentCardProps {
    student: Student;
    measurement: Measurement;
    onAssessmentLoaded: (assessment: Assessment) => void;
}

const StatusIndicator: React.FC<{ status: string }> = ({ status }) => {
    const getStatusColor = () => {
        if (status.toLowerCase().includes('bình thường')) return 'bg-green-100 text-green-800';
        if (status.toLowerCase().includes('thấp còi') || status.toLowerCase().includes('suy dinh dưỡng')) return 'bg-yellow-100 text-yellow-800';
        if (status.toLowerCase().includes('thừa cân') || status.toLowerCase().includes('béo phì')) return 'bg-red-100 text-red-800';
        return 'bg-gray-100 text-gray-800';
    };

    return <span className={`px-2.5 py-1 text-sm font-medium rounded-full ${getStatusColor()}`}>{status}</span>;
};

export const AssessmentCard: React.FC<AssessmentCardProps> = ({ student, measurement, onAssessmentLoaded }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!measurement.assessment) {
            const fetchAssessment = async () => {
                setIsLoading(true);
                setError(null);
                const result = await getGrowthAssessment(student, measurement);
                if (result) {
                    onAssessmentLoaded(result);
                } else {
                    setError('Không thể nhận được đánh giá từ AI. Vui lòng thử lại.');
                }
                setIsLoading(false);
            };
            fetchAssessment();
        }
    }, [student, measurement, onAssessmentLoaded]);
    
    const assessment = measurement.assessment;

    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md min-h-[200px] flex items-center justify-center">
                <div className="flex items-center space-x-2 text-gray-600">
                    <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>AI đang phân tích...</span>
                </div>
            </div>
        );
    }
    
    if (error && !assessment) {
        return (
            <div className="bg-red-50 p-6 rounded-lg shadow-md">
                <p className="text-red-700 font-semibold">{error}</p>
            </div>
        );
    }

    if (!assessment) return null;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-blue-600 mb-4">Đánh giá & Khuyến nghị từ AI</h3>
            <div className="space-y-4">
                <p className="text-gray-700 italic bg-gray-50 p-3 rounded-md">" {assessment.summary} "</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                        <span className="font-semibold text-gray-600">Chiều cao:</span>
                        <StatusIndicator status={assessment.heightStatus} />
                    </div>
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                        <span className="font-semibold text-gray-600">Cân nặng:</span>
                        <StatusIndicator status={assessment.weightStatus} />
                    </div>
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                        <span className="font-semibold text-gray-600">BMI:</span>
                        <StatusIndicator status={assessment.bmiStatus} />
                    </div>
                </div>

                {assessment.parentalAdvice && assessment.parentalAdvice.length > 0 && (
                    <div className="pt-4">
                        <h4 className="font-bold text-lg text-gray-800 mt-6 mb-3">Lời khuyên hữu ích cho Phụ huynh</h4>
                        <div className="space-y-4">
                            {assessment.parentalAdvice.map((advice, index) => (
                                <div key={index} className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg flex space-x-4 items-start">
                                    <LightbulbIcon className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h5 className="font-semibold text-gray-800">{advice.title}</h5>
                                        <p className="text-gray-600 text-sm mt-1">{advice.details}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};