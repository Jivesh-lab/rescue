import React from 'react';
import MapComponent from './MapComponent';
import { SEVERITY_COLORS, TYPE_ICONS } from '../../constants';

const DashboardView = ({ 
  incidents, 
  resources, 
  tacticalSummary, 
  selectedIncident,
  setSelectedIncident,
  toggleChecklistItem,
  resolveIncident
}) => {
  return (
    <div className="grid grid-cols-12 gap-8 h-full">
      {/* Map & Tactical Overview */}
      <div className="col-span-8 flex flex-col gap-8">
        <div className="bg-white rounded-3xl border border-slate-200 h-[60vh] relative shadow-2xl overflow-hidden">
          <MapComponent incidents={incidents} resources={resources} onSelectIncident={setSelectedIncident} />
          
          {/* Tactical Summary Overlay */}
          <div className="absolute bottom-6 left-6 right-6 bg-slate-900/95 backdrop-blur-md border border-slate-700 p-4 rounded-2xl shadow-2xl flex gap-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-blue-600/20 p-3 rounded-xl text-blue-400">
              <i className="fas fa-microchip text-xl"></i>
            </div>
            <div>
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-tighter">AI Tactical Advisory</span>
              <p className="text-sm text-slate-200 italic leading-relaxed font-medium">"{tacticalSummary}"</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {[
            { label: 'Active Alerts', value: incidents.filter(i => i.status === 'active').length, color: 'text-red-500' },
            { label: 'Fleet Busy', value: `${Math.round((resources.filter(r => r.status === 'busy').length/resources.length)*100)}%`, color: 'text-orange-500' },
            { label: 'Avg Confidence', value: 'High', color: 'text-blue-500' },
            { label: 'Resolved Today', value: incidents.filter(i => i.status === 'resolved').length, color: 'text-green-500' }
          ].map((stat, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col items-center">
              <span className="text-[10px] font-black text-slate-500 uppercase mb-1">{stat.label}</span>
              <span className={`text-2xl font-black ${stat.color}`}>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tactical Queue & Checklists */}
      <div className="col-span-4 flex flex-col gap-8">
        <div className="bg-slate-900 rounded-3xl border border-slate-800 flex-1 flex flex-col overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-800/40">
            <h3 className="font-black text-sm uppercase tracking-widest">Tactical Queue</h3>
            <span className="text-[10px] px-2 py-1 bg-blue-600/20 text-blue-400 rounded-lg font-bold">REAL-TIME</span>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {incidents.filter(i => i.status === 'active').length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 py-10">
                <i className="fas fa-shield-heart text-5xl mb-4 opacity-20"></i>
                <p className="font-bold">No active threats detected</p>
              </div>
            ) : (
              incidents.filter(i => i.status === 'active').map(inc => (
                <div 
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                    selectedIncident?.id === inc.id ? 'bg-blue-600/10 border-blue-600' : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black text-white ${SEVERITY_COLORS[inc.severity]}`}>
                      {inc.severity}
                    </span>
                    <div className="flex gap-2 items-center">
                      {inc.videoAttached && (
                        <span className="text-[9px] font-bold text-purple-400 bg-purple-400/10 px-2 py-1 rounded-lg flex items-center gap-1">
                          <i className="fas fa-video"></i> Video
                        </span>
                      )}
                      {inc.photoAttached && !inc.videoAttached && (
                        <span className="text-[9px] font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded-lg flex items-center gap-1">
                          <i className="fas fa-camera"></i> Photo
                        </span>
                      )}
                      <span className="text-[9px] font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded-lg">
                        {inc.confidence}
                      </span>
                    </div>
                  </div>
                  <h4 className="font-bold text-sm flex items-center gap-2">
                    <i className={`fas ${TYPE_ICONS[inc.type]} text-slate-400`}></i> {inc.type}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 italic">"{inc.description}"</p>
                </div>
              ))
            )}
          </div>
        </div>

        {selectedIncident && (
          <div className="bg-slate-900 rounded-3xl border border-blue-600/40 p-6 shadow-2xl animate-in slide-in-from-bottom-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-black text-lg flex items-center gap-3 text-white">
                <i className="fas fa-list-check text-blue-500"></i> Responder Checklist
              </h3>
              <button onClick={() => setSelectedIncident(null)} className="text-slate-500 hover:text-white"><i className="fas fa-times"></i></button>
            </div>
            
            <div className="space-y-2 mb-6">
              {selectedIncident.checklist.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => toggleChecklistItem(selectedIncident.id, item.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    item.completed ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-slate-800 border-slate-700'
                  }`}
                >
                  <i className={`fas ${item.completed ? 'fa-check-circle' : 'fa-circle-dot'} ${item.completed ? 'text-green-500' : 'text-slate-600'}`}></i>
                  <span className={`text-xs font-bold ${item.completed ? 'line-through opacity-50' : ''}`}>{item.task}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => resolveIncident(selectedIncident.id)}
              className="w-full bg-green-600 hover:bg-green-700 py-4 rounded-xl font-black text-xs uppercase tracking-tighter shadow-lg shadow-green-900/20"
            >
              Resolve Incident
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardView;
