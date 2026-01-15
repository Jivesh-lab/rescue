import React from 'react';
import { Severity, ConfidenceLevel } from '../../types';

const AnalyticsView = ({ incidents, incidentDistribution }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-3 gap-8">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl col-span-2">
          <h3 className="font-black text-sm text-slate-500 uppercase mb-8">
            Incident Distribution ({incidents.length} Total)
          </h3>
          {incidents.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-600">
              <div className="text-center">
                <i className="fas fa-chart-bar text-5xl mb-4 opacity-20"></i>
                <p className="font-bold">No incident data available</p>
              </div>
            </div>
          ) : (
            <div className="flex items-end gap-6 h-48 px-4">
              {incidentDistribution.map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                  <div className="w-full bg-slate-800 rounded-xl relative overflow-hidden h-full flex items-end">
                    {bar.count > 0 ? (
                      <div 
                        className={`w-full ${bar.color} transition-all duration-1000 rounded-t-xl`} 
                        style={{ height: bar.height, minHeight: '20px' }}
                      ></div>
                    ) : (
                      <div className="w-full h-2 bg-slate-700/50 rounded-t-xl"></div>
                    )}
                  </div>
                  <div className="text-center">
                    <div className={`text-xl font-black ${bar.count > 0 ? bar.color.replace('bg-', 'text-') : 'text-slate-600'}`}>
                      {bar.count}
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase">{bar.label}</span>
                    <div className="text-[9px] text-slate-600 font-bold">
                      {bar.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col justify-center">
          <h3 className="font-black text-sm text-slate-500 uppercase mb-6 text-center">Safety Index</h3>
          <div className="relative w-40 h-40 mx-auto">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-slate-800" />
              <circle cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="12" strokeDasharray="440" strokeDashoffset={440 - (440 * 0.82)} className="text-blue-500" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black">82%</span>
              <span className="text-[10px] font-black text-slate-500 uppercase">Secure</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown by Type */}
      <div className="grid grid-cols-5 gap-6">
        {incidentDistribution.map((type, idx) => {
          const incidentTypeMap = {
            'Fire': 'FIRE',
            'Medical': 'MEDICAL',
            'Accident': 'ACCIDENT',
            'Flood': 'FLOOD',
            'Crime': 'CRIME'
          };
          const typeIncidents = incidents.filter(inc => inc.type === incidentTypeMap[type.label]);
          const activeCount = typeIncidents.filter(inc => inc.status === 'active').length;
          const resolvedCount = typeIncidents.filter(inc => inc.status === 'resolved').length;
          const criticalCount = typeIncidents.filter(inc => inc.severity === Severity.CRITICAL).length;
          const highCount = typeIncidents.filter(inc => inc.severity === Severity.HIGH).length;
          const mediumCount = typeIncidents.filter(inc => inc.severity === Severity.MEDIUM).length;
          const lowCount = typeIncidents.filter(inc => inc.severity === Severity.LOW).length;
          const highConfidence = typeIncidents.filter(inc => inc.confidence === ConfidenceLevel.HIGH).length;
          const mediumConfidence = typeIncidents.filter(inc => inc.confidence === ConfidenceLevel.MEDIUM).length;
          const lowConfidence = typeIncidents.filter(inc => inc.confidence === ConfidenceLevel.LOW).length;

          return (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className={`${type.color} p-4 text-white`}>
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm uppercase">{type.label}</h4>
                  <span className="text-2xl font-black">{type.count}</span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {/* Status Breakdown */}
                <div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-2">Status</span>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-slate-800 rounded-lg p-2 text-center">
                      <div className="text-green-500 font-black text-lg">{activeCount}</div>
                      <div className="text-[8px] text-slate-500 font-bold uppercase">Active</div>
                    </div>
                    <div className="flex-1 bg-slate-800 rounded-lg p-2 text-center">
                      <div className="text-slate-400 font-black text-lg">{resolvedCount}</div>
                      <div className="text-[8px] text-slate-500 font-bold uppercase">Resolved</div>
                    </div>
                  </div>
                </div>

                {/* Severity Breakdown */}
                <div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-2">Severity</span>
                  <div className="space-y-1.5">
                    {criticalCount > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-800 rounded h-1.5 overflow-hidden">
                          <div className="bg-red-600 h-full" style={{ width: `${(criticalCount/type.count)*100}%` }}></div>
                        </div>
                        <span className="text-[9px] text-red-500 font-black w-6">{criticalCount}</span>
                      </div>
                    )}
                    {highCount > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-800 rounded h-1.5 overflow-hidden">
                          <div className="bg-orange-600 h-full" style={{ width: `${(highCount/type.count)*100}%` }}></div>
                        </div>
                        <span className="text-[9px] text-orange-500 font-black w-6">{highCount}</span>
                      </div>
                    )}
                    {mediumCount > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-800 rounded h-1.5 overflow-hidden">
                          <div className="bg-yellow-600 h-full" style={{ width: `${(mediumCount/type.count)*100}%` }}></div>
                        </div>
                        <span className="text-[9px] text-yellow-500 font-black w-6">{mediumCount}</span>
                      </div>
                    )}
                    {lowCount > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-800 rounded h-1.5 overflow-hidden">
                          <div className="bg-green-600 h-full" style={{ width: `${(lowCount/type.count)*100}%` }}></div>
                        </div>
                        <span className="text-[9px] text-green-500 font-black w-6">{lowCount}</span>
                      </div>
                    )}
                    {type.count === 0 && (
                      <div className="text-center text-[9px] text-slate-600 py-2">No data</div>
                    )}
                  </div>
                </div>

                {/* Confidence Breakdown */}
                <div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-2">Confidence</span>
                  <div className="flex gap-1.5">
                    <div className="flex-1 bg-slate-800 rounded-lg p-2 text-center">
                      <div className="text-blue-400 font-black">{highConfidence}</div>
                      <div className="text-[7px] text-slate-500 font-bold uppercase">High</div>
                    </div>
                    <div className="flex-1 bg-slate-800 rounded-lg p-2 text-center">
                      <div className="text-yellow-400 font-black">{mediumConfidence}</div>
                      <div className="text-[7px] text-slate-500 font-bold uppercase">Med</div>
                    </div>
                    <div className="flex-1 bg-slate-800 rounded-lg p-2 text-center">
                      <div className="text-slate-400 font-black">{lowConfidence}</div>
                      <div className="text-[7px] text-slate-500 font-bold uppercase">Low</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnalyticsView;
