import React from 'react';
import { IncidentType } from '../types';

const BroadcastModal = ({ isOpen, onClose, onSubmit, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[9999] flex items-center justify-center p-6 pointer-events-auto">
      <div className="bg-slate-900 w-full max-w-lg rounded-[2.5rem] border border-slate-800 shadow-[0_0_100px_-20px_rgba(220,38,38,0.2)] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-red-600 p-8 text-white flex justify-between items-center">
          <h2 className="font-black text-2xl uppercase tracking-tighter">Emergency Signal</h2>
          <button onClick={onClose} className="bg-white/10 w-10 h-10 rounded-full flex items-center justify-center">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Signal Category</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: IncidentType.FIRE, icon: 'fa-fire', label: 'Fire' },
                { id: IncidentType.MEDICAL, icon: 'fa-truck-medical', label: 'Medical' },
                { id: IncidentType.ACCIDENT, icon: 'fa-car-burst', label: 'Accident' },
                { id: IncidentType.FLOOD, icon: 'fa-water', label: 'Flood' },
                { id: IncidentType.CRIME, icon: 'fa-handcuffs', label: 'Crime' },
              ].map(t => (
                <label key={t.id} className="cursor-pointer">
                  <input type="radio" name="type" value={t.id} className="hidden peer" defaultChecked={t.id === IncidentType.FIRE} />
                  <div className="bg-slate-800 p-4 rounded-2xl text-center border-2 border-transparent peer-checked:border-red-600 peer-checked:bg-red-600/10 transition-all flex flex-col items-center gap-2">
                    <i className={`fas ${t.icon} text-xl text-red-500`}></i>
                    <span className="text-[10px] font-black uppercase tracking-widest">{t.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Incident Parameters</label>
            <textarea 
              name="description" 
              required 
              placeholder="Provide details for triage analysis..."
              className="w-full bg-slate-800 border border-slate-700 rounded-3xl p-5 outline-none focus:border-red-600 h-32 resize-none text-sm font-medium"
            ></textarea>
          </div>

          <div className="space-y-4">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Media Evidence (Optional)</label>
            
            <div className="bg-slate-800/50 p-5 rounded-3xl border border-slate-700">
              <label className="flex items-center gap-4 cursor-pointer select-none group">
                <div className="bg-blue-600/20 p-3 rounded-xl text-blue-400 group-hover:bg-blue-600/30 transition-all">
                  <i className="fas fa-image text-xl"></i>
                </div>
                <div className="flex-1">
                  <span className="text-xs font-black text-slate-200 block">Upload Image</span>
                  <span className="text-[10px] font-bold text-slate-500">Photo evidence increases verification confidence</span>
                </div>
                <input type="file" name="image" accept="image/*" className="hidden" />
                <i className="fas fa-upload text-slate-600"></i>
              </label>
            </div>

            <div className="bg-slate-800/50 p-5 rounded-3xl border border-slate-700">
              <label className="flex items-center gap-4 cursor-pointer select-none group">
                <div className="bg-purple-600/20 p-3 rounded-xl text-purple-400 group-hover:bg-purple-600/30 transition-all">
                  <i className="fas fa-video text-xl"></i>
                </div>
                <div className="flex-1">
                  <span className="text-xs font-black text-slate-200 block">Upload Video</span>
                  <span className="text-[10px] font-bold text-slate-500">Video evidence provides highest confidence rating</span>
                </div>
                <input type="file" name="video" accept="video/*" className="hidden" />
                <i className="fas fa-upload text-slate-600"></i>
              </label>
            </div>
          </div>

          <button 
            disabled={loading}
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 py-5 rounded-3xl font-black shadow-2xl shadow-red-900/40 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            {loading ? (
              <><i className="fas fa-spinner fa-spin"></i> TRANSMITTING SIGNAL...</>
            ) : (
              <><i className="fas fa-satellite-dish"></i> INITIATE BROADCAST</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BroadcastModal;
