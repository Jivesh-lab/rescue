
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

const MapComponent = ({ incidents, resources, onSelectIncident }) => {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const markersGroup = useRef(L.layerGroup());
  const resourceGroup = useRef(L.layerGroup());
  const userLocationMarker = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Using CartoDB Voyager - a high-visibility light map
    mapRef.current = L.map(containerRef.current, { zoomControl: false }).setView([40.7128, -74.0060], 13);
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 20
    }).addTo(mapRef.current);

    markersGroup.current.addTo(mapRef.current);
    resourceGroup.current.addTo(mapRef.current);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          mapRef.current.setView([latitude, longitude], 14);
          
          const userIcon = L.divIcon({
            className: 'user-marker',
            html: `<div class="relative flex items-center justify-center">
                    <div class="absolute w-10 h-10 bg-blue-500 rounded-full animate-ping opacity-10"></div>
                    <div class="w-6 h-6 bg-blue-600 border-4 border-white rounded-full shadow-2xl z-10"></div>
                   </div>`,
            iconSize: [40, 40]
          });
          
          if (userLocationMarker.current) {
            userLocationMarker.current.setLatLng([latitude, longitude]);
          } else {
            userLocationMarker.current = L.marker([latitude, longitude], { icon: userIcon })
              .addTo(mapRef.current)
              .bindTooltip("You are here", { direction: 'top', className: 'user-tooltip' });
          }
        },
        null,
        { enableHighAccuracy: true }
      );
    }

    return () => mapRef.current.remove();
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    markersGroup.current.clearLayers();
    
    incidents.filter(inc => inc.status === 'active').forEach(inc => {
      const color = inc.severity === 'CRITICAL' ? '#b91c1c' : 
                   inc.severity === 'HIGH' ? '#ea580c' : 
                   inc.severity === 'MEDIUM' ? '#d97706' : '#059669';
      
      // Determine marker style based on media type
      let markerRadius = 14;
      let markerIcon = '';
      if (inc.videoAttached) {
        markerRadius = 16;
        markerIcon = '📹';
      } else if (inc.photoAttached) {
        markerRadius = 15;
        markerIcon = '📷';
      }
      
      const marker = L.circleMarker([inc.lat, inc.lng], {
        radius: markerRadius,
        fillColor: color,
        color: "#fff",
        weight: inc.videoAttached ? 5 : inc.photoAttached ? 4.5 : 4,
        opacity: 1,
        fillOpacity: 1
      }).addTo(markersGroup.current);

      // Enhanced tooltip with media indicator
      const mediaIndicator = inc.videoAttached ? '<i class="fas fa-video text-purple-500 ml-1"></i>' : 
                            inc.photoAttached ? '<i class="fas fa-camera text-blue-500 ml-1"></i>' : '';

      marker.bindTooltip(`
        <div class="p-2 min-w-[140px] font-sans">
          <div class="font-black uppercase text-[10px] border-b border-slate-100 pb-1 mb-1.5 flex items-center justify-between">
             <span style="color: ${color}" class="flex items-center gap-1">${inc.type} ${mediaIndicator}</span>
             <span class="text-slate-400">Ver. ${inc.confidence}</span>
          </div>
          <p class="text-[10px] text-slate-600 font-bold leading-tight line-clamp-2">"${inc.description}"</p>
          ${inc.videoAttached ? '<div class="text-[9px] text-purple-600 font-black mt-1.5 uppercase">Video Evidence Attached</div>' : 
            inc.photoAttached ? '<div class="text-[9px] text-blue-600 font-black mt-1.5 uppercase">Photo Evidence Attached</div>' : ''}
        </div>
      `, { sticky: true, className: 'custom-map-tooltip' });

      marker.on('click', () => onSelectIncident(inc));
    });
  }, [incidents, onSelectIncident]);

  useEffect(() => {
    if (!mapRef.current) return;
    resourceGroup.current.clearLayers();

    resources.forEach(res => {
      let iconClass, iconSymbol, bgColor, markerSize;
      
      // Determine icon and styling based on resource type
      if (res.type === 'HOSPITAL') {
        iconClass = 'fa-hospital';
        bgColor = res.status === 'available' ? 'bg-red-600' : 'bg-slate-400';
        markerSize = 40;
      } else if (res.type === 'SHELTER') {
        iconClass = 'fa-house-circle-check';
        bgColor = res.status === 'available' ? 'bg-purple-600' : 'bg-slate-400';
        markerSize = 38;
      } else if (res.type === 'AMBULANCE') {
        iconClass = 'fa-truck-medical';
        bgColor = res.status === 'available' ? 'bg-blue-600' : 'bg-slate-400';
        markerSize = 32;
      } else if (res.type === 'FIRE_TRUCK') {
        iconClass = 'fa-fire-extinguisher';
        bgColor = res.status === 'available' ? 'bg-orange-600' : 'bg-slate-400';
        markerSize = 32;
      } else if (res.type === 'FIRE_STATION') {
        iconClass = 'fa-fire-flame-curved';
        bgColor = res.status === 'available' ? 'bg-orange-600' : 'bg-slate-400';
        markerSize = 40;
      } else if (res.type === 'POLICE_CAR') {
        iconClass = 'fa-shield-halved';
        bgColor = res.status === 'available' ? 'bg-blue-600' : 'bg-slate-400';
        markerSize = 32;
      } else if (res.type === 'POLICE_STATION') {
        iconClass = 'fa-building-shield';
        bgColor = res.status === 'available' ? 'bg-blue-600' : 'bg-slate-400';
        markerSize = 40;
      } else {
        iconClass = 'fa-circle-exclamation';
        bgColor = res.status === 'available' ? 'bg-slate-600' : 'bg-slate-400';
        markerSize = 32;
      }

      const icon = L.divIcon({
        className: 'res-marker',
        html: `<div class="rounded-xl flex items-center justify-center border-2 border-white shadow-xl text-white text-xs ${bgColor}" style="width: ${markerSize}px; height: ${markerSize}px;">
                <i class="fas ${iconClass}"></i>
               </div>`,
        iconSize: [markerSize, markerSize]
      });

      const tooltipContent = res.type === 'HOSPITAL' || res.type === 'SHELTER' || res.type === 'FIRE_STATION' || res.type === 'POLICE_STATION' ? 
        `<div class="p-2 font-sans">
          <div class="text-[10px] font-black mb-1">${res.name}</div>
          <div class="text-[9px] text-slate-600">
            ${res.capacity ? `<span class="font-bold">${res.capacity - (res.currentLoad || 0)}</span>/${res.capacity} Available` : res.status.toUpperCase()}
          </div>
         </div>` :
        `<div class="p-2 font-sans">
          <div class="text-[10px] font-black mb-1">${res.name}</div>
          <div class="text-[9px] text-slate-600">${res.status.toUpperCase()}</div>
         </div>`;

      L.marker([res.lat, res.lng], { icon }).addTo(resourceGroup.current)
        .bindTooltip(tooltipContent, { className: 'custom-map-tooltip' });
    });
  }, [resources]);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default MapComponent;
