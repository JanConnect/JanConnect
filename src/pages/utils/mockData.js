import { DEFAULT_CATEGORIES, DEFAULT_MUNICIPALITIES } from './constant';
// import { DEFAULT_CATEGORIES, DEFAULT_MUNICIPALITIES } from './constant';

// Generate stats from complaints data - ADD THIS FUNCTION
export const generateStatsFromComplaints = (complaints) => {
  if (!complaints || !Array.isArray(complaints)) {
    return {
      total: 0,
      pending: 0,
      inProgress: 0,
      resolved: 0,
      rejected: 0,
      byCategory: {},
      byPriority: {},
      averageResolutionTime: 0,
      byStatus: {
        pending: 0,
        'in-progress': 0,
        resolved: 0,
        rejected: 0
      },
      totalUpvotes: 0,
      averagePriority: 0
    };
  }

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in-progress' || c.status === 'in_progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    rejected: complaints.filter(c => c.status === 'rejected').length,
    byCategory: {},
    byPriority: {},
    byStatus: {
      pending: 0,
      'in-progress': 0,
      resolved: 0,
      rejected: 0
    },
    totalUpvotes: 0,
    averagePriority: 0,
    averageResolutionTime: 0
  };

  // Calculate by status
  complaints.forEach(complaint => {
    const status = complaint.status || 'pending';
    stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
  });

  // Calculate by category
  complaints.forEach(complaint => {
    const category = complaint.category || 'Other';
    stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
  });

  // Calculate by priority
  complaints.forEach(complaint => {
    const priority = complaint.priority || complaint.urgency || 'medium';
    const priorityValue = typeof priority === 'number' ? 
      (priority === 5 ? 'critical' : priority === 4 ? 'high' : priority === 3 ? 'medium' : 'low') : 
      priority;
    stats.byPriority[priorityValue] = (stats.byPriority[priorityValue] || 0) + 1;
  });

  // Calculate total upvotes
  stats.totalUpvotes = complaints.reduce((sum, complaint) => {
    return sum + (complaint.upvoteCount || complaint.upvotes || 0);
  }, 0);

  // Calculate average priority
  const priorityValues = complaints.map(c => {
    if (typeof c.priority === 'number') return c.priority;
    const priorityMap = { 'critical': 5, 'high': 4, 'medium': 3, 'low': 2 };
    return priorityMap[c.priority || c.urgency || 'medium'] || 3;
  });
  
  stats.averagePriority = priorityValues.length > 0 ? 
    priorityValues.reduce((a, b) => a + b, 0) / priorityValues.length : 0;

  // Calculate average resolution time for resolved complaints
  const resolvedComplaints = complaints.filter(c => 
    c.status === 'resolved' && (c.resolutionTime || c.resolvedAt)
  );
  
  if (resolvedComplaints.length > 0) {
    const totalTime = resolvedComplaints.reduce((sum, c) => {
      if (c.resolutionTime) return sum + c.resolutionTime;
      if (c.resolvedAt && c.submittedAt) {
        const resolved = new Date(c.resolvedAt);
        const submitted = new Date(c.submittedAt);
        return sum + (resolved - submitted) / (1000 * 60 * 60); // hours
      }
      return sum;
    }, 0);
    stats.averageResolutionTime = totalTime / resolvedComplaints.length;
  }

  return stats;
};
// Generate fallback complaint data
export const generateFallbackComplaintData = () => {
  const statuses = ['pending', 'in-progress', 'resolved', 'rejected'];
  const categories = DEFAULT_CATEGORIES;
  const areas = DEFAULT_MUNICIPALITIES;
  const priorities = [5, 4, 3, 2, 1];
  
  const complaints = [];
  
  for (let i = 1; i <= 25; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const area = areas[Math.floor(Math.random() * areas.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const submittedDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
    const resolvedDate = status === 'resolved' ? new Date(submittedDate.getTime() + Math.random() * 86400000 * 7) : null;
    
    complaints.push({
      _id: `fallback_${i}`,
      reportId: `REPORT_${i}`,
      title: `${category} issue #${i} in ${area}`,
      description: `This is a detailed description of report #${i}. The issue relates to ${category.toLowerCase()} and needs attention in the ${area} area. Residents have reported multiple instances of this problem occurring over the past few weeks.`,
      category,
      status,
      area,
      priority,
      date: submittedDate.toISOString(),
      upvoteCount: Math.floor(Math.random() * 50),
      upvotes: Math.floor(Math.random() * 50),
      comments: Math.floor(Math.random() * 10),
      submittedAt: submittedDate.toISOString(),
      resolvedAt: resolvedDate?.toISOString(),
      resolutionTime: resolvedDate ? Math.floor((resolvedDate - submittedDate) / (1000 * 60 * 60 * 24)) : null,
      urgency: priority === 5 ? 'high' : priority >= 3 ? 'medium' : 'low',
      submissionsCount: Math.floor(Math.random() * 5) + 1,
      media: {
        url: `https://picsum.photos/600/400?random=${i}`,
        id: `${i}-1`
      },
      location: {
        address: `${Math.floor(Math.random() * 999) + 1} ${area} Street`,
        coordinates: [40.7128 + (Math.random() - 0.5) * 0.01, -74.0060 + (Math.random() - 0.5) * 0.01]
      },
      municipality: {
        name: area
      },
      department: status !== 'pending' ? {
        name: `${category} Department`,
        _id: `dept_${category}`
      } : null,
      reportedBy: {
        name: `Reporter ${i}`,
        email: `reporter${i}@example.com`,
        phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        avatar: `https://ui-avatars.com/api/?name=Reporter+${i}&background=3b82f6&color=fff`
      },
      updates: [
        {
          id: `update_${i}_1`,
          date: submittedDate.toISOString(),
          message: 'Report submitted by citizen',
          updatedBy: { name: `Reporter ${i}` },
          type: 'created'
        },
        ...(status !== 'pending' ? [{
          id: `update_${i}_2`,
          date: new Date(submittedDate.getTime() + Math.random() * 86400000).toISOString(),
          message: `Report forwarded to ${category} department`,
          updatedBy: { name: 'Admin User' },
          type: 'assigned'
        }] : []),
        ...(status === 'resolved' ? [{
          id: `update_${i}_3`,
          date: resolvedDate.toISOString(),
          message: 'Issue has been successfully resolved',
          updatedBy: { name: 'Department Lead' },
          type: 'resolved',
          media: [`https://picsum.photos/400/300?random=${i + 100}`]
        }] : [])
      ]
    });
  }
  
  return complaints;
};

// Generate dummy staff data
export const generateDummyStaffData = () => {
  return [
    { _id: 'staff_1', name: 'Amit Sharma', email: 'amit.sharma@municipality.in', role: 'Engineer' },
    { _id: 'staff_2', name: 'Priya Verma', email: 'priya.verma@municipality.in', role: 'Sanitation Specialist' },
    { _id: 'staff_3', name: 'Rahul Nair', email: 'rahul.nair@municipality.in', role: 'Electrician' },
    { _id: 'staff_4', name: 'Sneha Iyer', email: 'sneha.iyer@municipality.in', role: 'Water Technician' },
    { _id: 'staff_5', name: 'Vikram Singh', email: 'vikram.singh@municipality.in', role: 'Traffic Controller' },
    { _id: 'staff_6', name: 'Neha Patel', email: 'neha.patel@municipality.in', role: 'Park Maintenance' },
    { _id: 'staff_7', name: 'Arjun Reddy', email: 'arjun.reddy@municipality.in', role: 'General Maintenance' },
    { _id: 'staff_8', name: 'Kavya Joshi', email: 'kavya.joshi@municipality.in', role: 'Coordinator' },
    { _id: 'staff_9', name: 'Suresh Kumar', email: 'suresh.kumar@municipality.in', role: 'Inspector' },
    { _id: 'staff_10', name: 'Ananya Gupta', email: 'ananya.gupta@municipality.in', role: 'Administrator' }
  ];
};

// Generate department analytics
export const generateDepartmentAnalytics = (complaints, departments) => {
  const analytics = {};
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  departments.forEach(dept => {
    const deptComplaints = complaints.filter(c => c.department?._id === dept._id);
    
    analytics[dept._id] = {
      name: dept.name,
      category: dept.category,
      monthlyData: months.map(month => {
        const monthIndex = months.indexOf(month);
        const monthComplaints = deptComplaints.filter(c => {
          const date = new Date(c.submittedAt);
          return date.getMonth() === monthIndex;
        });
        
        return {
          month,
          pending: monthComplaints.filter(c => c.status === 'pending').length,
          inProgress: monthComplaints.filter(c => c.status === 'in-progress').length,
          resolved: monthComplaints.filter(c => c.status === 'resolved').length,
          avgResolutionTime: monthComplaints
            .filter(c => c.resolutionTime)
            .reduce((acc, c) => acc + c.resolutionTime, 0) / 
            Math.max(monthComplaints.filter(c => c.resolutionTime).length, 1)
        };
      }),
      totalComplaints: deptComplaints.length,
      resolvedComplaints: deptComplaints.filter(c => c.status === 'resolved').length,
      avgResolutionTime: deptComplaints
        .filter(c => c.resolutionTime)
        .reduce((acc, c) => acc + c.resolutionTime, 0) / 
        Math.max(deptComplaints.filter(c => c.resolutionTime).length, 1)
    };
  });
  
  return analytics;
};

// Generate fallback departments
export const getFallbackDepartments = () => {
  return [
    { _id: "dept_infra", name: "Infrastructure Department", category: "Infrastructure" },
    { _id: "dept_sanitation", name: "Sanitation Department", category: "Sanitation" },
    { _id: "dept_lighting", name: "Street Lighting Department", category: "Street Lighting" },
    { _id: "dept_water", name: "Water Supply Department", category: "Water Supply" },
    { _id: "dept_traffic", name: "Traffic Department", category: "Traffic" },
    { _id: "dept_parks", name: "Parks Department", category: "Parks" },
    { _id: "dept_other", name: "Other Issues Department", category: "Other" },
  ];
};