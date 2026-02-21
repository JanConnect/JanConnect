// Status and priority constants
export const STATUSES = {
  ALL: 'all',
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  RESOLVED: 'resolved',
  REJECTED: 'rejected'
};

export const STATUS_OPTIONS = [
  { value: STATUSES.ALL, label: 'All Statuses' },
  { value: STATUSES.PENDING, label: 'Pending' },
  { value: STATUSES.IN_PROGRESS, label: 'In Progress' },
  { value: STATUSES.RESOLVED, label: 'Resolved' },
  { value: STATUSES.REJECTED, label: 'Rejected' }
];

export const PRIORITIES = [
  { value: 'all', label: 'All Priorities' },
  { value: '5', label: 'Critical (5)' },
  { value: '4', label: 'High (4)' },
  { value: '3', label: 'Medium (3)' },
  { value: '2', label: 'Low (2)' },
  { value: '1', label: 'Very Low (1)' }
];

export const DEFAULT_CATEGORIES = [
  'Infrastructure',
  'Sanitation',
  'Street Lighting',
  'Water Supply',
  'Traffic',
  'Parks',
  'Other'
];

export const DEFAULT_MUNICIPALITIES = ['Downtown', 'Suburbia', 'West End'];

// Status icons mapping
export const STATUS_ICONS = {
  [STATUSES.PENDING]: 'Clock',
  [STATUSES.IN_PROGRESS]: 'RefreshCw',
  [STATUSES.RESOLVED]: 'CheckCircle',
  [STATUSES.REJECTED]: 'XCircle'
};

// Priority icons mapping
export const PRIORITY_ICONS = {
  '5': 'AlertTriangle',
  '4': 'AlertTriangle',
  '3': 'AlertCircle',
  '2': 'Info',
  '1': 'Info',
  high: 'AlertTriangle',
  medium: 'AlertCircle',
  low: 'Info'
};

// Timeline event types
export const TIMELINE_TYPES = {
  CREATED: 'created',
  ASSIGNED: 'assigned',
  PROGRESS: 'progress',
  RESOLVED: 'resolved'
};

export const TIMELINE_ICONS = {
  [TIMELINE_TYPES.CREATED]: 'FileText',
  [TIMELINE_TYPES.ASSIGNED]: 'User',
  [TIMELINE_TYPES.PROGRESS]: 'Clock',
  [TIMELINE_TYPES.RESOLVED]: 'CheckCircle'
};