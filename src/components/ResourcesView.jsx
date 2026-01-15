import React from 'react';
import { ResourceType } from '../../types';

const ResourcesView = ({ resources }) => {
  return (
    <div className="grid grid-cols-4 gap-8 animate-in fade-in duration-500">
      {resources.map(res => (
        <div key={res.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl group hover:border-blue-500/50 transition-all shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${res.status === 'available' ? 'bg-blue-600' : 'bg-slate-700'}`}>
              <i className={`fas ${res.type === ResourceType.AMBULANCE ? 'fa-truck-medical' : 'fa-shield-halved'}`}></i>
            </div>
            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${res.status === 'available' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
              {res.status}
            </span>
          </div>
          <h3 className="font-black text-lg text-white mb-1">{res.name}</h3>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">{res.type}</p>
          <div className="text-xs space-y-3 pt-6 border-t border-slate-800">
            <div className="flex items-center gap-3 text-slate-400">
              <i className="fas fa-phone-volume text-blue-500"></i> {res.contact}
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <i className="fas fa-location-crosshairs text-blue-500"></i> Active Region
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResourcesView;
