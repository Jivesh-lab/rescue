import React from 'react';

const SettingsView = ({ settings, setSettings }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
        <i className="fas fa-cog text-blue-500"></i> System Configuration
      </h2>

      {/* Agency Information */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <h3 className="text-lg font-black mb-6 flex items-center gap-3">
          <i className="fas fa-building text-blue-400"></i> Agency Information
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Agency Display Name</label>
            <input 
              type="text" 
              value={settings.agencyName}
              onChange={(e) => setSettings({...settings, agencyName: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Coverage Region</label>
            <input 
              type="text" 
              value={settings.region}
              onChange={(e) => setSettings({...settings, region: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 font-bold"
            />
          </div>
        </div>
      </div>

      {/* Emergency Contact Numbers */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <h3 className="text-lg font-black mb-6 flex items-center gap-3">
          <i className="fas fa-phone-volume text-red-400"></i> Emergency Contact Numbers
        </h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hospital Emergency</label>
            <div className="flex items-center gap-3">
              <i className="fas fa-hospital text-red-500 text-xl"></i>
              <input 
                type="text" 
                value={settings.hospitalNumber || '102'}
                onChange={(e) => setSettings({...settings, hospitalNumber: e.target.value})}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-red-500 font-bold text-red-400"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fire Department</label>
            <div className="flex items-center gap-3">
              <i className="fas fa-fire-extinguisher text-orange-500 text-xl"></i>
              <input 
                type="text" 
                value={settings.fireNumber || '101'}
                onChange={(e) => setSettings({...settings, fireNumber: e.target.value})}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-orange-500 font-bold text-orange-400"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Police Emergency</label>
            <div className="flex items-center gap-3">
              <i className="fas fa-shield-halved text-blue-500 text-xl"></i>
              <input 
                type="text" 
                value={settings.policeNumber || '100'}
                onChange={(e) => setSettings({...settings, policeNumber: e.target.value})}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 font-bold text-blue-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <h3 className="text-lg font-black mb-6 flex items-center gap-3">
          <i className="fas fa-bell text-yellow-400"></i> Notification Preferences
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-6 bg-slate-800/40 rounded-3xl border border-slate-700">
            <div>
              <h4 className="font-black text-sm">Push Notifications</h4>
              <p className="text-[10px] text-slate-500 font-bold">Receive alerts for new incidents</p>
            </div>
            <button 
              onClick={() => setSettings({...settings, notifications: !settings.notifications})}
              className={`w-12 h-6 rounded-full transition-all relative ${settings.notifications ? 'bg-blue-600 shadow-lg shadow-blue-900/40' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.notifications ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>
          <div className="flex items-center justify-between p-6 bg-slate-800/40 rounded-3xl border border-slate-700">
            <div>
              <h4 className="font-black text-sm">Sound Alerts</h4>
              <p className="text-[10px] text-slate-500 font-bold">Play sound for critical incidents</p>
            </div>
            <button 
              onClick={() => setSettings({...settings, soundAlerts: !settings.soundAlerts})}
              className={`w-12 h-6 rounded-full transition-all relative ${settings.soundAlerts ? 'bg-blue-600 shadow-lg shadow-blue-900/40' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.soundAlerts ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>
        </div>
      </div>

      {/* Map & Location Settings */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <h3 className="text-lg font-black mb-6 flex items-center gap-3">
          <i className="fas fa-map text-green-400"></i> Map & Location
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Search Radius (km)</label>
            <input 
              type="number" 
              value={settings.searchRadius || 10}
              onChange={(e) => setSettings({...settings, searchRadius: parseInt(e.target.value)})}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 font-bold"
              min="1"
              max="50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Data Refresh (seconds)</label>
            <input 
              type="number" 
              value={settings.refreshInterval || 300}
              onChange={(e) => setSettings({...settings, refreshInterval: parseInt(e.target.value)})}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 font-bold"
              min="30"
              max="3600"
            />
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <h3 className="text-lg font-black mb-6 flex items-center gap-3">
          <i className="fas fa-database text-cyan-400"></i> Data Management
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => {
              const dataStr = JSON.stringify({
                incidents: JSON.parse(localStorage.getItem('rescue_incidents') || '[]'),
                resources: JSON.parse(localStorage.getItem('rescue_resources') || '[]'),
                exportDate: new Date().toISOString()
              }, null, 2);
              const dataBlob = new Blob([dataStr], {type: 'application/json'});
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `rescuenet-export-${Date.now()}.json`;
              link.click();
            }}
            className="py-4 text-blue-400 font-black text-xs uppercase tracking-widest border border-blue-900/30 rounded-2xl hover:bg-blue-500/5 transition-colors"
          >
            <i className="fas fa-download mr-2"></i> Export Data (JSON)
          </button>
          <button 
            onClick={() => {
              localStorage.removeItem('rescue_resources');
              localStorage.removeItem('rescue_userPos');
              window.location.reload();
            }}
            className="py-4 text-yellow-400 font-black text-xs uppercase tracking-widest border border-yellow-900/30 rounded-2xl hover:bg-yellow-500/5 transition-colors"
          >
            <i className="fas fa-sync mr-2"></i> Refresh Live Data
          </button>
        </div>
        <button 
          onClick={() => { 
            if (confirm('This will delete all incidents and reset the system. Continue?')) {
              localStorage.clear(); 
              window.location.reload(); 
            }
          }} 
          className="w-full mt-4 py-4 text-red-500 font-black text-xs uppercase tracking-widest border border-red-900/30 rounded-2xl hover:bg-red-500/5 transition-colors"
        >
          <i className="fas fa-trash-alt mr-2"></i> Factory Reset System
        </button>
      </div>
    </div>
  );
};

export default SettingsView;
