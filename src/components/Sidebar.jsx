import React from 'react';

const Sidebar = ({ view, setView, setIsReportModalOpen }) => {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col p-5 shadow-2xl">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-900/40">
          <i className="fas fa-satellite text-xl"></i>
        </div>
        <h1 className="text-xl font-black tracking-tight">RESCUENET</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {[
          { id: 'dashboard', icon: 'fa-table-columns', label: 'Dashboard' },
          { id: 'monitor', icon: 'fa-heartbeat', label: 'Live Monitor' },
          { id: 'resources', icon: 'fa-truck-ramp-box', label: 'Resources' },
          { id: 'analytics', icon: 'fa-chart-simple', label: 'Analytics' },
          { id: 'settings', icon: 'fa-gear', label: 'Settings' }
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-bold text-sm ${
              view === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <i className={`fas ${item.icon} w-5`}></i> {item.label}
          </button>
        ))}
      </nav>

      <button 
        onClick={() => setIsReportModalOpen(true)}
        className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-2xl font-black text-xs tracking-widest shadow-lg shadow-red-900/40 transition-transform active:scale-95 mt-6"
      >
        <i className="fas fa-bullhorn mr-2"></i> BROADCAST ALERT
      </button>
    </aside>
  );
};

export default Sidebar;
