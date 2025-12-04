import React, { useState } from 'react';
import { FileText, Save, Check } from 'lucide-react';
import { Product, Record } from '../types';

interface RegisterTabProps {
  products: Product[];
  onAdd: (newRecord: Record) => void;
}

const RegisterTab: React.FC<RegisterTabProps> = ({ products, onAdd }) => {
  const [formData, setFormData] = useState<Omit<Record, 'id'>>({
    serial: '',
    productId: products[0]?.id || '',
    customer: '',
    shipDate: new Date().toISOString().split('T')[0],
    memo: '',
    status: '출고완료'
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.serial || !formData.customer) return;

    onAdd({
      id: Date.now(),
      ...formData
    });

    // Show simplified success message or redirect
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (products.length === 0) {
     return (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
           <h3 className="text-xl font-bold text-gray-800 mb-2">등록된 제품이 없습니다</h3>
           <p className="text-gray-500">먼저 제품 관리 탭에서 제품군을 등록해주세요.</p>
        </div>
     )
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-900">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
             <FileText size={24} />
          </div>
          신규 출고 등록
        </h2>
        {showSuccess && (
           <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full text-sm font-bold animate-pulse">
              <Check size={16} /> 저장 완료!
           </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">시리얼 번호 <span className="text-red-500">*</span></label>
            <input
              required
              type="text"
              className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-mono"
              placeholder="예: SN-20240101-001"
              value={formData.serial}
              onChange={e => setFormData({ ...formData, serial: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">출고일자 <span className="text-red-500">*</span></label>
            <input
              required
              type="date"
              className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
              value={formData.shipDate}
              onChange={e => setFormData({ ...formData, shipDate: e.target.value })}
            />
          </div>

          <div className="col-span-1 md:col-span-2 space-y-2">
            <label className="block text-sm font-semibold text-gray-700">제품 선택 <span className="text-red-500">*</span></label>
            <select
              className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
              value={formData.productId}
              onChange={e => setFormData({ ...formData, productId: e.target.value })}
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.code || 'No Code'})</option>
              ))}
            </select>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-2">
            <label className="block text-sm font-semibold text-gray-700">납품 업체명 <span className="text-red-500">*</span></label>
            <input
              required
              type="text"
              className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
              placeholder="업체명 입력"
              value={formData.customer}
              onChange={e => setFormData({ ...formData, customer: e.target.value })}
            />
          </div>

          <div className="col-span-1 md:col-span-2 space-y-2">
            <label className="block text-sm font-semibold text-gray-700">비고</label>
            <textarea
              className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all h-32 resize-none"
              placeholder="특이사항, 담당자 연락처 등"
              value={formData.memo}
              onChange={e => setFormData({ ...formData, memo: e.target.value })}
            />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all flex items-center gap-2 transform active:scale-95"
          >
            <Save size={20} />
            등록 완료
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterTab;