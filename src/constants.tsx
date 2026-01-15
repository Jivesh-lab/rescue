
import { IncidentType } from '../types';

export const CHECKLIST_TEMPLATES: Record<IncidentType, string[]> = {
  [IncidentType.FIRE]: ['Evacuate area', 'Cut power supply', 'Contain fire perimeter', 'Await fire brigade'],
  [IncidentType.MEDICAL]: ['Assess victim vitals', 'Call medical support', 'Administer first aid/CPR', 'Prep for transport'],
  [IncidentType.ACCIDENT]: ['Secure area/perimeter', 'Check for injuries', 'Call ambulance', 'Control traffic flow'],
  [IncidentType.FLOOD]: ['Move to high ground', 'Shut off utilities', 'Deploy rescue boats', 'Setup emergency shelter'],
  [IncidentType.CRIME]: ['Secure scene', 'Ensure public safety', 'Identify witnesses', 'Collect evidence'],
};

export const TYPE_ICONS: Record<string, string> = {
  FIRE: 'fa-fire-flame-curved',
  MEDICAL: 'fa-truck-medical',
  ACCIDENT: 'fa-car-burst',
  FLOOD: 'fa-water',
  CRIME: 'fa-handcuffs',
};

export const SEVERITY_COLORS: Record<string, string> = {
  LOW: 'bg-emerald-600',
  MEDIUM: 'bg-amber-600',
  HIGH: 'bg-orange-600',
  CRITICAL: 'bg-red-700',
};
