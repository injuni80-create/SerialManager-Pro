import React from 'react';
import { Search, Package, BarChart3, Settings, FileText, Menu, X } from 'lucide-react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  
  const handleNavClick = (tab: TabType) => {
    setActiveTab(tab);
    setIsOpen(false); // Close mobile menu on select
  };

  const NavButton = ({ icon, label, tab }: { icon: React.ReactNode, label: string, tab: TabType }) => (
    <button
      onClick={() => handleNavClick(tab)}
      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
        activeTab === tab
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <div className={`${activeTab === tab ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`}>
         {icon}
      </div>
      <span className="font-medium tracking-wide">{label}</span>
      {activeTab === tab && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
    </button>
  );

  return (
    <>
        {/* Mobile Overlay */}
        {isOpen && (
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-opacity"
                onClick={() => setIsOpen(false)}
            />
        )}

        {/* Sidebar Container */}
        <aside className={`
            fixed md:static inset-y-0 left-0 z-40
            w-72 bg-slate-900 text-white flex-shrink-0 
            transform transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            flex flex-col border-r border-slate-800
        `}>
        <div className="p-8 border-b border-slate-800">
            <h1 className="text-2xl font-bold flex items-center gap-3 tracking-tight">
                <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
                    <Package className="text-white" size={24} />
                </div>
                SerialPro
            </h1>
            <p className="text-xs text-slate-500 mt-3 font-medium tracking-wider uppercase">Inventory System v2.0</p>
        </div>
        
        <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
            <div className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-4 px-2">Menu</div>
            <NavButton icon={<Search size={22}/>} label="시리얼 검색" tab="search" />
            <NavButton icon={<FileText size={22}/>} label="출고 등록" tab="register" />
            <div className="text-xs font-bold text-slate-600 uppercase tracking-widest mt-8 mb-4 px-2">Management</div>
            <NavButton icon={<Settings size={22}/>} label="제품 관리" tab="products" />
            <NavButton icon={<BarChart3 size={22}/>} label="현황 대시보드" tab="dashboard" />
        </nav>

        <div className="p-6 border-t border-slate-800 bg-slate-900/50">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold text-sm">
                    AD
                </div>
                <div>
                    <p className="text-sm font-medium text-white">Admin User</p>
                    <p className="text-xs text-slate-500">admin@company.com</p>
                </div>
            </div>
        </div>
        </aside>
    </>
  );
};

export default Sidebar;