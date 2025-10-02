import React, { useState, useEffect } from 'react';
import { supabase, dbHelpers } from '../lib/supabase';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Building, 
  Users, 
  BookOpen, 
  MapPin,
  GraduationCap,
  Clock,
  Search,
  Filter
} from 'lucide-react';

interface ManageDataProps {
  onClose?: () => void;
}

export function ManageData({ onClose }: ManageDataProps) {
  const [activeTab, setActiveTab] = useState('departments');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Data states
  const [departments, setDepartments] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [faculty, setFaculty] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [timeSlots, setTimeSlots] = useState<any[]>([]);

  // Form states
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'departments':
          const depts = await dbHelpers.getDepartments();
          setDepartments(depts || []);
          break;
        case 'classrooms':
          const rooms = await dbHelpers.getClassrooms();
          setClassrooms(rooms || []);
          break;
        case 'subjects':
          const subjs = await dbHelpers.getSubjects();
          setSubjects(subjs || []);
          break;
        case 'faculty':
          const fac = await dbHelpers.getFaculty();
          setFaculty(fac || []);
          break;
        case 'batches':
          const bat = await dbHelpers.getBatches();
          setBatches(bat || []);
          break;
        case 'timeslots':
          const slots = await dbHelpers.getTimeSlots();
          setTimeSlots(slots || []);
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({});
    setEditingItem(null);
    setShowAddForm(true);
  };

  const handleEdit = (item: any) => {
    setFormData(item);
    setEditingItem(item);
    setShowAddForm(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // This would normally save to database
      console.log('Saving:', formData);
      setShowAddForm(false);
      await loadData();
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    setLoading(true);
    try {
      // This would normally delete from database
      console.log('Deleting:', id);
      await loadData();
    } catch (error) {
      console.error('Error deleting:', error);
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ id, label, icon: Icon, count }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
        activeTab === id
          ? 'bg-blue-100 text-blue-700 border border-blue-200'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      <Icon size={18} className="mr-2" />
      {label}
      {count !== undefined && (
        <span className="ml-2 px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">
          {count}
        </span>
      )}
    </button>
  );

  const renderDepartmentForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Department Name</label>
        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Computer Science"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Department Code</label>
        <input
          type="text"
          value={formData.code || ''}
          onChange={(e) => setFormData({...formData, code: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="CS"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Head of Department</label>
        <input
          type="text"
          value={formData.head_of_department || ''}
          onChange={(e) => setFormData({...formData, head_of_department: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Dr. John Smith"
        />
      </div>
    </div>
  );

  const renderClassroomForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Classroom Name</label>
        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="CS-101"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
          <input
            type="number"
            value={formData.capacity || ''}
            onChange={(e) => setFormData({...formData, capacity: Number(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <select
            value={formData.type || ''}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Type</option>
            <option value="lecture">Lecture Hall</option>
            <option value="laboratory">Laboratory</option>
            <option value="seminar">Seminar Room</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Building</label>
          <input
            type="text"
            value={formData.building || ''}
            onChange={(e) => setFormData({...formData, building: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Main Building"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Floor</label>
          <input
            type="number"
            value={formData.floor || ''}
            onChange={(e) => setFormData({...formData, floor: Number(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="1"
          />
        </div>
      </div>
    </div>
  );

  const renderSubjectForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Subject Name</label>
        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Data Structures"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subject Code</label>
          <input
            type="text"
            value={formData.code || ''}
            onChange={(e) => setFormData({...formData, code: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="CS301"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
          <select
            value={formData.semester || ''}
            onChange={(e) => setFormData({...formData, semester: Number(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Semester</option>
            {[1,2,3,4,5,6,7,8].map(sem => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Credits</label>
          <input
            type="number"
            value={formData.credits || ''}
            onChange={(e) => setFormData({...formData, credits: Number(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="3"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hours/Week</label>
          <input
            type="number"
            value={formData.hours_per_week || ''}
            onChange={(e) => setFormData({...formData, hours_per_week: Number(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="4"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <select
            value={formData.type || ''}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Type</option>
            <option value="theory">Theory</option>
            <option value="practical">Practical</option>
            <option value="tutorial">Tutorial</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderFacultyForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Faculty Name</label>
        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Dr. Jane Smith"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          value={formData.email || ''}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="jane.smith@university.edu"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Max Hours Per Week</label>
        <input
          type="number"
          value={formData.max_hours_per_week || ''}
          onChange={(e) => setFormData({...formData, max_hours_per_week: Number(e.target.value)})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="20"
        />
      </div>
    </div>
  );

  const renderBatchForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Batch Name</label>
        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="CS-2024-A"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
          <select
            value={formData.semester || ''}
            onChange={(e) => setFormData({...formData, semester: Number(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Semester</option>
            {[1,2,3,4,5,6,7,8].map(sem => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Student Count</label>
          <input
            type="number"
            value={formData.student_count || ''}
            onChange={(e) => setFormData({...formData, student_count: Number(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="45"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Shift</label>
        <select
          value={formData.shift || ''}
          onChange={(e) => setFormData({...formData, shift: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Shift</option>
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
        </select>
      </div>
    </div>
  );

  const renderTimeSlotForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
        <select
          value={formData.day || ''}
          onChange={(e) => setFormData({...formData, day: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Day</option>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
          <input
            type="time"
            value={formData.start_time || ''}
            onChange={(e) => setFormData({...formData, start_time: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
          <input
            type="time"
            value={formData.end_time || ''}
            onChange={(e) => setFormData({...formData, end_time: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label>
        <input
          type="number"
          value={formData.duration || ''}
          onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="1"
          min="1"
          max="4"
        />
      </div>
    </div>
  );

  const renderForm = () => {
    switch (activeTab) {
      case 'departments': return renderDepartmentForm();
      case 'classrooms': return renderClassroomForm();
      case 'subjects': return renderSubjectForm();
      case 'faculty': return renderFacultyForm();
      case 'batches': return renderBatchForm();
      case 'timeslots': return renderTimeSlotForm();
      default: return null;
    }
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'departments': return departments;
      case 'classrooms': return classrooms;
      case 'subjects': return subjects;
      case 'faculty': return faculty;
      case 'batches': return batches;
      case 'timeslots': return timeSlots;
      default: return [];
    }
  };

  const filteredData = getCurrentData().filter(item => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Data</h1>
              <p className="text-gray-600">Manage departments, classrooms, subjects, faculty, and batches</p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          <TabButton
            id="departments"
            label="Departments"
            icon={Building}
            count={departments.length}
          />
          <TabButton
            id="classrooms"
            label="Classrooms"
            icon={MapPin}
            count={classrooms.length}
          />
          <TabButton
            id="subjects"
            label="Subjects"
            icon={BookOpen}
            count={subjects.length}
          />
          <TabButton
            id="faculty"
            label="Faculty"
            icon={Users}
            count={faculty.length}
          />
          <TabButton
            id="batches"
            label="Batches"
            icon={GraduationCap}
            count={batches.length}
          />
          <TabButton
            id="timeslots"
            label="Time Slots"
            icon={Clock}
            count={timeSlots.length}
          />
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Toolbar */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button
                onClick={handleAdd}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus size={18} className="mr-2" />
                Add New
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      {item.code && <div className="text-sm text-gray-500">{item.code}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activeTab === 'departments' && item.head_of_department}
                      {activeTab === 'classrooms' && `${item.capacity} seats • ${item.type}`}
                      {activeTab === 'subjects' && `Sem ${item.semester} • ${item.credits} credits`}
                      {activeTab === 'faculty' && item.email}
                      {activeTab === 'batches' && `${item.student_count} students • ${item.shift}`}
                      {activeTab === 'timeslots' && `${item.start_time} - ${item.end_time}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.is_active !== false 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.is_active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingItem ? 'Edit' : 'Add'} {activeTab.slice(0, -1)}
                  </h3>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                {renderForm()}
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
                >
                  <Save size={16} className="mr-2" />
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}