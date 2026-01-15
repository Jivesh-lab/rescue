
import React, { useState, useEffect, useMemo } from 'react';
import { Severity, IncidentType, ResourceType, ConfidenceLevel, StressLevel } from '../types';
import { CHECKLIST_TEMPLATES } from '../constants';
import { autoTriageIncident, generateTacticalSummary } from './src/services/geminiService';
import { fetchAllEmergencyServices } from './services/emergencyDataService';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import LiveMonitorView from './components/LiveMonitorView';
import ResourcesView from './components/ResourcesView';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';
import BroadcastModal from './components/BroadcastModal';
import ResourceEditModal from './components/ResourceEditModal';

const INITIAL_RESOURCES = [
  { id: '1', name: 'Alpha 1', type: ResourceType.AMBULANCE, status: 'available', lat: 0, lng: 0, contact: '555-0101', capacity: 2, currentLoad: 0 },
  { id: '2', name: 'Fire Station 4', type: ResourceType.FIRE_STATION, status: 'available', lat: 0, lng: 0, contact: '101', capacity: 6, currentLoad: 0 },
  { id: '3', name: 'Rescue 9', type: ResourceType.AMBULANCE, status: 'available', lat: 0, lng: 0, contact: '555-0103', capacity: 4, currentLoad: 0 },
  { id: '4', name: 'Police Station 12', type: ResourceType.POLICE_STATION, status: 'available', lat: 0, lng: 0, contact: '100', capacity: 4, currentLoad: 2 },
  { id: '5', name: 'Central Hospital', type: ResourceType.HOSPITAL, status: 'available', lat: 0, lng: 0, contact: '102', capacity: 150, currentLoad: 89 },
  { id: '6', name: 'St. Mary Medical Center', type: ResourceType.HOSPITAL, status: 'available', lat: 0, lng: 0, contact: '102', capacity: 200, currentLoad: 165 },
  { id: '7', name: 'Emergency Shelter A', type: ResourceType.SHELTER, status: 'available', lat: 0, lng: 0, contact: '555-0301', capacity: 500, currentLoad: 120 },
  { id: '8', name: 'Community Shelter B', type: ResourceType.SHELTER, status: 'available', lat: 0, lng: 0, contact: '555-0302', capacity: 300, currentLoad: 45 },
];

const INITIAL_SETTINGS = {
  agencyName: "RescueNet Global",
  region: "Auto-Detected",
  autoTriage: true,
  notifications: true,
};

const App = () => {
  const [view, setView] = useState('dashboard');
  const [incidents, setIncidents] = useState([]);
  const [resources, setResources] = useState(() => {
    const saved = localStorage.getItem('rescue_resources');
    return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
  });
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isEditResourceModalOpen, setIsEditResourceModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [tacticalSummary, setTacticalSummary] = useState("Scanning area for signals...");
  const [loading, setLoading] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const [userPos, setUserPos] = useState(() => {
    const saved = localStorage.getItem('rescue_userPos');
    return saved ? JSON.parse(saved) : { lat: 40.7128, lng: -74.0060 };
  });

  // Geolocation & Load Live Emergency Services Data
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserPos(coords);
        localStorage.setItem('rescue_userPos', JSON.stringify(coords));
        
        // Fetch live emergency services data
        setLoadingServices(true);
        try {
          const liveServices = await fetchAllEmergencyServices(coords.lat, coords.lng, 10000);
          if (liveServices.length > 0) {
            setResources(liveServices);
            localStorage.setItem('rescue_resources', JSON.stringify(liveServices));
          } else {
            // Fallback to initial resources if no data found
            const fallbackResources = INITIAL_RESOURCES.map((res, i) => ({
              ...res,
              lat: coords.lat + (Math.random() - 0.5) * 0.03,
              lng: coords.lng + (Math.random() - 0.5) * 0.03
            }));
            setResources(fallbackResources);
            localStorage.setItem('rescue_resources', JSON.stringify(fallbackResources));
          }
        } catch (error) {
          console.error('Failed to fetch live services:', error);
          // Use initial resources with updated positions
          const fallbackResources = INITIAL_RESOURCES.map((res, i) => ({
            ...res,
            lat: coords.lat + (Math.random() - 0.5) * 0.03,
            lng: coords.lng + (Math.random() - 0.5) * 0.03
          }));
          setResources(fallbackResources);
          localStorage.setItem('rescue_resources', JSON.stringify(fallbackResources));
        } finally {
          setLoadingServices(false);
        }
      });
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('rescue_incidents');
    if (saved) setIncidents(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('rescue_incidents', JSON.stringify(incidents));
    const active = incidents.filter(i => i.status === 'active');
    generateTacticalSummary(active).then(setTacticalSummary);
  }, [incidents]);

  // FEATURE 3: Community Pulse Calculation
  const communityStress = useMemo(() => {
    const active = incidents.filter(i => i.status === 'active');
    const busyCount = resources.filter(r => r.status === 'busy').length;
    const resourceStrain = (busyCount / resources.length) * 100;
    
    let baseScore = active.length * 2;
    active.forEach(i => {
      if (i.severity === Severity.CRITICAL) baseScore += 5;
      if (i.severity === Severity.HIGH) baseScore += 3;
    });

    if (baseScore > 15 || resourceStrain > 70) return StressLevel.HIGH;
    if (baseScore > 5 || resourceStrain > 30) return StressLevel.MEDIUM;
    return StressLevel.LOW;
  }, [incidents, resources]);

  // Calculate incident distribution for analytics
  const incidentDistribution = useMemo(() => {
    const distribution = {
      [IncidentType.FIRE]: 0,
      [IncidentType.MEDICAL]: 0,
      [IncidentType.ACCIDENT]: 0,
      [IncidentType.FLOOD]: 0,
      [IncidentType.CRIME]: 0
    };

    incidents.forEach(inc => {
      if (distribution.hasOwnProperty(inc.type)) {
        distribution[inc.type]++;
      }
    });

    const total = incidents.length || 1; // Avoid division by zero
    const maxCount = Math.max(...Object.values(distribution), 1);

    return [
      { 
        label: 'Fire', 
        count: distribution[IncidentType.FIRE], 
        percentage: Math.round((distribution[IncidentType.FIRE] / total) * 100),
        height: `${(distribution[IncidentType.FIRE] / maxCount) * 100}%`,
        color: 'bg-red-500' 
      },
      { 
        label: 'Medical', 
        count: distribution[IncidentType.MEDICAL], 
        percentage: Math.round((distribution[IncidentType.MEDICAL] / total) * 100),
        height: `${(distribution[IncidentType.MEDICAL] / maxCount) * 100}%`,
        color: 'bg-emerald-500' 
      },
      { 
        label: 'Accident', 
        count: distribution[IncidentType.ACCIDENT], 
        percentage: Math.round((distribution[IncidentType.ACCIDENT] / total) * 100),
        height: `${(distribution[IncidentType.ACCIDENT] / maxCount) * 100}%`,
        color: 'bg-orange-500' 
      },
      { 
        label: 'Flood', 
        count: distribution[IncidentType.FLOOD], 
        percentage: Math.round((distribution[IncidentType.FLOOD] / total) * 100),
        height: `${(distribution[IncidentType.FLOOD] / maxCount) * 100}%`,
        color: 'bg-blue-500' 
      },
      { 
        label: 'Crime', 
        count: distribution[IncidentType.CRIME], 
        percentage: Math.round((distribution[IncidentType.CRIME] / total) * 100),
        height: `${(distribution[IncidentType.CRIME] / maxCount) * 100}%`,
        color: 'bg-slate-500' 
      }
    ];
  }, [incidents]);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const description = formData.get('description');
    const type = formData.get('type');
    const imageFile = formData.get('image');
    const videoFile = formData.get('video');
    
    // Check if media files are uploaded
    const hasImage = imageFile && imageFile.size > 0;
    const hasVideo = videoFile && videoFile.size > 0;
    const hasMedia = hasImage || hasVideo;
    
    // Store media type for display
    let mediaType = null;
    let mediaPreview = null;
    if (hasImage) {
      mediaType = 'image';
      mediaPreview = URL.createObjectURL(imageFile);
    } else if (hasVideo) {
      mediaType = 'video';
      mediaPreview = URL.createObjectURL(videoFile);
    }

    const lat = userPos.lat + (Math.random() - 0.5) * 0.01;
    const lng = userPos.lng + (Math.random() - 0.5) * 0.01;

    // FEATURE 1: Confidence Score Logic - Enhanced with media type
    const nearbyCount = incidents.filter(i => 
      Math.abs(i.lat - lat) < 0.01 && Math.abs(i.lng - lng) < 0.01
    ).length;

    let confidence = ConfidenceLevel.LOW;
    // Video provides highest confidence, then image
    if (hasVideo && nearbyCount > 0) confidence = ConfidenceLevel.HIGH;
    else if (hasVideo || (hasImage && nearbyCount > 0)) confidence = ConfidenceLevel.HIGH;
    else if (hasImage || nearbyCount > 0) confidence = ConfidenceLevel.MEDIUM;

    let severity = Severity.MEDIUM;
    if (settings.autoTriage) {
      const triage = await autoTriageIncident(description, type);
      severity = triage.severity;
    }

    const newIncident = {
      id: Date.now().toString(),
      type,
      description,
      severity,
      lat,
      lng,
      timestamp: Date.now(),
      status: 'active',
      photoAttached: hasImage,
      videoAttached: hasVideo,
      mediaType,
      mediaPreview,
      confidence,
      // FEATURE 2: Micro-Checklist Initialization
      checklist: CHECKLIST_TEMPLATES[type].map((task, idx) => ({
        id: `${Date.now()}-${idx}`,
        task,
        completed: false
      }))
    };

    setIncidents(prev => [newIncident, ...prev]);
    setIsReportModalOpen(false);
    setLoading(false);
  };

  const toggleChecklistItem = (incidentId, itemId) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          checklist: inc.checklist.map(item => 
            item.id === itemId ? { ...item, completed: !item.completed } : item
          )
        };
      }
      return inc;
    }));
  };

  const resolveIncident = (id) => {
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, status: 'resolved' } : i));
    setSelectedIncident(null);
  };

  const openEditResourceModal = (resource) => {
    setEditingResource(resource);
    setIsEditResourceModalOpen(true);
  };

  const handleResourceUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedCapacity = parseInt(formData.get('capacity'));
    const updatedLoad = parseInt(formData.get('currentLoad'));
    const updatedStatus = formData.get('status');

    const updatedResources = resources.map(res => 
      res.id === editingResource.id 
        ? { ...res, capacity: updatedCapacity, currentLoad: updatedLoad, status: updatedStatus }
        : res
    );
    
    setResources(updatedResources);
    localStorage.setItem('rescue_resources', JSON.stringify(updatedResources));
    
    setIsEditResourceModalOpen(false);
    setEditingResource(null);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      <Sidebar 
        view={view} 
        setView={setView} 
        setIsReportModalOpen={setIsReportModalOpen} 
      />

      <main className={`flex-1 flex flex-col relative overflow-hidden ${isReportModalOpen ? 'pointer-events-none' : ''}`}>
        <Header 
          communityStress={communityStress} 
          settings={settings} 
        />

        <div className="flex-1 overflow-auto p-8">
          {view === 'dashboard' && (
            <DashboardView
              incidents={incidents}
              resources={resources}
              tacticalSummary={tacticalSummary}
              selectedIncident={selectedIncident}
              setSelectedIncident={setSelectedIncident}
              toggleChecklistItem={toggleChecklistItem}
              resolveIncident={resolveIncident}
            />
          )}

          {view === 'monitor' && (
            <LiveMonitorView
              resources={resources}
              userPos={userPos}
              loadingServices={loadingServices}
              setLoadingServices={setLoadingServices}
              setResources={setResources}
              openEditResourceModal={openEditResourceModal}
            />
          )}

          {view === 'resources' && (
            <ResourcesView resources={resources} />
          )}

          {view === 'analytics' && (
            <AnalyticsView 
              incidents={incidents} 
              incidentDistribution={incidentDistribution} 
            />
          )}

          {view === 'settings' && (
            <SettingsView 
              settings={settings} 
              setSettings={setSettings} 
            />
          )}
        </div>
      </main>

      <BroadcastModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
        loading={loading}
      />

      <ResourceEditModal
        isOpen={isEditResourceModalOpen}
        resource={editingResource}
        onClose={() => setIsEditResourceModalOpen(false)}
        onSubmit={handleResourceUpdate}
      />
    </div>
  );
};

export default App;
