import React from 'react';
import { Package, Calendar, Settings } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Product, Record } from '../types';
import StatCard from './StatCard';

interface DashboardTabProps {
  products: Product[];
  records: Record[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

const DashboardTab: React.FC<DashboardTabProps> = ({ products, records }) => {
  const totalRecords = records.length;
  const recentRecords = records.filter(r => {
    const d = new Date(r.shipDate);
    const now = new Date();
    return (now.getTime() - d.getTime()) < (1000 * 60 * 60 * 24 * 30);
  }).length;

  const stats = products.map(p => {
    const count = records.filter(r => r.productId === p.id).length;
    return { name: p.name, count };
  }).sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
            title="총 누적 출고" 
            value={`${totalRecords} 건`} 
            icon={<Package className="text-blue-500" size={24} />} 
        />
        <StatCard 
            title="최근 30일 출고" 
            value={`${recentRecords} 건`} 
            icon={<Calendar className="text-green-500" size={24} />} 
        />
        <StatCard 
            title="등록된 제품 종류" 
            value={`${products.length} 종`} 
            icon={<Settings className="text-purple-500" size={24} />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold mb-6 text-gray-800">제품별 출고 현황 (TOP 5)</h3>
            <div className="h-64 w-full">
            {stats.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                    <XAxis type="number" hide />
                    <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={100} 
                    tick={{fontSize: 12, fill: '#6b7280'}}
                    tickLine={false}
                    axisLine={false}
                    />
                    <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={24}>
                        {stats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-full text-gray-400">데이터가 없습니다.</div>
            )}
            </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
           <h3 className="text-lg font-bold mb-6 text-gray-800">최근 활동 내역</h3>
           <div className="space-y-0">
              {records.slice(0, 5).map((record, i) => {
                 const product = products.find(p => p.id === record.productId);
                 return (
                    <div key={record.id} className="relative pl-6 py-4 border-l-2 border-gray-100 last:pb-0">
                       <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-500"></div>
                       <div className="flex justify-between items-start">
                          <div>
                             <p className="font-semibold text-gray-800">{product?.name || 'Unknown Product'}</p>
                             <p className="text-sm text-gray-500 font-mono mt-1">{record.serial}</p>
                          </div>
                          <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">{record.shipDate}</span>
                       </div>
                    </div>
                 )
              })}
              {records.length === 0 && <p className="text-gray-400 text-center py-8">기록이 없습니다.</p>}
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;