import React, { useState, useEffect } from 'react';
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

  // 🛑 FIX 1: Keep local state synced if the parent data changes!
  useEffect(() => {
    setLocalComplaint(complaint);
    setNewStatus(complaint.status);
  }, [complaint]);

  const handleStatusUpdate = async () => {
    if (newStatus !== localComplaint.status) {
      setIsUpdating(true);
      try {
        console.log(`Attempting to update status to: ${newStatus}`);
        
        // 🛑 FIX 2: Note how we pass the status. Make sure your parent AdminDashboard 
        // passes this properly to the API (e.g., as { status: newStatus } if needed)
        const updatedData = await onStatusUpdate(localComplaint._id, newStatus);
        
        console.log("Status successfully updated on backend!");

        const newTimelineEntry = {
          id: Date.now().toString(),
          type: 'status_change',
          status: newStatus,
          message: `Status changed to ${newStatus}`,
          date: new Date().toISOString(),
          updatedBy: { name: 'Admin' }
        };
        
        setLocalComplaint(prev => ({
          ...prev,
          status: newStatus,
          updates: [...(prev.updates || []), newTimelineEntry]
        }));
        
        setNewStatus(newStatus);
        
      } catch (error) {
        // 🛑 FIX 3: Detailed error logging so you know WHY it failed
        console.error('💥 ERROR UPDATING STATUS:', error);
        if (error.response) {
          console.error('Backend rejected with status:', error.response.status);
          console.error('Backend message:', error.response.data);
          alert(`Failed to update: ${error.response.data?.message || 'Server rejected the update'}`);
        } else {
          alert('Failed to update status. Check your console.');
        }
        
        // Revert the dropdown back to original status since it failed
        setNewStatus(localComplaint.status);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleAddComment = async (commentData) => {
    setIsAddingComment(true);
    try {
      const newComment = await onAddComment(localComplaint._id, commentData);
      
      const newCommentEntry = {
        id: newComment?.id || Date.now().toString(),
        type: 'comment',
        message: commentData.message,
        date: new Date().toISOString(),
        updatedBy: { name: 'Admin' },
        media: commentData.media
      };
      
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

  const displayComplaint = localComplaint;

  // Reusable divider component for clean separation inside the single boxes
  const SectionDivider = () => <hr className="border-white/10 my-6" />;

  return (
    <motion.div
      className="p-6 max-w-7xl mx-auto"
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
        
        {/* ==================== SIDEBAR (1 Box) ==================== */}
        <motion.div
          className="lg:col-span-1 p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 h-fit"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Complaint Details */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">{safeRender(displayComplaint.title, 'Untitled Report')}</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/60 text-sm">Report ID:</span>
                <span className="text-white text-sm">{safeRender(displayComplaint.reportId, 'N/A')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60 text-sm">Category:</span>
                <span className="text-white text-sm">{safeRender(displayComplaint.category, 'Unknown')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60 text-sm">Priority:</span>
                <span className="text-white text-sm">{safeRender(displayComplaint.priority || displayComplaint.urgency, 'Unknown')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">Status:</span>
                <span className={`text-sm capitalize font-semibold px-2 py-1 rounded-md bg-black/20 ${
                  displayComplaint.status === 'resolved' ? 'text-green-400' :
                  displayComplaint.status === 'rejected' ? 'text-red-400' :
                  displayComplaint.status === 'in-progress' ? 'text-blue-400' :
                  'text-yellow-400'
                }`}>
                  {safeRender(displayComplaint.status, 'Unknown')}
                </span>
              </div>
              <div className="pt-2">
                <span className="text-white/60 text-sm block mb-1">Description:</span>
                <p className="text-white text-sm bg-black/10 p-3 rounded-lg leading-relaxed">
                  {safeRender(displayComplaint.description, 'No description available')}
                </p>
              </div>
            </div>
          </div>

          <SectionDivider />

          {/* Reporter Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Reporter Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-white font-medium truncate">{safeRender(displayComplaint.reportedBy?.name, 'Anonymous')}</p>
                  <p className="text-white/60 text-sm truncate">{safeRender(displayComplaint.reportedBy?.email, 'No email')}</p>
                </div>
              </div>
              
              {displayComplaint.reportedBy?.phone && (
                <div className="flex items-center gap-2 text-white/70 bg-black/10 p-2 rounded-lg">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">{displayComplaint.reportedBy.phone}</span>
                </div>
              )}
            </div>
          </div>

          <SectionDivider />

          {/* Status Update */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Update Status</h3>
            <div className="space-y-4">
              <select
                style={{ color: 'white', backgroundColor: '#374151' }} // Using a standard tailwind dark gray for better visibility
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
                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400/50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Edit3 className="h-4 w-4" />
                )}
                {isUpdating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>

          <SectionDivider />

          {/* Department Assignment */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Department Management</h3>
            <DepartmentAssignment
              complaint={displayComplaint}
              departments={departments}
              onAssign={onAssign}
              onUnassign={onUnassign}
              isAssigning={isAssigning}
            />
          </div>
          <SectionDivider />
          {/* Add Comment / Progress Section */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Add Progress Update
            </h2>
            <CommentForm onAddComment={handleAddComment} isSubmitting={isAddingComment} />
          </div>
        </motion.div>


        {/* ==================== MAIN CONTENT (1 Box) ==================== */}
        <motion.div
          className="lg:col-span-2 p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Media Section */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Attached Media</h2>
            <MediaGallery 
              image={displayComplaint.image} 
              voiceMessage={displayComplaint.voiceMessage} 
            />
          </div>

          <SectionDivider />

          {/* Location Section */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Location</h2>
            <LocationDisplay location={displayComplaint.location} />
          </div>

          <SectionDivider />

          {/* Timeline Section */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Activity Timeline</h2>
            <Timeline 
              events={displayComplaint.updates || displayComplaint.comments || []} 
              complaint={displayComplaint}
            />
          </div>

        </motion.div>

      </div>
    </motion.div>
  );
};

export default ComplaintDetailView;