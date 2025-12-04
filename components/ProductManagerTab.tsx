import React, { useState, useRef } from 'react';
import { Settings, Download, Upload, FileSpreadsheet, Plus, Trash2, AlertCircle } from 'lucide-react';
import { Product, Record, RestoreData } from '../types';

interface ProductManagerTabProps {
  products: Product[];
  records: Record[];
  onAdd: (product: Product) => void;
  onDelete: (id: string) => void;
  onRestore: (data: RestoreData) => void;
}

const ProductManagerTab: React.FC<ProductManagerTabProps> = ({ products, records, onAdd, onDelete, onRestore }) => {
  const [newProd, setNewProd] = useState({ name: '', code: '', category: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name) return;
    onAdd({ id: `p${Date.now()}`, ...newProd });
    setNewProd({ name: '', code: '', category: '' });
  };

  const handleExportJSON = () => {
    const data: RestoreData = {
      products: products,
      records: records,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `serial_system_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const headers = ['시리얼 번호', '제품명', '제품 코드', '카테고리', '납품 업체', '출고일자', '상태', '비고'];
    const rows = records.map(record => {
      const product = products.find(p => p.id === record.productId) || {} as Product;
      const rowData = [
        record.serial,
        product.name || '',
        product.code || '',
        product.category || '',
        record.customer,
        record.shipDate,
        record.status,
        record.memo ? record.memo.replace(/(\r\n|\n|\r)/gm, " ") : ''
      ];
      return rowData.map(item => `"${String(item).replace(/"/g, '""')}"`).join(',');
    });
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `serial_list_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.json')) {
      setErrorMsg('복구 기능은 시스템 백업 파일(.json)만 지원합니다.');
      setTimeout(() => setErrorMsg(''), 3000);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result;
        if (typeof result === 'string') {
          const data = JSON.parse(result);
          onRestore(data);
        }
      } catch (error) {
        setErrorMsg('올바르지 않은 백업 파일 형식이거나 파일이 손상되었습니다.');
        setTimeout(() => setErrorMsg(''), 3000);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Backup Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-2xl border border-indigo-100 shadow-sm">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-900">
          <Settings className="text-indigo-600" /> 데이터 백업 및 복구
        </h3>
        <p className="text-sm text-indigo-700/80 mb-8 max-w-2xl">
          현재 시스템에 저장된 모든 데이터(제품 목록, 출고 기록)를 안전하게 백업하거나, 이전에 저장된 파일을 불러와 데이터를 복원할 수 있습니다.
        </p>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl text-sm flex items-center gap-2 animate-pulse border border-red-200">
            <AlertCircle size={18} /> {errorMsg}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleExportJSON}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white text-indigo-700 border border-indigo-200 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 hover:border-indigo-300 transition-all shadow-sm"
          >
            <Download size={18} />
            시스템 백업 (JSON)
          </button>

          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-100"
          >
            <FileSpreadsheet size={18} />
            엑셀 내보내기 (CSV)
          </button>

          <div className="h-px w-full sm:h-auto sm:w-px bg-indigo-200 mx-2"></div>

          <button
            onClick={handleImportClick}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            <Upload size={18} />
            데이터 복구 (불러오기)
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
        </div>
      </div>

      <div className="border-t border-gray-100 my-8"></div>

      {/* Product List Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800">
            <Plus className="text-blue-600" /> 제품군 관리
            </h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">등록된 제품: {products.length}개</span>
        </div>

        {/* Add Product Form */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full flex-1">
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">제품명</label>
                <input
                placeholder="예: 5G 통신 모듈"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={newProd.name}
                onChange={e => setNewProd({ ...newProd, name: e.target.value })}
                required
                />
            </div>
            <div className="w-full md:w-48">
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">관리코드</label>
                <input
                placeholder="예: PM-05"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={newProd.code}
                onChange={e => setNewProd({ ...newProd, code: e.target.value })}
                />
            </div>
            <div className="w-full md:w-48">
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">카테고리</label>
                <input
                placeholder="예: 통신"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={newProd.category}
                onChange={e => setNewProd({ ...newProd, category: e.target.value })}
                />
            </div>
            <button
                type="submit"
                className="w-full md:w-auto bg-slate-800 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-700 whitespace-nowrap transition-colors"
            >
                추가하기
            </button>
            </form>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">제품명</th>
                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">관리코드</th>
                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">카테고리</th>
                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">작업</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {products.map(p => (
                    <tr key={p.id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="p-5 font-medium text-gray-900">{p.name}</td>
                        <td className="p-5 text-gray-500 font-mono text-sm">{p.code || '-'}</td>
                        <td className="p-5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {p.category || '미분류'}
                        </span>
                        </td>
                        <td className="p-5 text-right">
                        <button
                            type="button"
                            onClick={() => onDelete(p.id)}
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all"
                            title="제품 삭제"
                        >
                            <Trash2 size={18} />
                        </button>
                        </td>
                    </tr>
                    ))}
                    {products.length === 0 && (
                        <tr>
                            <td colSpan={4} className="p-8 text-center text-gray-400">등록된 제품이 없습니다.</td>
                        </tr>
                    )}
                </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagerTab;