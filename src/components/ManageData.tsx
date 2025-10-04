import React, { useState, useEffect } from 'react';
import { Plus, Search, CreditCard as Edit, Trash2, Save, X, Building, BookOpen, Users, MapPin, Clock, GraduationCap } from 'lucide-react';
import { dbHelpers } from '../lib/supabase';

export function ManageData() {
  const [activeTab, setActiveTab] = useState('departments');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Data states
  const [departments, setDepartments] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [faculty, setFaculty] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [timeSlots, setTimeSlots] = useState<any[]>([]);

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
        case 'timeSlots':
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
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      // Delete logic would go here
      console.log('Delete item:', id);
      loadData();
    }
  };

  const handleSave = async (formData: any) => {
    // Save logic would go here
    console.log('Save data:', formData);
    setShowModal(false);
    loadData();
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'departments': return departments;
      case 'classrooms': return classrooms;
      case 'subjects': return subjects;
      case 'faculty': return faculty;
      case 'batches': return batches;
      case 'timeSlots': return timeSlots;
      default: return [];
    }
  };

  const filteredData = getCurrentData().filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return Object.values(item).some(value => 
      String(value).toLowerCase().includes(searchLower)
    );
  });

  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        activeTab === id
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      <Icon size={16} className="mr-2" />
      {label}
    </button>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Data Management</h2>
        <p className="text-gray-600 mt-1">Manage all academic data in one place</p>
      </div>

      {/* Navigation Tabs */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          <TabButton id="departments" label="Departments" icon={Building} />
          <TabButton id="classrooms" label="Classrooms" icon={MapPin} />
          <TabButton id="subjects" label="Subjects" icon={BookOpen} />
          <TabButton id="faculty" label="Faculty" icon={Users} />
          <TabButton id="batches" label="Batches" icon={GraduationCap} />
          <TabButton id="timeSlots" label="Time Slots" icon={Clock} />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Search and Add */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Add New
          </button>
        </div>

        {/* Data Table */}
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {item.name || item.day || 'N/A'}
                      </div>
                      {item.code && (
                        <div className="text-sm text-gray-500">{item.code}</div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {activeTab === 'departments' && item.head_of_department}
                      {activeTab === 'classrooms' && `${item.type} • Capacity: ${item.capacity}`}
                      {activeTab === 'subjects' && `${item.type} • Credits: ${item.credits}`}
                      {activeTab === 'faculty' && item.email}
                      {activeTab === 'batches' && `Semester ${item.semester} • ${item.shift}`}
                      {activeTab === 'timeSlots' && `${item.start_time} - ${item.end_time}`}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.is_active !== false
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.is_active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
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
        )}

        {filteredData.length === 0 && !loading && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">No {activeTab} found</div>
            <button
              onClick={handleAdd}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Add the first {activeTab.slice(0, -1)}
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingItem ? 'Edit' : 'Add'} {activeTab.slice(0, -1)}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={editingItem?.name || ''}
                  />
                </div>
                {/* Additional form fields would be added based on the active tab */}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave({})}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Save size={16} className="mr-1" />
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}