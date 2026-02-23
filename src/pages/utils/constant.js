// Status and priority constants
export const STATUSES = {
  ALL: 'all', // Kept this just in case you use STATUSES.ALL for state initialization
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  RESOLVED: 'resolved',
  REJECTED: 'rejected'
};

// Removed the 'All' option to prevent duplicates in dropdowns
export const STATUS_OPTIONS = [
  { value: STATUSES.PENDING, label: 'Pending' },
  { value: STATUSES.IN_PROGRESS, label: 'In Progress' },
  { value: STATUSES.RESOLVED, label: 'Resolved' },
  { value: STATUSES.REJECTED, label: 'Rejected' }
];

// Removed the 'All' option to prevent duplicates in dropdowns
export const PRIORITIES = [
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

// NEW: Status Colors mapping (Tailwind classes for text, bg, and borders)
export const STATUS_COLORS = {
  [STATUSES.PENDING]: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  [STATUSES.IN_PROGRESS]: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  [STATUSES.RESOLVED]: 'text-green-500 bg-green-500/10 border-green-500/20',
  [STATUSES.REJECTED]: 'text-red-500 bg-red-500/10 border-red-500/20'
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

// NEW: Priority Colors mapping
export const PRIORITY_COLORS = {
  '5': 'text-red-600 bg-red-600/10 border-red-600/20',          // Critical
  '4': 'text-orange-500 bg-orange-500/10 border-orange-500/20', // High
  '3': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20', // Medium
  '2': 'text-blue-500 bg-blue-500/10 border-blue-500/20',       // Low
  '1': 'text-slate-400 bg-slate-400/10 border-slate-400/20',    // Very Low
  high: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
  medium: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  low: 'text-blue-500 bg-blue-500/10 border-blue-500/20'
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

// NEW: Timeline Colors mapping
export const TIMELINE_COLORS = {
  [TIMELINE_TYPES.CREATED]: 'text-indigo-500 bg-indigo-500/10',
  [TIMELINE_TYPES.ASSIGNED]: 'text-purple-500 bg-purple-500/10',
  [TIMELINE_TYPES.PROGRESS]: 'text-blue-500 bg-blue-500/10',
  [TIMELINE_TYPES.RESOLVED]: 'text-green-500 bg-green-500/10'
};