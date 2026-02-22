import { useState, useEffect, useCallback } from 'react';
import { 
  getAllReports, 
  getReportsAnalytics, 
  updateReportStatus,
  getReportById 
} from '../../api/report';
import { getCurrentUser } from '../../api/auth';
import { getAllDepartments, createDepartment, updateDepartment } from '../../api/department';
import { getAllMunicipalities } from '../../api/municipality';
import { 
  generateFallbackComplaintData, 
  generateDummyStaffData, 
  getFallbackDepartments,
  generateStatsFromComplaints 
} from '../utils/mockData';
import { DEFAULT_CATEGORIES, DEFAULT_MUNICIPALITIES } from '../utils/constant';

// Add this function at the top of useDashboardData.js before using it
// export const generateStatsFromComplaints = (complaints) => {
//   if (!complaints || !Array.isArray(complaints)) {
//     return {
//       total: 0,
//       pending: 0,
//       inProgress: 0,
//       resolved: 0,
//       rejected: 0,
//       byCategory: {},
//       byPriority: {},
//       averageResolutionTime: 0,
//       byStatus: {
//         pending: 0,
//         'in-progress': 0,
//         resolved: 0,
//         rejected: 0
//       },
//       totalUpvotes: 0,
//       averagePriority: 0
//     };
//   }

//   const stats = {
//     total: complaints.length,
//     pending: complaints.filter(c => c.status === 'pending').length,
//     inProgress: complaints.filter(c => c.status === 'in-progress' || c.status === 'in_progress').length,
//     resolved: complaints.filter(c => c.status === 'resolved').length,
//     rejected: complaints.filter(c => c.status === 'rejected').length,
//     byCategory: {},
//     byPriority: {},
//     byStatus: {
//       pending: 0,
//       'in-progress': 0,
//       resolved: 0,
//       rejected: 0
//     },
//     totalUpvotes: 0,
//     averagePriority: 0,
//     averageResolutionTime: 0
//   };

//   // Calculate by status
//   complaints.forEach(complaint => {
//     const status = complaint.status || 'pending';
//     stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
//   });

//   // Calculate by category
//   complaints.forEach(complaint => {
//     const category = complaint.category || 'Other';
//     stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
//   });

//   // Calculate by priority
//   complaints.forEach(complaint => {
//     const priority = complaint.priority || complaint.urgency || 'medium';
//     const priorityValue = typeof priority === 'number' ? 
//       (priority === 5 ? 'critical' : priority === 4 ? 'high' : priority === 3 ? 'medium' : 'low') : 
//       priority;
//     stats.byPriority[priorityValue] = (stats.byPriority[priorityValue] || 0) + 1;
//   });

//   // Calculate total upvotes
//   stats.totalUpvotes = complaints.reduce((sum, complaint) => {
//     return sum + (complaint.upvoteCount || complaint.upvotes || 0);
//   }, 0);

//   // Calculate average priority
//   const priorityValues = complaints.map(c => {
//     if (typeof c.priority === 'number') return c.priority;
//     const priorityMap = { 'critical': 5, 'high': 4, 'medium': 3, 'low': 2 };
//     return priorityMap[c.priority || c.urgency || 'medium'] || 3;
//   });
  
//   stats.averagePriority = priorityValues.length > 0 ? 
//     priorityValues.reduce((a, b) => a + b, 0) / priorityValues.length : 0;

//   // Calculate average resolution time for resolved complaints
//   const resolvedComplaints = complaints.filter(c => 
//     c.status === 'resolved' && (c.resolutionTime || c.resolvedAt)
//   );
  
//   if (resolvedComplaints.length > 0) {
//     const totalTime = resolvedComplaints.reduce((sum, c) => {
//       if (c.resolutionTime) return sum + c.resolutionTime;
//       if (c.resolvedAt && c.submittedAt) {
//         const resolved = new Date(c.resolvedAt);
//         const submitted = new Date(c.submittedAt);
//         return sum + (resolved - submitted) / (1000 * 60 * 60); // hours
//       }
//       return sum;
//     }, 0);
//     stats.averageResolutionTime = totalTime / resolvedComplaints.length;
//   }

//   return stats;
// };

// Mock API functions
const assignReportToDepartment = async (reportId, departmentId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          success: true,
          message: `Report ${reportId} assigned to department ${departmentId} successfully`
        }
      });
    }, 1000);
  });
};

const unassignReportFromDepartment = async (reportId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          success: true,
          message: `Report ${reportId} unassigned from department successfully`
        }
      });
    }, 1000);
  });
};

const addComplaintComment = async (reportId, commentData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          success: true,
          comment: {
            id: Date.now().toString(),
            message: commentData.message,
            media: commentData.media,
            timestamp: new Date().toISOString(),
            author: { name: 'Admin User' }
          }
        }
      });
    }, 1000);
  });
};

export const useDashboardData = (filters) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    currentPage: 1,
    totalReports: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let reportsData = [];
      let analyticsData = {};
      let userData = null;
      let departmentsData = [];
      let municipalitiesData = [];
      let staffData = [];

      // Fetch reports
      try {
        const params = {
          page: filters.page,
          limit: filters.limit,
          sortBy: filters.sort === "date_desc" ? "date" : filters.sort,
          sortOrder: filters.sort.includes("desc") ? "desc" : "asc",
        };

        if (filters.status !== "all") params.status = filters.status;
        if (filters.category !== "all") params.category = filters.category;
        if (filters.priority !== "all") params.priority = filters.priority;
        if (filters.search) params.search = filters.search;

        const reportsResponse = await getAllReports(params);
        reportsData =
          reportsResponse.data?.data?.reports ||
          reportsResponse.data?.data ||
          [];

        if (reportsResponse.data?.data?.totalPages) {
          setPagination({
            totalPages: reportsResponse.data.data.totalPages,
            currentPage: reportsResponse.data.data.currentPage,
            totalReports: reportsResponse.data.data.totalReports,
            hasNextPage: reportsResponse.data.data.hasNextPage,
            hasPrevPage: reportsResponse.data.data.hasPrevPage,
          });
        }
      } catch (err) {
        console.warn("Reports API not available, using fallback data:", err.message);
        reportsData = generateFallbackComplaintData();
      }

      // Fetch analytics
      try {
        const analyticsResponse = await getReportsAnalytics();
        analyticsData =
          analyticsResponse.data?.data?.overview ||
          analyticsResponse.data?.data ||
          {};
      } catch (err) {
        console.warn("Analytics API not available, generating from reports:", err.message);
        analyticsData = generateStatsFromComplaints(reportsData);
      }

      // Fetch user
      try {
        const userResponse = await getCurrentUser();
        userData = userResponse.data?.data || userResponse.data;
      } catch (err) {
        console.warn("User API not available:", err.message);
        userData = { name: "Admin", email: "admin@janconnect.com" };
      }

      // Fetch departments
      try {
        const departmentsResponse = await getAllDepartments();
        departmentsData =
          departmentsResponse.data?.data ||
          departmentsResponse.data ||
          [];

        setDepartments(departmentsData);

        if (Array.isArray(departmentsData)) {
          const deptCategories = [...new Set(departmentsData.map((d) => d.category))];
          setCategories([
            ...DEFAULT_CATEGORIES,
            ...deptCategories,
          ]);
        }
      } catch (err) {
        console.warn("Departments API not available:", err.message);
        setCategories(DEFAULT_CATEGORIES);
        setDepartments(getFallbackDepartments());
      }

      // Fetch municipalities
      try {
        const municipalitiesResponse = await getAllMunicipalities();
        municipalitiesData =
          municipalitiesResponse.data?.data?.municipalities ||
          municipalitiesResponse.data?.data ||
          [];

        if (Array.isArray(municipalitiesData)) {
          const muniNames = municipalitiesData.map((m) => m.name);
          setMunicipalities(muniNames);
        } else {
          throw new Error("Invalid municipalities data");
        }
      } catch (err) {
        console.warn("Municipalities API not available:", err.message);
        setMunicipalities(DEFAULT_MUNICIPALITIES);
      }

      // Fetch staff
      staffData = generateDummyStaffData();
      setStaffMembers(staffData);

      // Update state
      setComplaints(reportsData);
      setStats(analyticsData);
      setUser(userData);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Using fallback data.");

      const fallbackData = generateFallbackComplaintData();
      setComplaints(fallbackData);
      setStats(generateStatsFromComplaints(fallbackData));
      setCategories(DEFAULT_CATEGORIES);
      setMunicipalities(DEFAULT_MUNICIPALITIES);
      setUser({ name: "Admin", email: "admin@janconnect.com" });
      setStaffMembers(generateDummyStaffData());
      setDepartments(getFallbackDepartments());
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

// In useDashboardData.js - Complete handleStatusUpdate function
const handleStatusUpdate = async (complaintId, newStatus) => {
  console.log('🚀 Starting status update:', { complaintId, newStatus });
  
  try {
    // Send as JSON to the endpoint
    const response = await updateReportStatus(complaintId, {
      status: newStatus,
      message: `Status changed to ${newStatus}`
    });
    
    console.log('✅ Status update response:', response.data);
    
    // Get the updated report from response
    const updatedReport = response.data?.data || response.data;
    
    // Update the local complaints state
    setComplaints(prevComplaints => {
      console.log('📝 Updating complaints list');
      return prevComplaints.map(complaint => {
        // Check if this is the complaint we updated
        if (complaint._id === complaintId || complaint.reportId === complaintId) {
          console.log('✅ Found matching complaint in list:', complaint._id);
          return {
            ...complaint,
            status: newStatus,
            // If backend returned updates, use them, otherwise keep existing
            updates: updatedReport?.updates || complaint.updates || []
          };
        }
        return complaint;
      });
    });
    
    console.log('✅ Status update completed successfully');
    
    return updatedReport || { status: newStatus };
  } catch (error) {
    console.error('❌ Error updating status:', error);
    throw error;
  }
};

  const handleAssignToDepartment = async (complaintId, departmentId) => {
    try {
      await assignReportToDepartment(complaintId, departmentId);
      
      const department = departments.find(d => d._id === departmentId);
      
      setComplaints(prev => 
        prev.map(c => 
          c._id === complaintId 
            ? { ...c, department }
            : c
        )
      );
      
      return department;
    } catch (error) {
      console.error('Error assigning to department:', error);
      return null;
    }
  };

  const handleUnassignFromDepartment = async (complaintId) => {
    try {
      await unassignReportFromDepartment(complaintId);
      
      setComplaints(prev => 
        prev.map(c => 
          c._id === complaintId 
            ? { ...c, department: null }
            : c
        )
      );
      
      return true;
    } catch (error) {
      console.error('Error unassigning from department:', error);
      return false;
    }
  };

  const handleAddComment = async (complaintId, commentData) => {
    try {
      const response = await addComplaintComment(complaintId, commentData);
      const newComment = response.data.comment;
      
      setComplaints(prev => 
        prev.map(c => 
          c._id === complaintId 
            ? { 
                ...c, 
                updates: [...(c.updates || []), {
                  id: newComment.id,
                  date: newComment.timestamp,
                  message: newComment.message,
                  updatedBy: newComment.author,
                  type: 'progress',
                  media: newComment.media
                }]
              }
            : c
        )
      );
      
      return newComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      return null;
    }
  };

  const handleDepartmentCreate = async (departmentData) => {
    try {
      const response = await createDepartment(departmentData);
      const newDepartment = response.data;
      
      setDepartments(prev => [...prev, newDepartment]);
      
      if (!categories.includes(departmentData.category)) {
        setCategories(prev => [...prev, departmentData.category]);
      }
      
      return newDepartment;
    } catch (error) {
      console.error('Error creating department:', error);
      return null;
    }
  };

  const handleDepartmentUpdate = async (departmentId, departmentData) => {
    try {
      const response = await updateDepartment(departmentId, departmentData);
      const updatedDepartment = response.data;
      
      setDepartments(prev => 
        prev.map(d => d._id === departmentId ? updatedDepartment : d)
      );
      
      return updatedDepartment;
    } catch (error) {
      console.error('Error updating department:', error);
      return null;
    }
  };

  const refreshData = () => {
    fetchData();
  };

  return {
    complaints,
    setComplaints,
    loading,
    error,
    stats,
    user,
    categories,
    municipalities,
    departments,
    staffMembers,
    pagination,
    handleStatusUpdate,
    handleAssignToDepartment,
    handleUnassignFromDepartment,
    handleAddComment,
    handleDepartmentCreate,
    handleDepartmentUpdate,
    refreshData
  };
};