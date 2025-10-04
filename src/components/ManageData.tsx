import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Save, X, Building, BookOpen, Users, MapPin, Clock, GraduationCap, AlertCircle } from 'lucide-react';
import { dbHelpers } from '../lib/supabase';

export function ManageData() {
  const [activeTab, setActiveTab] = useState('departments');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [formErrors, setFormErrors] = useState<any>({});

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
          setDepartments(depts || getSampleDepartments());
          break;
        case 'classrooms':
          const rooms = await dbHelpers.getClassrooms();
          setClassrooms(rooms || getSampleClassrooms());
          break;
        case 'subjects':
          const subjs = await dbHelpers.getSubjects();
          setSubjects(subjs || getSampleSubjects());
          break;
        case 'faculty':
          const fac = await dbHelpers.getFaculty();
          setFaculty(fac || getSampleFaculty());
          break;
        case 'batches':
          const bat = await dbHelpers.getBatches();
          setBatches(bat || getSampleBatches());
          break;
        case 'timeSlots':
          const slots = await dbHelpers.getTimeSlots();
          setTimeSlots(slots || getSampleTimeSlots());
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Load sample data on error
      loadSampleData();
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = () => {
    switch (activeTab) {
      case 'departments':
        setDepartments(getSampleDepartments());
        break;
      case 'classrooms':
        setClassrooms(getSampleClassrooms());
        break;
      case 'subjects':
        setSubjects(getSampleSubjects());
        break;
      case 'faculty':
        setFaculty(getSampleFaculty());
        break;
      case 'batches':
        setBatches(getSampleBatches());
        break;
      case 'timeSlots':
        setTimeSlots(getSampleTimeSlots());
        break;
    }
  };

  // Sample data functions
  const getSampleDepartments = () => [
    { id: '1', name: 'Computer Science', code: 'CS', head_of_department: 'Dr. Smith', is_active: true },
    { id: '2', name: 'Electronics Engineering', code: 'ECE', head_of_department: 'Prof. Johnson', is_active: true },
    { id: '3', name: 'Mechanical Engineering', code: 'ME', head_of_department: 'Dr. Brown', is_active: true },
    { id: '4', name: 'Civil Engineering', code: 'CE', head_of_department: 'Prof. Davis', is_active: false }
  ];

  const getSampleClassrooms = () => [
    { id: '1', name: 'CS-101', type: 'lecture', capacity: 60, equipment: ['Projector', 'Whiteboard'], building: 'Main Block', floor: 1, is_active: true },
    { id: '2', name: 'Lab-1', type: 'laboratory', capacity: 30, equipment: ['Computers', 'Projector'], building: 'Lab Block', floor: 2, is_active: true },
    { id: '3', name: 'Seminar Hall', type: 'seminar', capacity: 100, equipment: ['Audio System', 'Projector'], building: 'Admin Block', floor: 3, is_active: true }
  ];

  const getSampleSubjects = () => [
    { id: '1', name: 'Data Structures', code: 'CS301', type: 'theory', credits: 4, hours_per_week: 4, semester: 5, is_active: true },
    { id: '2', name: 'Programming Lab', code: 'CS302', type: 'practical', credits: 2, hours_per_week: 4, semester: 5, is_active: true },
    { id: '3', name: 'Database Systems', code: 'CS303', type: 'theory', credits: 3, hours_per_week: 3, semester: 5, is_active: true }
  ];

  const getSampleFaculty = () => [
    { id: '1', name: 'Dr. Smith', email: 'smith@university.edu', max_hours_per_week: 20, is_active: true },
    { id: '2', name: 'Prof. Johnson', email: 'johnson@university.edu', max_hours_per_week: 18, is_active: true },
    { id: '3', name: 'Dr. Brown', email: 'brown@university.edu', max_hours_per_week: 22, is_active: false }
  ];

  const getSampleBatches = () => [
    { id: '1', name: 'CS-5A', semester: 5, student_count: 45, shift: 'morning', is_active: true },
    { id: '2', name: 'CS-5B', semester: 5, student_count: 42, shift: 'morning', is_active: true },
    { id: '3', name: 'ECE-3A', semester: 3, student_count: 38, shift: 'afternoon', is_active: true }
  ];

  const getSampleTimeSlots = () => [
    { id: '1', day: 'Monday', start_time: '09:00', end_time: '10:00', duration: 1, is_active: true },
    { id: '2', day: 'Monday', start_time: '10:00', end_time: '11:00', duration: 1, is_active: true },
    { id: '3', day: 'Tuesday', start_time: '09:00', end_time: '10:00', duration: 1, is_active: true }
  ];

  const handleAdd = () => {
    setEditingItem(null);
    setFormData(getEmptyFormData());
    setFormErrors({});
    setShowModal(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
    setFormErrors({});
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        // Update local state immediately for better UX
        switch (activeTab) {
          case 'departments':
            setDepartments(prev => prev.filter(item => item.id !== id));
            break;
          case 'classrooms':
            setClassrooms(prev => prev.filter(item => item.id !== id));
            break;
          case 'subjects':
            setSubjects(prev => prev.filter(item => item.id !== id));
            break;
          case 'faculty':
            setFaculty(prev => prev.filter(item => item.id !== id));
            break;
          case 'batches':
            setBatches(prev => prev.filter(item => item.id !== id));
            break;
          case 'timeSlots':
            setTimeSlots(prev => prev.filter(item => item.id !== id));
            break;
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Error deleting item. Please try again.');
      }
    }
  };

  const validateForm = () => {
    const errors: any = {};

    switch (activeTab) {
      case 'departments':
        if (!formData.name?.trim()) errors.name = 'Name is required';
        if (!formData.code?.trim()) errors.code = 'Code is required';
        break;
      case 'classrooms':
        if (!formData.name?.trim()) errors.name = 'Name is required';
        if (!formData.type) errors.type = 'Type is required';
        if (!formData.capacity || formData.capacity < 1) errors.capacity = 'Valid capacity is required';
        break;
      case 'subjects':
        if (!formData.name?.trim()) errors.name = 'Name is required';
        if (!formData.code?.trim()) errors.code = 'Code is required';
        if (!formData.type) errors.type = 'Type is required';
        if (!formData.credits || formData.credits < 1) errors.credits = 'Valid credits required';
        if (!formData.semester || formData.semester < 1 || formData.semester > 8) errors.semester = 'Valid semester required';
        break;
      case 'faculty':
        if (!formData.name?.trim()) errors.name = 'Name is required';
        if (!formData.email?.trim()) errors.email = 'Email is required';
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Valid email required';
        break;
      case 'batches':
        if (!formData.name?.trim()) errors.name = 'Name is required';
        if (!formData.semester || formData.semester < 1 || formData.semester > 8) errors.semester = 'Valid semester required';
        if (!formData.student_count || formData.student_count < 1) errors.student_count = 'Valid student count required';
        if (!formData.shift) errors.shift = 'Shift is required';
        break;
      case 'timeSlots':
        if (!formData.day) errors.day = 'Day is required';
        if (!formData.start_time) errors.start_time = 'Start time is required';
        if (!formData.end_time) errors.end_time = 'End time is required';
        break;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const newItem = {
        ...formData,
        id: editingItem?.id || Date.now().toString(),
        is_active: formData.is_active !== false
      };

      // Update local state
      switch (activeTab) {
        case 'departments':
          if (editingItem) {
            setDepartments(prev => prev.map(item => item.id === editingItem.id ? newItem : item));
          } else {
            setDepartments(prev => [...prev, newItem]);
          }
          break;
        case 'classrooms':
          if (editingItem) {
            setClassrooms(prev => prev.map(item => item.id === editingItem.id ? newItem : item));
          } else {
            setClassrooms(prev => [...prev, newItem]);
          }
          break;
        case 'subjects':
          if (editingItem) {
            setSubjects(prev => prev.map(item => item.id === editingItem.id ? newItem : item));
          } else {
            setSubjects(prev => [...prev, newItem]);
          }
          break;
        case 'faculty':
          if (editingItem) {
            setFaculty(prev => prev.map(item => item.id === editingItem.id ? newItem : item));
          } else {
            setFaculty(prev => [...prev, newItem]);
          }
          break;
        case 'batches':
          if (editingItem) {
            setBatches(prev => prev.map(item => item.id === editingItem.id ? newItem : item));
          } else {
            setBatches(prev => [...prev, newItem]);
          }
          break;
        case 'timeSlots':
          if (editingItem) {
            setTimeSlots(prev => prev.map(item => item.id === editingItem.id ? newItem : item));
          } else {
            setTimeSlots(prev => [...prev, newItem]);
          }
          break;
      }

      setShowModal(false);
      setFormData({});
      setFormErrors({});
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Error saving item. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getEmptyFormData = () => {
    switch (activeTab) {
      case 'departments':
        return { name: '', code: '', head_of_department: '', is_active: true };
      case 'classrooms':
        return { name: '', type: 'lecture', capacity: 30, equipment: [], building: '', floor: 1, is_active: true };
      case 'subjects':
        return { name: '', code: '', type: 'theory', credits: 3, hours_per_week: 3, semester: 1, is_active: true };
      case 'faculty':
        return { name: '', email: '', max_hours_per_week: 20, is_active: true };
      case 'batches':
        return { name: '', semester: 1, student_count: 30, shift: 'morning', is_active: true };
      case 'timeSlots':
        return { day: 'Monday', start_time: '09:00', end_time: '10:00', duration: 1, is_active: true };
      default:
        return {};
    }
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

  const getTabConfig = () => {
    const configs = {
      departments: { label: 'Departments', icon: Building, color: 'blue' },
      classrooms: { label: 'Classrooms', icon: MapPin, color: 'green' },
      subjects: { label: 'Subjects', icon: BookOpen, color: 'purple' },
      faculty: { label: 'Faculty', icon: Users, color: 'orange' },
      batches: { label: 'Batches', icon: GraduationCap, color: 'teal' },
      timeSlots: { label: 'Time Slots', icon: Clock, color: 'indigo' }
    };
    return configs[activeTab as keyof typeof configs] || configs.departments;
  };

  const TabButton = ({ id, label, icon: Icon, color }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
        activeTab === id
          ? `bg-${color}-100 text-${color}-700 border-${color}-200 border`
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent'
      }`}
    >
      <Icon size={16} className="mr-2" />
      {label}
    </button>
  );

  const renderFormFields = () => {
    switch (activeTab) {
      case 'departments':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department Name *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Computer Science"
              />
              {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department Code *
              </label>
              <input
                type="text"
                value={formData.code || ''}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.code ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., CS"
              />
              {formErrors.code && <p className="text-red-500 text-xs mt-1">{formErrors.code}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Head of Department
              </label>
              <input
                type="text"
                value={formData.head_of_department || ''}
                onChange={(e) => setFormData({ ...formData, head_of_department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Dr. Smith"
              />
            </div>
          </>
        );

      case 'classrooms':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Classroom Name *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., CS-101"
              />
              {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  value={formData.type || 'lecture'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.type ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="lecture">Lecture Hall</option>
                  <option value="laboratory">Laboratory</option>
                  <option value="seminar">Seminar Room</option>
                </select>
                {formErrors.type && <p className="text-red-500 text-xs mt-1">{formErrors.type}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity *
                </label>
                <input
                  type="number"
                  value={formData.capacity || ''}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.capacity ? 'border-red-300' : 'border-gray-300'
                  }`}
                  min="1"
                  placeholder="30"
                />
                {formErrors.capacity && <p className="text-red-500 text-xs mt-1">{formErrors.capacity}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Building
                </label>
                <input
                  type="text"
                  value={formData.building || ''}
                  onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Main Block"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Floor
                </label>
                <input
                  type="number"
                  value={formData.floor || ''}
                  onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  placeholder="1"
                />
              </div>
            </div>
          </>
        );

      case 'subjects':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject Name *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Data Structures"
              />
              {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Code *
                </label>
                <input
                  type="text"
                  value={formData.code || ''}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.code ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., CS301"
                />
                {formErrors.code && <p className="text-red-500 text-xs mt-1">{formErrors.code}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  value={formData.type || 'theory'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.type ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="theory">Theory</option>
                  <option value="practical">Practical</option>
                  <option value="tutorial">Tutorial</option>
                </select>
                {formErrors.type && <p className="text-red-500 text-xs mt-1">{formErrors.type}</p>}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credits *
                </label>
                <input
                  type="number"
                  value={formData.credits || ''}
                  onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 0 })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.credits ? 'border-red-300' : 'border-gray-300'
                  }`}
                  min="1"
                  max="6"
                  placeholder="3"
                />
                {formErrors.credits && <p className="text-red-500 text-xs mt-1">{formErrors.credits}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hours/Week
                </label>
                <input
                  type="number"
                  value={formData.hours_per_week || ''}
                  onChange={(e) => setFormData({ ...formData, hours_per_week: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="10"
                  placeholder="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Semester *
                </label>
                <select
                  value={formData.semester || 1}
                  onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.semester ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  {[1,2,3,4,5,6,7,8].map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
                {formErrors.semester && <p className="text-red-500 text-xs mt-1">{formErrors.semester}</p>}
              </div>
            </div>
          </>
        );

      case 'faculty':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Faculty Name *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Dr. Smith"
              />
              {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., smith@university.edu"
              />
              {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Hours Per Week
              </label>
              <input
                type="number"
                value={formData.max_hours_per_week || ''}
                onChange={(e) => setFormData({ ...formData, max_hours_per_week: parseInt(e.target.value) || 20 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="40"
                placeholder="20"
              />
            </div>
          </>
        );

      case 'batches':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Batch Name *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., CS-5A"
              />
              {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Semester *
                </label>
                <select
                  value={formData.semester || 1}
                  onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.semester ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  {[1,2,3,4,5,6,7,8].map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
                {formErrors.semester && <p className="text-red-500 text-xs mt-1">{formErrors.semester}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student Count *
                </label>
                <input
                  type="number"
                  value={formData.student_count || ''}
                  onChange={(e) => setFormData({ ...formData, student_count: parseInt(e.target.value) || 0 })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.student_count ? 'border-red-300' : 'border-gray-300'
                  }`}
                  min="1"
                  placeholder="30"
                />
                {formErrors.student_count && <p className="text-red-500 text-xs mt-1">{formErrors.student_count}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shift *
              </label>
              <select
                value={formData.shift || 'morning'}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.shift ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
              {formErrors.shift && <p className="text-red-500 text-xs mt-1">{formErrors.shift}</p>}
            </div>
          </>
        );

      case 'timeSlots':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Day *
              </label>
              <select
                value={formData.day || 'Monday'}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.day ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              {formErrors.day && <p className="text-red-500 text-xs mt-1">{formErrors.day}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time *
                </label>
                <input
                  type="time"
                  value={formData.start_time || ''}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.start_time ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {formErrors.start_time && <p className="text-red-500 text-xs mt-1">{formErrors.start_time}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time *
                </label>
                <input
                  type="time"
                  value={formData.end_time || ''}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.end_time ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {formErrors.end_time && <p className="text-red-500 text-xs mt-1">{formErrors.end_time}</p>}
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const tabConfig = getTabConfig();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <tabConfig.icon className={`h-6 w-6 text-${tabConfig.color}-600 mr-3`} />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Data Management</h2>
              <p className="text-gray-600 mt-1">Manage all academic data in one place</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {filteredData.length} {tabConfig.label.toLowerCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap gap-2">
          <TabButton id="departments" label="Departments" icon={Building} color="blue" />
          <TabButton id="classrooms" label="Classrooms" icon={MapPin} color="green" />
          <TabButton id="subjects" label="Subjects" icon={BookOpen} color="purple" />
          <TabButton id="faculty" label="Faculty" icon={Users} color="orange" />
          <TabButton id="batches" label="Batches" icon={GraduationCap} color="teal" />
          <TabButton id="timeSlots" label="Time Slots" icon={Clock} color="indigo" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Search and Add */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${tabConfig.label.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleAdd}
            className={`bg-${tabConfig.color}-600 text-white px-6 py-2.5 rounded-lg hover:bg-${tabConfig.color}-700 transition-all duration-200 flex items-center shadow-sm hover:shadow-md transform hover:-translate-y-0.5`}
          >
            <Plus size={18} className="mr-2" />
            <span className="font-medium">Add {activeTab === 'faculty' ? 'Faculty' : tabConfig.label.slice(0, -1)}</span>
          </button>
        </div>

        {/* Data Table */}
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="font-medium text-gray-900">
                            {item.name || item.day || 'N/A'}
                          </div>
                          {item.code && (
                            <div className="text-sm text-gray-500">{item.code}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {activeTab === 'departments' && (
                        <div>
                          <div>Head: {item.head_of_department || 'Not assigned'}</div>
                        </div>
                      )}
                      {activeTab === 'classrooms' && (
                        <div>
                          <div className="capitalize">{item.type} • Capacity: {item.capacity}</div>
                          {item.building && <div className="text-xs text-gray-500">{item.building}, Floor {item.floor}</div>}
                        </div>
                      )}
                      {activeTab === 'subjects' && (
                        <div>
                          <div className="capitalize">{item.type} • Credits: {item.credits}</div>
                          <div className="text-xs text-gray-500">Semester {item.semester} • {item.hours_per_week}h/week</div>
                        </div>
                      )}
                      {activeTab === 'faculty' && (
                        <div>
                          <div>{item.email}</div>
                          <div className="text-xs text-gray-500">Max: {item.max_hours_per_week}h/week</div>
                        </div>
                      )}
                      {activeTab === 'batches' && (
                        <div>
                          <div>Semester {item.semester} • {item.student_count} students</div>
                          <div className="text-xs text-gray-500 capitalize">{item.shift} shift</div>
                        </div>
                      )}
                      {activeTab === 'timeSlots' && (
                        <div>
                          <div>{item.start_time} - {item.end_time}</div>
                          <div className="text-xs text-gray-500">{item.duration}h duration</div>
                        </div>
                      )}
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
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900 transition-colors p-1 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredData.length === 0 && !loading && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <tabConfig.icon className={`mx-auto h-12 w-12 text-gray-400 mb-4`} />
            <div className="text-gray-500 mb-2">No {tabConfig.label.toLowerCase()} found</div>
            <button
              onClick={handleAdd}
              className={`text-${tabConfig.color}-600 hover:text-${tabConfig.color}-800 font-medium`}
            >
              Add the first {activeTab === 'faculty' ? 'faculty member' : tabConfig.label.slice(0, -1).toLowerCase()}
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <tabConfig.icon className={`h-6 w-6 text-${tabConfig.color}-600 mr-3`} />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingItem ? 'Edit' : 'Add New'} {activeTab === 'faculty' ? 'Faculty Member' : tabConfig.label.slice(0, -1)}
                  </h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {renderFormFields()}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active !== false}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                    Active
                  </label>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-6 py-2 bg-${tabConfig.color}-600 text-white rounded-lg hover:bg-${tabConfig.color}-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center`}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    {editingItem ? 'Update' : 'Create'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}