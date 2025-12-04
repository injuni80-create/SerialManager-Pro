import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow duration-200">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-800 tracking-tight">{value}</p>
      </div>
      <div className="p-4 bg-gray-50 rounded-2xl text-gray-600">
        {icon}
      </div>
    </div>
  );
};

export default StatCard;