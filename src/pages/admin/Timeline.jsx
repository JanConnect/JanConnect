import React from 'react';
import { 
  FileText, User, Clock, CheckCircle, AlertCircle 
} from 'lucide-react';
import { safeRender } from '../../utils/helpers';
import { TIMELINE_TYPES, TIMELINE_ICONS } from '../../utils/constants';

const Timeline = ({ events }) => {
  if (!events || events.length === 0) {
    return <div className="text-white/60 italic">No timeline events yet</div>;
  }

  const getIcon = (type) => {
    switch (type) {
      case TIMELINE_TYPES.CREATED: 
        return <FileText className="h-4 w-4 text-blue-400" />;
      case TIMELINE_TYPES.ASSIGNED: 
        return <User className="h-4 w-4 text-indigo-400" />;
      case TIMELINE_TYPES.PROGRESS: 
        return <Clock className="h-4 w-4 text-amber-400" />;
      case TIMELINE_TYPES.RESOLVED: 
        return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      default: 
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div key={event.id || index} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="p-2 rounded-full bg-white/10 border border-white/20">
              {getIcon(event.type)}
            </div>
            {index !== events.length - 1 && (
              <div className="w-0.5 h-8 bg-white/20 mt-1"></div>
            )}
          </div>
          <div className="flex-1 pb-4">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-white">{safeRender(event.title || event.message, 'Update')}</h3>
              <span className="text-sm text-white/60">
                {event.timestamp || event.date ? new Date(event.timestamp || event.date).toLocaleDateString() : 'No date'}
              </span>
            </div>
            <p className="text-white/70 text-sm mt-1">{safeRender(event.description || event.message, '')}</p>
            <div className="flex items-center mt-2 text-sm text-white/60">
              <User className="h-3 w-3 mr-1" />
              {safeRender(event.user || event.updatedBy?.name, 'System')}
            </div>
            
            {/* Media attachments for timeline events */}
            {event.media && Array.isArray(event.media) && event.media.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {event.media.map((mediaUrl, mediaIndex) => (
                  <img
                    key={mediaIndex}
                    src={`${import.meta.env.BASE_URL}${mediaUrl}`}
                    alt={`Update media ${mediaIndex + 1}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;