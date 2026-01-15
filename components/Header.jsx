import React from 'react';
import { StressLevel } from '../types';

const Header = ({ communityStress, settings }) => {
  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 flex items-center justify-between px-8 z-10">
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Node Status</span>
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border shadow-inner ${
              communityStress === StressLevel.HIGH ? 'bg-red-500/10 border-red-500 text-red-500' :
              communityStress === StressLevel.MEDIUM ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500' :
              'bg-green-500/10 border-green-500 text-green-500'
            }`}>
              <span className={`w-2 h-2 rounded-full animate-pulse ${
                communityStress === StressLevel.HIGH ? 'bg-red-500' :
                communityStress === StressLevel.MEDIUM ? 'bg-yellow-500' : 'bg-green-500'
              }`}></span>
              Community Stress: {communityStress}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-red-600/20 border border-red-600/50 px-3 py-1.5 rounded-lg text-xs font-bold text-red-400">
            <i className="fas fa-hospital mr-1.5"></i>Hospital: 102
          </div>
          <div className="bg-orange-600/20 border border-orange-600/50 px-3 py-1.5 rounded-lg text-xs font-bold text-orange-400">
            <i className="fas fa-fire-extinguisher mr-1.5"></i>Fire: 101
          </div>
          <div className="bg-blue-600/20 border border-blue-600/50 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-400">
            <i className="fas fa-shield-halved mr-1.5"></i>Police: 100
          </div>
        </div>
        <div className="bg-slate-800 px-4 py-1.5 rounded-lg border border-slate-700 text-xs font-bold">
          {settings.agencyName}
        </div>
      </div>
    </header>
  );
};

export default Header;
