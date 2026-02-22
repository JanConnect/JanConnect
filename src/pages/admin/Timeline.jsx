import React from 'react';
import { 
  FileText, User, Clock, CheckCircle, AlertCircle, XCircle, Send, RefreshCw
} from 'lucide-react';
import { safeRender } from '../utils/helpers';

const Timeline = ({ events, complaint }) => {
  console.log('Timeline received:', { events, complaint });

  // Combine initial complaint creation with updates
  const getAllTimelineEvents = () => {
    const timelineEvents = [];
    
    // Add the initial complaint creation
    if (complaint) {
      timelineEvents.push({
        id: 'creation',
        type: 'created',
        title: 'Complaint Submitted',
        message: complaint.description || 'Complaint was submitted',
        date: complaint.createdAt || complaint.date || complaint.submittedAt || new Date().toISOString(),
        user: complaint.reportedBy?.name || 'Citizen',
        isCreation: true
      });
    }
    
    // Add all updates/comments
    if (events && events.length > 0) {
      timelineEvents.push(...events);
    }
    
    // Sort all events chronologically (oldest first)
    return timelineEvents.sort((a, b) => {
      const dateA = new Date(a.date || a.timestamp || a.createdAt || 0);
      const dateB = new Date(b.date || b.timestamp || b.createdAt || 0);
      return dateA - dateB;
    });
  };

  const getIcon = (event) => {
    // Check if this is a status change event
    if (event.type === 'status_change') {
      switch (event.status) {
        case 'resolved': return <CheckCircle className="h-4 w-4 text-green-400" />;
        case 'rejected': return <XCircle className="h-4 w-4 text-red-400" />;
        case 'in-progress': return <RefreshCw className="h-4 w-4 text-blue-400" />;
        case 'pending': return <Clock className="h-4 w-4 text-yellow-400" />;
        default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
      }
    }
    
    // Check by type
    switch (event.type) {
      case 'created': 
        return <Send className="h-4 w-4 text-blue-400" />;
      case 'assigned': 
        return <User className="h-4 w-4 text-indigo-400" />;
      case 'comment':
      case 'progress': 
        return <MessageCircle className="h-4 w-4 text-amber-400" />;
      case 'resolved': 
        return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default: 
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getEventTitle = (event) => {
    if (event.isCreation) return 'Complaint Submitted';
    if (event.type === 'assigned') return 'Assigned to Department';
    if (event.type === 'comment') return 'Comment Added';
    if (event.type === 'progress') return 'Progress Update';
    
    // Status change events
    if (event.type === 'status_change') {
      switch (event.status) {
        case 'resolved': return '✓ Complaint Resolved';
        case 'rejected': return '✗ Complaint Rejected';
        case 'in-progress': return '⟳ Complaint In Progress';
        case 'pending': return '⏳ Complaint Pending';
        default: return 'Status Updated';
      }
    }
    
    return event.title || 'Update';
  };

  const timelineEvents = getAllTimelineEvents();
  console.log('Processed timeline events:', timelineEvents);

  if (timelineEvents.length === 0) {
    return <div className="text-white/60 italic">No timeline events yet</div>;
  }

  return (
    <div className="space-y-4">
      {timelineEvents.map((event, index) => (
        <div key={event.id || event._id || index} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="p-2 rounded-full bg-white/10 border border-white/20">
              {getIcon(event)}
            </div>
            {index !== timelineEvents.length - 1 && (
              <div className="w-0.5 h-8 bg-white/20 mt-1"></div>
            )}
          </div>
          <div className="flex-1 pb-4">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-white">
                {getEventTitle(event)}
              </h3>
              <span className="text-sm text-white/60">
                {event.date || event.timestamp || event.createdAt 
                  ? new Date(event.date || event.timestamp || event.createdAt).toLocaleString() 
                  : 'Date not available'}
              </span>
            </div>
            
            {/* Show message/description */}
            {(event.message || event.description) && !event.isCreation && (
              <p className="text-white/70 text-sm mt-1">
                {safeRender(event.message || event.description, '')}
              </p>
            )}
            
            {/* Show who performed the action */}
            <div className="flex items-center mt-2 text-sm text-white/60">
              <User className="h-3 w-3 mr-1" />
              {event.user || event.updatedBy?.name || 
               (event.isCreation ? 'Citizen' : 'Admin')}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;