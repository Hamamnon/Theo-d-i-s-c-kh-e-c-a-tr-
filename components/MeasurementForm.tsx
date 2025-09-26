
import React, { useState } from 'react';
import { PlusIcon } from './icons';

interface MeasurementFormProps {
    onAddMeasurement: (height: number, weight: number, date: string) => void;
}

export const MeasurementForm: React.FC<MeasurementFormProps> = ({ onAddMeasurement }) => {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const heightNum = parseFloat(height);
        const weightNum = parseFloat(weight);
        if (heightNum > 0 && weightNum > 0 && date) {
            onAddMeasurement(heightNum, weightNum, date);
            setHeight('');
            setWeight('');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Thêm lần đo mới</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-600">Ngày đo</label>
                    <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                 <div>
                    <label htmlFor="height" className="block text-sm font-medium text-gray-600">Chiều cao (cm)</label>
                    <input type="number" step="0.1" id="height" value={height} onChange={e => setHeight(e.target.value)} required placeholder="VD: 95.5" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                 <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-600">Cân nặng (kg)</label>
                    <input type="number" step="0.1" id="weight" value={weight} onChange={e => setWeight(e.target.value)} required placeholder="VD: 15.2" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <button type="submit" className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Thêm
                </button>
            </form>
        </div>
    );
};
