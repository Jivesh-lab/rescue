// Emergency Services Data Fetching Service
// Uses OpenStreetMap Overpass API to fetch real emergency services data

interface EmergencyService {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  contact: string;
  capacity?: number;
  currentLoad?: number;
  address?: string;
  emergency?: string;
}

const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

// Fetch nearby hospitals
export const fetchNearbyHospitals = async (lat: number, lng: number, radius = 5000): Promise<EmergencyService[]> => {
  const query = `
    [out:json];
    (
      node["amenity"="hospital"](around:${radius},${lat},${lng});
      way["amenity"="hospital"](around:${radius},${lat},${lng});
    );
    out center;
  `;

  try {
    const response = await fetch(OVERPASS_API, {
      method: 'POST',
      body: query
    });
    const data = await response.json();
    
    return data.elements.map((element: any, index: number) => ({
      id: `hospital-${element.id}`,
      name: element.tags?.name || `Hospital ${index + 1}`,
      type: 'HOSPITAL',
      lat: element.lat || element.center?.lat || lat,
      lng: element.lon || element.center?.lon || lng,
      contact: element.tags?.phone || element.tags?.['contact:phone'] || '102',
      capacity: Math.floor(Math.random() * 150) + 50, // Simulated capacity
      currentLoad: Math.floor(Math.random() * 100) + 20,
      address: element.tags?.['addr:full'] || element.tags?.['addr:street'] || 'Address unavailable',
      emergency: element.tags?.emergency || 'yes',
      status: 'available'
    }));
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    return [];
  }
};

// Fetch nearby fire stations
export const fetchNearbyFireStations = async (lat: number, lng: number, radius = 5000): Promise<EmergencyService[]> => {
  const query = `
    [out:json];
    (
      node["amenity"="fire_station"](around:${radius},${lat},${lng});
      way["amenity"="fire_station"](around:${radius},${lat},${lng});
    );
    out center;
  `;

  try {
    const response = await fetch(OVERPASS_API, {
      method: 'POST',
      body: query
    });
    const data = await response.json();
    
    return data.elements.map((element: any, index: number) => ({
      id: `fire-${element.id}`,
      name: element.tags?.name || `Fire Station ${index + 1}`,
      type: 'FIRE_STATION',
      lat: element.lat || element.center?.lat || lat,
      lng: element.lon || element.center?.lon || lng,
      contact: element.tags?.phone || element.tags?.['contact:phone'] || '101',
      capacity: 6,
      currentLoad: 0,
      address: element.tags?.['addr:full'] || element.tags?.['addr:street'] || 'Address unavailable',
      status: 'available'
    }));
  } catch (error) {
    console.error('Error fetching fire stations:', error);
    return [];
  }
};

// Fetch nearby police stations
export const fetchNearbyPoliceStations = async (lat: number, lng: number, radius = 5000): Promise<EmergencyService[]> => {
  const query = `
    [out:json];
    (
      node["amenity"="police"](around:${radius},${lat},${lng});
      way["amenity"="police"](around:${radius},${lat},${lng});
    );
    out center;
  `;

  try {
    const response = await fetch(OVERPASS_API, {
      method: 'POST',
      body: query
    });
    const data = await response.json();
    
    return data.elements.map((element: any, index: number) => ({
      id: `police-${element.id}`,
      name: element.tags?.name || `Police Station ${index + 1}`,
      type: 'POLICE_STATION',
      lat: element.lat || element.center?.lat || lat,
      lng: element.lon || element.center?.lon || lng,
      contact: element.tags?.phone || element.tags?.['contact:phone'] || '100',
      capacity: 4,
      currentLoad: 0,
      address: element.tags?.['addr:full'] || element.tags?.['addr:street'] || 'Address unavailable',
      status: 'available'
    }));
  } catch (error) {
    console.error('Error fetching police stations:', error);
    return [];
  }
};

// Fetch nearby shelters
export const fetchNearbyShelters = async (lat: number, lng: number, radius = 5000): Promise<EmergencyService[]> => {
  const query = `
    [out:json];
    (
      node["amenity"="shelter"](around:${radius},${lat},${lng});
      way["amenity"="shelter"](around:${radius},${lat},${lng});
      node["emergency"="assembly_point"](around:${radius},${lat},${lng});
      way["social_facility"="shelter"](around:${radius},${lat},${lng});
    );
    out center;
  `;

  try {
    const response = await fetch(OVERPASS_API, {
      method: 'POST',
      body: query
    });
    const data = await response.json();
    
    return data.elements.map((element: any, index: number) => ({
      id: `shelter-${element.id}`,
      name: element.tags?.name || `Emergency Shelter ${index + 1}`,
      type: 'SHELTER',
      lat: element.lat || element.center?.lat || lat,
      lng: element.lon || element.center?.lon || lng,
      contact: element.tags?.phone || element.tags?.['contact:phone'] || '911',
      capacity: Math.floor(Math.random() * 400) + 100,
      currentLoad: Math.floor(Math.random() * 100) + 20,
      address: element.tags?.['addr:full'] || element.tags?.['addr:street'] || 'Address unavailable',
      status: 'available'
    }));
  } catch (error) {
    console.error('Error fetching shelters:', error);
    return [];
  }
};

// Fetch all emergency services
export const fetchAllEmergencyServices = async (lat: number, lng: number, radius = 5000): Promise<EmergencyService[]> => {
  try {
    const [hospitals, fireStations, policeStations, shelters] = await Promise.all([
      fetchNearbyHospitals(lat, lng, radius),
      fetchNearbyFireStations(lat, lng, radius),
      fetchNearbyPoliceStations(lat, lng, radius),
      fetchNearbyShelters(lat, lng, radius)
    ]);

    // Add some ambulances from nearby hospitals
    const ambulances = hospitals.slice(0, 3).map((hospital, idx) => ({
      id: `ambulance-${idx + 1}`,
      name: `Ambulance Unit ${idx + 1}`,
      type: 'AMBULANCE',
      lat: hospital.lat + (Math.random() - 0.5) * 0.01,
      lng: hospital.lng + (Math.random() - 0.5) * 0.01,
      contact: hospital.contact,
      capacity: 4,
      currentLoad: 0,
      status: 'available'
    }));

    return [...hospitals, ...fireStations, ...policeStations, ...shelters, ...ambulances];
  } catch (error) {
    console.error('Error fetching emergency services:', error);
    return [];
  }
};
