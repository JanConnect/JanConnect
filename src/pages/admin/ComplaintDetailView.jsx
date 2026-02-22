import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit3, RefreshCw, User, Phone, MessageCircle } from 'lucide-react';
import { safeRender } from '../utils/helpers';
import LocationDisplay from './LocationDisplay';
import MediaGallery from './MediaGallery';
import Timeline from './Timeline';
import CommentForm from './CommentForm';
import DepartmentAssignment from './DepartmentAssignment';

const ComplaintDetailView = ({ 
  complaint, 
  onBack, 
  onStatusUpdate, 
  departments, 
  onAssign, 
  onUnassign,
  isAssigning,
  onAddComment 
}) => {
  const [newStatus, setNewStatus] = useState(complaint.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [localComplaint, setLocalComplaint] = useState(complaint);

  const handleStatusUpdate = async () => {
    if (newStatus !== localComplaint.status) {
      setIsUpdating(true);
      try {
        // Call the parent's onStatusUpdate with the complaint ID and new status
        const updatedData = await onStatusUpdate(localComplaint._id, newStatus);
        
        // Create a new timeline entry for the status change
        const newTimelineEntry = {
          id: Date.now().toString(),
          type: 'status_change',
          status: newStatus,
          message: `Status changed to ${newStatus}`,
          date: new Date().toISOString(),
          updatedBy: { name: 'Admin' }
        };
        
        // Update local state with new status and timeline entry
        setLocalComplaint(prev => ({
          ...prev,
          status: newStatus,
          updates: [...(prev.updates || []), newTimelineEntry]
        }));
        
        // Reset the newStatus to match the updated status
        setNewStatus(newStatus);
        
      } catch (error) {
        console.error('Error updating status:', error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleAddComment = async (commentData) => {
    setIsAddingComment(true);
    try {
      const newComment = await onAddComment(localComplaint._id, commentData);
      
      // Create a new timeline entry for the comment
      const newCommentEntry = {
        id: newComment?.id || Date.now().toString(),
        type: 'comment',
        message: commentData.message,
        date: new Date().toISOString(),
        updatedBy: { name: 'Admin' },
        media: commentData.media
      };
      
      // Update local state with new comment
      setLocalComplaint(prev => ({
        ...prev,
        updates: [...(prev.updates || []), newCommentEntry]
      }));
      
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsAddingComment(false);
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  // Use localComplaint for rendering to show updates immediately
  const displayComplaint = localComplaint;

  return (
    <motion.div
      className="p-6 max-w-6xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-white">Complaint Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <motion.div
            className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">{safeRender(displayComplaint.title, 'Untitled Report')}</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-white/60 text-sm">Report ID:</span>
                <p className="text-white">{safeRender(displayComplaint.reportId, 'N/A')}</p>
              </div>
              <div>
                <span className="text-white/60 text-sm">Category:</span>
                <p className="text-white">{safeRender(displayComplaint.category, 'Unknown')}</p>
              </div>
              <div>
                <span className="text-white/60 text-sm">Status:</span>
                <p className={`text-white capitalize font-semibold ${
                  displayComplaint.status === 'resolved' ? 'text-green-400' :
                  displayComplaint.status === 'rejected' ? 'text-red-400' :
                  displayComplaint.status === 'in-progress' ? 'text-blue-400' :
                  'text-yellow-400'
                }`}>
                  {safeRender(displayComplaint.status, 'Unknown')}
                </p>
              </div>
              <div>
                <span className="text-white/60 text-sm">Priority:</span>
                <p className="text-white">{safeRender(displayComplaint.priority || displayComplaint.urgency, 'Unknown')}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <span className="text-white/60 text-sm">Description:</span>
              <p className="text-white mt-2">{safeRender(displayComplaint.description, 'No description available')}</p>
            </div>
          </motion.div>

          {/* Location Section with Google Maps */}
          <LocationDisplay location={displayComplaint.location} />

          {/* Media Gallery */}
          <MediaGallery 
            image={displayComplaint.image} 
            voiceMessage={displayComplaint.voiceMessage} 
          />
          
          {/* Timeline */}
          <motion.div
            className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4">Timeline</h2>
            <Timeline 
              events={displayComplaint.updates || displayComplaint.comments || []} 
              complaint={displayComplaint}
            />
          </motion.div>

          {/* Add Comment Section */}
          <motion.div
            className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Add Progress Update
            </h2>
            <CommentForm onAddComment={handleAddComment} isSubmitting={isAddingComment} />
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Reporter Info */}
          <motion.div
            className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Reporter Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">{safeRender(displayComplaint.reportedBy?.name, 'Anonymous')}</p>
                  <p className="text-white/60 text-sm">{safeRender(displayComplaint.reportedBy?.email, 'No email')}</p>
                </div>
              </div>
              
              {displayComplaint.reportedBy?.phone && (
                <div className="flex items-center gap-2 text-white/70">
                  <Phone className="h-4 w-4" />
                  <span>{displayComplaint.reportedBy.phone}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Status Update */}
          <motion.div
            className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Update Status</h3>
            <div className="space-y-4">
              <select
                style={{ color: 'white', backgroundColor: 'gray' }}
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <button
                onClick={handleStatusUpdate}
                disabled={newStatus === displayComplaint.status || isUpdating}
                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 rounded-lg text-white font-medium transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Edit3 className="h-4 w-4" />
                )}
                {isUpdating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </motion.div>

          {/* Department Assignment */}
          <motion.div
            className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Department Management</h3>
            <DepartmentAssignment
              complaint={displayComplaint}
              departments={departments}
              onAssign={onAssign}
              onUnassign={onUnassign}
              isAssigning={isAssigning}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ComplaintDetailView;