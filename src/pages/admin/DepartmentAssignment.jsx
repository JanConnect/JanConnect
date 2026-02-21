import React, { useState } from 'react';
import { Users, RefreshCw, UserMinus } from 'lucide-react';

const DepartmentAssignment = ({ 
  complaint, 
  departments, 
  onAssign, 
  onUnassign,
  isAssigning 
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState(
    complaint.department?._id || ''
  );

  const handleAssign = () => {
    if (selectedDepartment && selectedDepartment !== complaint.department?._id) {
      onAssign(complaint._id || complaint.reportId, selectedDepartment);
    }
  };

  const handleUnassign = () => {
    onUnassign(complaint._id || complaint.reportId);
    setSelectedDepartment('');
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">Department Assignment</label>
        <select
          style={{ color: 'white', backgroundColor: 'gray' }}
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          <option value="">No Department Assigned</option>
          {departments.map(dept => (
            <option key={dept._id} value={dept._id}>
              {dept.name} - {dept.category}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={handleAssign}
          disabled={!selectedDepartment || selectedDepartment === complaint.department?._id || isAssigning}
          className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 rounded-lg text-white font-medium transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {isAssigning ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Users className="h-4 w-4" />
          )}
          {isAssigning ? 'Assigning...' : 'Assign'}
        </button>
        
        {complaint.department && (
          <button 
            onClick={handleUnassign}
            disabled={isAssigning}
            className="py-2 px-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 rounded-lg text-white font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <UserMinus className="h-4 w-4" />
            Unassign
          </button>
        )}
      </div>
      
      {complaint.department && (
        <div className="text-sm text-white/70">
          Currently assigned to: <span className="text-white">{complaint.department.name}</span>
        </div>
      )}
    </div>
  );
};

export default DepartmentAssignment;