import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const DepartmentManagementModal = ({ 
  isOpen, 
  onClose, 
  departments, 
  onDepartmentCreate, 
  onDepartmentUpdate,
  staffMembers 
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingDepartment) {
      setName(editingDepartment.name || '');
      setCategory(editingDepartment.category || '');
      setSelectedStaff(editingDepartment.staffMembers || []);
    } else {
      setName('');
      setCategory('');
      setSelectedStaff([]);
    }
  }, [editingDepartment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const departmentData = {
        name,
        category,
        staffMembers: selectedStaff
      };

      if (editingDepartment) {
        await onDepartmentUpdate(editingDepartment._id, departmentData);
      } else {
        await onDepartmentCreate(departmentData);
      }
      
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error saving department:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setCategory('');
    setSelectedStaff([]);
    setEditingDepartment(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const toggleStaffSelection = (staffId) => {
    setSelectedStaff(prev => 
      prev.includes(staffId) 
        ? prev.filter(id => id !== staffId)
        : [...prev, staffId]
    );
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/20">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              {editingDepartment ? 'Edit Department' : 'Create New Department'}
            </h2>
            <button 
              onClick={handleClose}
              className="text-white/70 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Department Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Category</label>
            <input
              style={{ color: 'white', backgroundColor: 'gray/20' }}
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              required
              placeholder="e.g., Infrastructure, Sanitation, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Assign Staff Members</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {staffMembers.map(staff => (
                <div key={staff._id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`staff-${staff._id}`}
                    checked={selectedStaff.includes(staff._id)}
                    onChange={() => toggleStaffSelection(staff._id)}
                    className="mr-2"
                  />
                  <label htmlFor={`staff-${staff._id}`} className="text-white">
                    {staff.name} - {staff.email} ({staff.role})
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : editingDepartment ? 'Update Department' : 'Create Department'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg border border-white/20 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default DepartmentManagementModal;