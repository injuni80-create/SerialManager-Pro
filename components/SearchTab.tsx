import React, { useState } from 'react';
import { Search, CheckCircle, AlertCircle, Package, ArrowRight, X } from 'lucide-react';
import { Record, Product } from '../types';
import ResultCard from './ResultCard';

interface SearchTabProps {
  products: Product[];
  records: Record[];
}

const SearchTab: React.FC<SearchTabProps> = ({ products, records }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecords, setFilteredRecords] = useState<Record[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setSelectedRecord(null);

    if (term.trim() === '') {
      setFilteredRecords([]);
    } else {
      const matches = records.filter(r =>
        r.serial.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredRecords(matches);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredRecords.length > 0) {
      handleSelectRecord(filteredRecords[0]);
    }
  };

  const handleSelectRecord = (record: Record) => {
    setSelectedRecord(record);
    setSearchTerm(record.serial);
    setFilteredRecords([]);
  };

  const clearSearch = () => {
    setSelectedRecord(null);
    setSearchTerm('');
    setFilteredRecords([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-3 mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">시리얼 번호 조회</h2>
        <p className="text-gray-500 text-lg">제품의 시리얼 번호를 입력하여 출고 이력과 상세 정보를 확인하세요.</p>
      </div>

      <div className="sticky top-0 bg-gray-50/95 backdrop-blur-sm pt-2 pb-6 z-20">
        <form onSubmit={handleSearchSubmit} className="relative shadow-lg rounded-2xl group">
          <input
            type="text"
            placeholder="시리얼 번호 입력 (예: SN-2024...)"
            className="w-full pl-14 pr-12 py-5 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-xl transition-all font-mono text-gray-700 placeholder-gray-400 group-hover:border-gray-300"
            value={searchTerm}
            onChange={handleInputChange}
            autoComplete="off"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={26} />
          
          {searchTerm && (
             <button
                type="button"
                onClick={clearSearch}
                className="absolute right-24 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600"
             >
                <X size={20} />
             </button>
          )}

          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
          >
            조회
          </button>
        </form>
      </div>

      {selectedRecord && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <CheckCircle className="text-green-500" size={20} />
              조회 결과
            </h3>
            <button onClick={clearSearch} className="text-sm text-gray-500 hover:text-gray-800 underline underline-offset-2">
              다시 검색하기
            </button>
          </div>
          <ResultCard record={selectedRecord} products={products} />
        </div>
      )}

      {!selectedRecord && searchTerm && filteredRecords.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider px-2">
            검색 결과 ({filteredRecords.length}건)
          </h3>
          <div className="grid gap-3">
            {filteredRecords.map(record => {
              const product = products.find(p => p.id === record.productId);
              return (
                <div
                  key={record.id}
                  onClick={() => handleSelectRecord(record)}
                  className="bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg cursor-pointer transition-all group flex justify-between items-center"
                >
                  <div className="flex items-start gap-5">
                    <div className="bg-blue-50 p-3 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Package size={24} />
                    </div>
                    <div>
                      <div className="font-bold text-lg text-gray-800 group-hover:text-blue-700 font-mono">
                        {record.serial.split(new RegExp(`(${searchTerm})`, 'gi')).map((part, i) =>
                          part.toLowerCase() === searchTerm.toLowerCase()
                            ? <span key={i} className="text-blue-600 bg-blue-50 px-0.5 rounded">{part}</span>
                            : part
                        )}
                      </div>
                      <div className="text-gray-600 font-medium">{product?.name || '알 수 없는 제품'}</div>
                      <div className="text-xs text-gray-400 mt-1.5 flex gap-3">
                        <span className="flex items-center gap-1">📅 {record.shipDate}</span>
                        <span className="flex items-center gap-1">🏢 {record.customer}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="text-gray-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!selectedRecord && searchTerm && filteredRecords.length === 0 && (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-200 text-center">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-gray-400" size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">일치하는 시리얼이 없습니다</h3>
          <p className="text-gray-500">입력하신 번호를 다시 확인해주세요.</p>
        </div>
      )}

      {!searchTerm && !selectedRecord && records.length > 0 && (
        <div className="mt-12">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5 px-2">최근 출고 목록</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
            {records.slice(0, 5).map(record => {
              const product = products.find(p => p.id === record.productId);
              return (
                <div key={record.id} className="p-5 hover:bg-gray-50 flex justify-between items-center cursor-pointer transition-colors" onClick={() => handleSelectRecord(record)}>
                  <div>
                    <div className="font-semibold text-blue-600 font-mono">{record.serial}</div>
                    <div className="text-sm text-gray-500 mt-0.5">{product?.name}</div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="font-medium text-gray-800">{record.customer}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{record.shipDate}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchTab;