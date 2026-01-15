import React from 'react';
import { ResourceType } from '../../types';
import { fetchAllEmergencyServices } from '../services/emergencyDataService';

const LiveMonitorView = ({ 
  resources, 
  userPos, 
  loadingServices, 
  setLoadingServices, 
  setResources,
  openEditResourceModal 
}) => {
  const handleRefresh = async () => {
    setLoadingServices(true);
    try {
      const liveServices = await fetchAllEmergencyServices(userPos.lat, userPos.lng, 10000);
      if (liveServices.length > 0) {
        setResources(liveServices);
        localStorage.setItem('rescue_resources', JSON.stringify(liveServices));
      }
    } catch (error) {
      console.error('Failed to refresh services:', error);
    } finally {
      setLoadingServices(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black flex items-center gap-3">
          <i className="fas fa-heartbeat text-red-500"></i> Real-Time Resource Monitor
        </h2>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={loadingServices}
            className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-xl text-xs font-bold border border-blue-600/50 transition-all disabled:opacity-50"
          >
            <i className={`fas fa-sync-alt mr-2 ${loadingServices ? 'animate-spin' : ''}`}></i>
            {loadingServices ? 'Refreshing...' : 'Refresh Data'}
          </button>
          <span className="px-4 py-2 bg-green-500/10 text-green-500 rounded-xl text-xs font-bold border border-green-500/30">
            <i className="fas fa-circle animate-pulse mr-2"></i>Live Updates
          </span>
        </div>
      </div>

      {loadingServices && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
          <p className="text-slate-400 font-bold">Loading live emergency services data...</p>
        </div>
      )}

      {/* Ambulances */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="bg-blue-600 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <i className="fas fa-ambulance text-3xl"></i>
            <div>
              <h3 className="font-black text-xl">Ambulances</h3>
              <p className="text-xs text-blue-100">Emergency Medical Transport</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black">
              {resources.filter(r => r.type === ResourceType.AMBULANCE && r.status === 'available').length}/{resources.filter(r => r.type === ResourceType.AMBULANCE).length}
            </div>
            <div className="text-xs">Available</div>
          </div>
        </div>
        <div className="p-6 grid grid-cols-3 gap-4">
          {resources.filter(r => r.type === ResourceType.AMBULANCE).map(res => (
            <div key={res.id} className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-black text-lg">{res.name}</h4>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                  res.status === 'available' ? 'bg-green-500/20 text-green-500' : 
                  res.status === 'busy' ? 'bg-orange-500/20 text-orange-500' : 
                  'bg-slate-500/20 text-slate-500'
                }`}>
                  {res.status}
                </span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Capacity:</span>
                  <span className="font-bold">{res.currentLoad || 0}/{res.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Contact:</span>
                  <span className="font-bold text-blue-400">{res.contact}</span>
                </div>
                {res.address && (
                  <div className="text-xs text-slate-500 pt-2 border-t border-slate-700">
                    <i className="fas fa-map-marker-alt mr-2"></i>{res.address}
                  </div>
                )}
                {res.assignedTo && (
                  <div className="mt-3 pt-3 border-t border-slate-700 text-xs text-yellow-400">
                    <i className="fas fa-route mr-2"></i>Assigned to incident #{res.assignedTo}
                  </div>
                )}
                <button 
                  onClick={() => openEditResourceModal(res)}
                  className="w-full mt-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 text-blue-400 py-2 rounded-xl text-xs font-bold transition-all"
                >
                  <i className="fas fa-edit mr-2"></i>Update Status
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hospitals */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="bg-red-600 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <i className="fas fa-hospital text-3xl"></i>
            <div>
              <h3 className="font-black text-xl">Hospitals</h3>
              <p className="text-xs text-red-100">Medical Facilities & Beds</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black">
              {resources.filter(r => r.type === ResourceType.HOSPITAL).reduce((sum, r) => sum + (r.capacity - r.currentLoad), 0)}
            </div>
            <div className="text-xs">Beds Available</div>
          </div>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          {resources.filter(r => r.type === ResourceType.HOSPITAL).slice(0, 16).map(res => {
            const utilization = Math.round((res.currentLoad / res.capacity) * 100);
            const available = res.capacity - res.currentLoad;
            return (
              <div key={res.id} className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-black text-lg">{res.name}</h4>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                    utilization < 70 ? 'bg-green-500/20 text-green-500' : 
                    utilization < 90 ? 'bg-yellow-500/20 text-yellow-500' : 
                    'bg-red-500/20 text-red-500'
                  }`}>
                    {utilization}% Full
                  </span>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Bed Availability</span>
                    <span className="font-black">{available}/{res.capacity}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full transition-all ${
                        utilization < 70 ? 'bg-green-500' : 
                        utilization < 90 ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}
                      style={{ width: `${utilization}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <i className="fas fa-phone-volume text-red-500"></i>
                    <span>{res.contact}</span>
                  </div>
                  {res.address && (
                    <div className="flex items-start gap-2 text-slate-400">
                      <i className="fas fa-map-marker-alt text-red-500 mt-1"></i>
                      <span className="text-xs">{res.address}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-slate-400">
                    <i className="fas fa-location-dot text-red-500"></i>
                    <span>GPS: {res.lat.toFixed(4)}, {res.lng.toFixed(4)}</span>
                  </div>
                </div>
                <button 
                  onClick={() => openEditResourceModal(res)}
                  className="w-full mt-4 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 text-red-400 py-2 rounded-xl text-xs font-bold transition-all"
                >
                  <i className="fas fa-edit mr-2"></i>Update Capacity
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shelters */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="bg-purple-600 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <i className="fas fa-house-circle-check text-3xl"></i>
            <div>
              <h3 className="font-black text-xl">Emergency Shelters</h3>
              <p className="text-xs text-purple-100">Evacuation & Temporary Housing</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black">
              {resources.filter(r => r.type === ResourceType.SHELTER).reduce((sum, r) => sum + (r.capacity - r.currentLoad), 0)}
            </div>
            <div className="text-xs">Spaces Available</div>
          </div>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          {resources.filter(r => r.type === ResourceType.SHELTER).map(res => {
            const utilization = Math.round((res.currentLoad / res.capacity) * 100);
            const available = res.capacity - res.currentLoad;
            return (
              <div key={res.id} className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-black text-lg">{res.name}</h4>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                    utilization < 60 ? 'bg-green-500/20 text-green-500' : 
                    utilization < 85 ? 'bg-yellow-500/20 text-yellow-500' : 
                    'bg-red-500/20 text-red-500'
                  }`}>
                    {utilization}% Occupied
                  </span>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Space Availability</span>
                    <span className="font-black">{available}/{res.capacity}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full transition-all ${
                        utilization < 60 ? 'bg-green-500' : 
                        utilization < 85 ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}
                      style={{ width: `${utilization}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <i className="fas fa-phone-volume text-purple-500"></i>
                    <span>{res.contact}</span>
                  </div>
                  {res.address && (
                    <div className="flex items-start gap-2 text-slate-400">
                      <i className="fas fa-map-marker-alt text-purple-500 mt-1"></i>
                      <span className="text-xs">{res.address}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-slate-400">
                    <i className="fas fa-location-dot text-purple-500"></i>
                    <span>GPS: {res.lat.toFixed(4)}, {res.lng.toFixed(4)}</span>
                  </div>
                </div>
                <button 
                  onClick={() => openEditResourceModal(res)}
                  className="w-full mt-4 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-600/50 text-purple-400 py-2 rounded-xl text-xs font-bold transition-all"
                >
                  <i className="fas fa-edit mr-2"></i>Update Capacity
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Police Stations */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="bg-blue-600 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <i className="fas fa-shield-halved text-3xl"></i>
            <div>
              <h3 className="font-black text-xl">Police Stations</h3>
              <p className="text-xs text-blue-100">Law Enforcement & Security</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black">
              {resources.filter(r => r.type === ResourceType.POLICE_STATION && r.status === 'available').length}/{resources.filter(r => r.type === ResourceType.POLICE_STATION).length}
            </div>
            <div className="text-xs">Units Available</div>
          </div>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          {resources.filter(r => r.type === ResourceType.POLICE_STATION).map(res => (
            <div key={res.id} className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-black text-lg">{res.name}</h4>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                  res.status === 'available' ? 'bg-green-500/20 text-green-500' : 
                  res.status === 'busy' ? 'bg-orange-500/20 text-orange-500' : 
                  'bg-slate-500/20 text-slate-500'
                }`}>
                  {res.status}
                </span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Units:</span>
                  <span className="font-bold">{res.currentLoad || 0}/{res.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Contact:</span>
                  <span className="font-bold text-blue-400">{res.contact}</span>
                </div>
                {res.address && (
                  <div className="text-xs text-slate-500 pt-2 border-t border-slate-700">
                    <i className="fas fa-map-marker-alt mr-2"></i>{res.address}
                  </div>
                )}
                <button 
                  onClick={() => openEditResourceModal(res)}
                  className="w-full mt-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 text-blue-400 py-2 rounded-xl text-xs font-bold transition-all"
                >
                  <i className="fas fa-edit mr-2"></i>Update Status
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fire Departments */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="bg-orange-600 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <i className="fas fa-fire-extinguisher text-3xl"></i>
            <div>
              <h3 className="font-black text-xl">Fire Departments</h3>
              <p className="text-xs text-orange-100">Fire Suppression & Rescue</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black">
              {resources.filter(r => r.type === ResourceType.FIRE_STATION && r.status === 'available').length}/{resources.filter(r => r.type === ResourceType.FIRE_STATION).length}
            </div>
            <div className="text-xs">Units Available</div>
          </div>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          {resources.filter(r => r.type === ResourceType.FIRE_STATION).map(res => (
            <div key={res.id} className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-black text-lg">{res.name}</h4>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                  res.status === 'available' ? 'bg-green-500/20 text-green-500' : 
                  res.status === 'busy' ? 'bg-orange-500/20 text-orange-500' : 
                  'bg-slate-500/20 text-slate-500'
                }`}>
                  {res.status}
                </span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Crew Capacity:</span>
                  <span className="font-bold">{res.currentLoad || 0}/{res.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Emergency:</span>
                  <span className="font-bold text-orange-400">{res.contact}</span>
                </div>
                {res.address && (
                  <div className="text-xs text-slate-500 pt-2 border-t border-slate-700">
                    <i className="fas fa-map-marker-alt mr-2"></i>{res.address}
                  </div>
                )}
                <button 
                  onClick={() => openEditResourceModal(res)}
                  className="w-full mt-3 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-600/50 text-orange-400 py-2 rounded-xl text-xs font-bold transition-all"
                >
                  <i className="fas fa-edit mr-2"></i>Update Status
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveMonitorView;
