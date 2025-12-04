import React, { useState, useEffect } from 'react';
import { Menu, AlertCircle, RefreshCw } from 'lucide-react';
import { Product, Record, RestoreData, TabType } from './types';
import Sidebar from './components/Sidebar';
import SearchTab from './components/SearchTab';
import RegisterTab from './components/RegisterTab';
import ProductManagerTab from './components/ProductManagerTab';
import DashboardTab from './components/DashboardTab';

// Initial Data
const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', code: 'PROD-001', name: '고성능 서버 모듈 A', category: '서버' },
  { id: 'p2', code: 'PROD-002', name: '산업용 IoT 센서 B', category: '센서' },
  { id: 'p3', code: 'PROD-003', name: '네트워크 스위치 허브 C', category: '네트워크' },
  { id: 'p4', code: 'PROD-004', name: '무선 컨트롤러 D', category: '컨트롤러' },
  { id: 'p5', code: 'PROD-005', name: '전력 관리 유닛 E', category: '전원' },
];

const INITIAL_RECORDS: Record[] = [
  { id: 1, serial: 'SN-20231025-001', productId: 'p1', customer: '(주)한국전자', shipDate: '2023-10-25', memo: '1차 납품분', status: '출고완료' },
  { id: 2, serial: 'SN-20231102-045', productId: 'p2', customer: '미래테크', shipDate: '2023-11-02', memo: '테스트용 샘플', status: '출고완료' },
  { id: 3, serial: 'SN-20231205-012', productId: 'p3', customer: '넥스트넷', shipDate: '2023-12-05', memo: '긴급 발주', status: '출고완료' },
  { id: 4, serial: 'SN-20240110-008', productId: 'p1', customer: '글로벌시스템', shipDate: '2024-01-10', memo: '해외 수출용', status: '선적대기' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('search');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [records, setRecords] = useState<Record[]>(INITIAL_RECORDS);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Modal States
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [restoreData, setRestoreData] = useState<RestoreData | null>(null);

  // Load from LocalStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem('sms_products');
    const savedRecords = localStorage.getItem('sms_records');
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedRecords) setRecords(JSON.parse(savedRecords));
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('sms_products', JSON.stringify(products));
    localStorage.setItem('sms_records', JSON.stringify(records));
  }, [products, records]);

  // Handlers
  const handleAddRecord = (newRecord: Record) => {
    setRecords(prev => [newRecord, ...prev]);
    setActiveTab('search');
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [...prev, newProduct]);
  };

  const handleDeleteRequest = (id: string) => {
    setDeleteTargetId(id);
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      setProducts(prev => prev.filter(p => p.id !== deleteTargetId));
      setDeleteTargetId(null);
    }
  };

  const handleRestoreRequest = (data: RestoreData) => {
    setRestoreData(data);
  };

  const confirmRestore = () => {
    if (restoreData) {
      if (restoreData.products && Array.isArray(restoreData.products)) setProducts(restoreData.products);
      if (restoreData.records && Array.isArray(restoreData.records)) setRecords(restoreData.records);
      setRestoreData(null);
      setActiveTab('search');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-gray-800 relative selection:bg-blue-100 selection:text-blue-900">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center shadow-md z-30">
        <span className="font-bold text-lg flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">S</div>
            SerialPro
        </span>
        <button onClick={() => setSidebarOpen(true)} className="p-1 rounded hover:bg-slate-800">
            <Menu size={24} />
        </button>
      </div>

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-60px)] md:h-screen p-4 md:p-8 lg:p-12 scroll-smooth">
        <div className="max-w-7xl mx-auto">
            {activeTab === 'search' && <SearchTab products={products} records={records} />}
            {activeTab === 'register' && <RegisterTab products={products} onAdd={handleAddRecord} />}
            {activeTab === 'products' && (
            <ProductManagerTab 
                products={products} 
                records={records}
                onAdd={handleAddProduct} 
                onDelete={handleDeleteRequest} 
                onRestore={handleRestoreRequest} 
            />
            )}
            {activeTab === 'dashboard' && <DashboardTab products={products} records={records} />}
        </div>
      </main>

      {/* Modals */}
      {deleteTargetId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-scale-up">
            <div className="flex items-center gap-3 text-red-600 mb-4 bg-red-50 p-3 rounded-xl w-fit">
              <AlertCircle size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2">제품 삭제 확인</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              정말 이 제품을 삭제하시겠습니까?<br/>
              <span className="text-sm text-gray-400">이미 등록된 출고 기록은 유지됩니다.</span>
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setDeleteTargetId(null)}
                className="px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 font-medium transition-colors"
              >
                취소
              </button>
              <button 
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 font-medium shadow-lg shadow-red-200 transition-colors"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}

      {restoreData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-scale-up">
            <div className="flex items-center gap-3 text-indigo-600 mb-4 bg-indigo-50 p-3 rounded-xl w-fit">
              <RefreshCw size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2">데이터 복구 확인</h3>
            <div className="bg-gray-50 p-4 rounded-xl mb-4 text-sm border border-gray-100">
              <p className="font-semibold text-gray-900 mb-1">백업 날짜</p>
              <p className="text-indigo-600 font-medium">{restoreData.exportedAt ? new Date(restoreData.exportedAt).toLocaleString() : '날짜 정보 없음'}</p>
            </div>
            <p className="text-gray-600 mb-8 leading-relaxed text-sm">
              현재 저장된 데이터를 모두 지우고,<br/>선택한 파일의 데이터로 <span className="font-bold text-indigo-600 bg-indigo-50 px-1 rounded">덮어쓰기</span> 하시겠습니까?
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setRestoreData(null)}
                className="px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 font-medium transition-colors"
              >
                취소
              </button>
              <button 
                onClick={confirmRestore}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 font-medium shadow-lg shadow-indigo-200 transition-colors"
              >
                복구하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}