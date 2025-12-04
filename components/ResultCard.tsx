import React from 'react';
import { Package, Calendar, Truck, CheckCircle } from 'lucide-react';
import { Record, Product } from '../types';
import InfoItem from './InfoItem';

interface ResultCardProps {
  record: Record;
  products: Product[];
}

const ResultCard: React.FC<ResultCardProps> = ({ record, products }) => {
  const product = products.find(p => p.id === record.productId);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden animate-fade-in-up">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium mb-2 uppercase tracking-wide opacity-80">Serial Number</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-mono">{record.serial}</h2>
          </div>
          <CheckCircle className="text-blue-200 opacity-80" size={40} />
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <InfoItem 
          label="제품명" 
          value={product?.name || '정보 없음'} 
          icon={<Package size={16} className="text-blue-500"/>} 
          fullWidth 
        />
        <InfoItem 
          label="출고일자" 
          value={record.shipDate} 
          icon={<Calendar size={16} className="text-blue-500"/>} 
        />
        <InfoItem 
          label="납품 업체" 
          value={record.customer} 
          icon={<Truck size={16} className="text-blue-500"/>} 
        />
        <InfoItem 
          label="제품 카테고리" 
          value={product?.category || '-'} 
        />
        <InfoItem 
          label="현재 상태" 
          value={record.status} 
          badge 
        />

        <div className="col-span-1 md:col-span-2 bg-gray-50 p-5 rounded-xl border border-gray-100 mt-2">
          <p className="text-xs text-gray-400 font-bold uppercase mb-2 tracking-wider">비고 / 메모</p>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{record.memo || '등록된 메모가 없습니다.'}</p>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;