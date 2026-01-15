import React from 'react';
import { ResourceType } from '../../types';

const ResourceEditModal = ({ isOpen, resource, onClose, onSubmit }) => {
  if (!isOpen || !resource) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[9999] flex items-center justify-center p-6 pointer-events-auto">
      <div className="bg-slate-900 w-full max-w-md rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className={`p-8 text-white flex justify-between items-center ${
          resource.type === ResourceType.HOSPITAL ? 'bg-red-600' :
          resource.type === ResourceType.SHELTER ? 'bg-purple-600' :
          'bg-blue-600'
        }`}>
          <h2 className="font-black text-2xl uppercase tracking-tighter">Update Resource</h2>
          <button onClick={onClose} className="bg-white/10 w-10 h-10 rounded-full flex items-center justify-center">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">{resource.name}</label>
            <p className="text-xs text-slate-500 uppercase tracking-wider">{resource.type}</p>
          </div>

          {(resource.type === ResourceType.HOSPITAL || resource.type === ResourceType.SHELTER) && (
            <>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Total Capacity</label>
                <input 
                  type="number" 
                  name="capacity"
                  defaultValue={resource.capacity}
                  required
                  min="0"
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 font-bold text-lg"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Current Occupancy</label>
                <input 
                  type="number" 
                  name="currentLoad"
                  defaultValue={resource.currentLoad}
                  required
                  min="0"
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 font-bold text-lg"
                />
              </div>
            </>
          )}

          {(resource.type === ResourceType.AMBULANCE || resource.type === ResourceType.FIRE_TRUCK || resource.type === ResourceType.POLICE_CAR) && (
            <>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Capacity (Passengers)</label>
                <input 
                  type="number" 
                  name="capacity"
                  defaultValue={resource.capacity}
                  required
                  min="0"
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 font-bold text-lg"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Current Load</label>
                <input 
                  type="number" 
                  name="currentLoad"
                  defaultValue={resource.currentLoad || 0}
                  required
                  min="0"
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 font-bold text-lg"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Status</label>
            <select 
              name="status"
              defaultValue={resource.status}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 font-bold"
            >
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          <button 
            type="submit" 
            className={`w-full py-5 rounded-3xl font-black shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
              resource.type === ResourceType.HOSPITAL ? 'bg-red-600 hover:bg-red-700 shadow-red-900/40' :
              resource.type === ResourceType.SHELTER ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-900/40' :
              'bg-blue-600 hover:bg-blue-700 shadow-blue-900/40'
            }`}
          >
            <i className="fas fa-save"></i> Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResourceEditModal;
