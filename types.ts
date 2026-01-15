
export enum Severity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum IncidentType {
  FIRE = 'FIRE',
  MEDICAL = 'MEDICAL',
  ACCIDENT = 'ACCIDENT',
  FLOOD = 'FLOOD',
  CRIME = 'CRIME'
}

export enum ResourceType {
  AMBULANCE = 'AMBULANCE',
  FIRE_TRUCK = 'FIRE_TRUCK',
  FIRE_STATION = 'FIRE_STATION',
  HOSPITAL = 'HOSPITAL',
  SHELTER = 'SHELTER',
  POLICE_CAR = 'POLICE_CAR',
  POLICE_STATION = 'POLICE_STATION'
}

export enum ConfidenceLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
}

export interface Incident {
  id: string;
  type: IncidentType;
  description: string;
  severity: Severity;
  lat: number;
  lng: number;
  timestamp: number;
  status: 'active' | 'resolved';
  photoAttached: boolean;
  locationAccuracy: 'high' | 'low';
  confidence: ConfidenceLevel;
  checklist: ChecklistItem[];
}

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  status: 'available' | 'busy' | 'offline';
  lat: number;
  lng: number;
  contact: string;
  capacity?: number;
  currentLoad?: number;
  assignedTo?: string;
}

export interface Settings {
  agencyName: string;
  region: string;
  autoTriage: boolean;
  notifications: boolean;
}

export enum StressLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}
