
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Measurement } from '../types';
import { formatDate } from '../utils/helpers';

interface GrowthChartProps {
  data: Measurement[];
  dataKey: 'height' | 'weight';
  title: string;
  color: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded-md shadow-lg">
          <p className="font-bold">{`Ngày: ${formatDate(label)}`}</p>
          <p style={{ color: payload[0].color }}>{`${payload[0].name}: ${payload[0].value} ${payload[0].dataKey === 'height' ? 'cm' : 'kg'}`}</p>
        </div>
      );
    }
    return null;
  };

export const GrowthChart: React.FC<GrowthChartProps> = ({ data, dataKey, title, color }) => {
  if (data.length < 2) {
    return (
        <div className="h-80 flex items-center justify-center bg-gray-100 rounded-lg">
            <p className="text-gray-500">Cần ít nhất 2 lần đo để vẽ biểu đồ.</p>
        </div>
    )
  }

  const chartData = data.map(m => ({
    date: m.date,
    [dataKey]: m[dataKey]
  }));

  return (
    <div className="h-80 bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 0, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate} 
            angle={-20}
            textAnchor="end"
            height={50}
            />
          <YAxis domain={['dataMin - 5', 'dataMax + 5']} unit={dataKey === 'height' ? ' cm' : ' kg'} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            strokeWidth={2} 
            activeDot={{ r: 8 }} 
            name={dataKey === 'height' ? 'Chiều cao' : 'Cân nặng'}
            />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
