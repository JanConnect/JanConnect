// Safe render helper
export const safeRender = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'object') {
    if (Array.isArray(value)) return value.length;
    return fallback;
  }
  return value;
};

// Extract coordinates from location object
export const extractCoordinates = (location) => {
  if (!location) return null;
  
  if (location.coordinates && Array.isArray(location.coordinates)) {
    return location.coordinates;
  }
  
  if (location.lat && location.lng) {
    return [location.lat, location.lng];
  }
  
  if (location.latitude && location.longitude) {
    return [location.latitude, location.longitude];
  }
  
  if (location.coords && Array.isArray(location.coords)) {
    return location.coords;
  }
  
  return null;
};

// Generate stats from complaints
export const generateStatsFromComplaints = (complaints) => {
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'pending').length;
  const inProgress = complaints.filter(c => c.status === 'in-progress').length;
  const resolved = complaints.filter(c => c.status === 'resolved').length;
  const rejected = complaints.filter(c => c.status === 'rejected').length;
  
  return { 
    totalReports: total, 
    pendingReports: pending, 
    inProgressReports: inProgress, 
    resolvedReports: resolved, 
    rejectedReports: rejected 
  };
};

// Get upvote count
export const getUpvoteCount = (complaint) => {
  if (typeof complaint.upvoteCount === 'number') return complaint.upvoteCount;
  if (typeof complaint.upvotes === 'number') return complaint.upvotes;
  if (Array.isArray(complaint.upvotes)) return complaint.upvotes.length;
  return 0;
};

// Get updates count
export const getUpdatesCount = (complaint) => {
  if (typeof complaint.comments === 'number') return complaint.comments;
  if (Array.isArray(complaint.updates)) return complaint.updates.length;
  return 0;
};

// Convert to CSV for export
export const convertToCSV = (reports) => {
  const headers = [
    'Report ID', 'Title', 'Category', 'Status', 'Priority', 'Urgency',
    'Reporter', 'Municipality', 'Department', 'Date', 'Upvotes'
  ];

  const csvRows = [
    headers.join(','),
    ...reports.map(report => [
      report.reportId || report._id,
      `"${report.title}"`,
      report.category,
      report.status,
      report.priority,
      report.urgency,
      report.reportedBy?.name || 'Unknown',
      report.municipality?.name || report.area || 'Unknown',
      report.department?.name || 'Unassigned',
      new Date(report.date).toLocaleDateString(),
      getUpvoteCount(report)
    ].join(','))
  ];

  return csvRows.join('\n');
};

// Download CSV
export const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};