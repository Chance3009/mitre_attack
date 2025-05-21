
// MITRE ATT&CK data types

export type ThreatSeverity = 'Critical' | 'High' | 'Medium' | 'Low';

export type ThreatStatus = 'Detected' | 'Investigating' | 'Contained' | 'Remediated' | 'Blocked';

export type TimeRange = '24h' | '7d' | '30d' | 'all';

export interface Threat {
  id: string;
  techniqueId: string;
  timestamp: string;
  severity: ThreatSeverity;
  status: ThreatStatus;
  description: string;
  details?: Record<string, any>;
}

export interface Subtechnique {
  id: string;
  name: string;
  description: string;
  parentTechniqueId: string;
}

export interface Technique {
  id: string;
  name: string;
  description: string;
  tacticId: string;
  subtechniques: Subtechnique[];
}

export interface Tactic {
  id: string;
  name: string;
  description: string;
  techniques: Technique[];
}

export interface FilterState {
  timeRange: TimeRange;
  severities: ThreatSeverity[];
  statuses: ThreatStatus[];
  tactics: string[];
  showMappedOnly: boolean;
  flatView: boolean;
}
