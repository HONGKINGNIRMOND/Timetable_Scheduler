import React, { useState, useEffect } from 'react';
import { supabase, dbHelpers } from '../lib/supabase';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  BookOpen, 
  User,
  Search,
  Filter,
  Download,
  Eye
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { TimetableViewer } from './TimetableViewer';

interface TimetableEntry {
  id: string;
  day: string;
  time: string;
  subject: string;
  faculty: string;
  classroom: string;
  type: 'theory' | 'practical' | 'tutorial';
}

export function StudentDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('timetable');
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSemester, setSelectedSemester] = useState(5);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [departments, setDepartments] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [timetableEntries, setTimetableEntries] = useState<TimetableEntry[]>([]);
  const [showTimetableViewer, setShowTimetableViewer] = useState(false);

  // Sample timetable data
  const sampleTimetable: TimetableEntry[] = [
    { id: '1', day: 'Monday', time: '09:00-10:00', subject: 'Data Structures', faculty: 'Dr. Smith', classroom: 'CS-101', type: 'theory' },
    { id: '2', day: 'Monday', time: '10:00-11:00', subject: 'Database Systems', faculty: 'Prof. Johnson', classroom: 'CS-102', type: 'theory' },
    { id: '3', day: 'Monday', time: '11:30-12:30', subject: 'Programming Lab', faculty: 'Dr. Brown', classroom: 'Lab-1', type: 'practical' },
    { id: '4', day: 'Tuesday', time: '09:00-10:00', subject: 'Computer Networks', faculty: 'Dr. Wilson', classroom: 'CS-103', type: 'theory' },
    { id: '5', day: 'Tuesday', time: '10:00-11:00', subject: 'Software Engineering', faculty: 'Prof. Davis', classroom: 'CS-104', type: 'theory' },
    { id: '6', day: 'Tuesday', time: '14:00-16:00', subject: 'Network Lab', faculty: 'Dr. Wilson', classroom: 'Lab-2', type: 'practical' },
    { id: '7', day: 'Wednesday', time: '09:00-10:00', subject: 'Operating Systems', faculty: 'Dr. Miller', classroom: 'CS-105', type: 'theory' },
    { id: '8', day: 'Wednesday', time: '10:00-11:00', subject: 'Data Structures', faculty: 'Dr. Smith', classroom: 'CS-101', type: 'tutorial' },
    { id: '9', day: 'Thursday', time: '09:00-10:00', subject: 'Machine Learning', faculty: 'Prof. Garcia', classroom: 'CS-106', type: 'theory' },
    { id: '10', day: 'Thursday', time: '11:30-13:30', subject: 'ML Lab', faculty: 'Prof. Garcia', classroom: 'Lab-3', type: 'practical' },
    { id: '11', day: 'Friday', time: '09:00-10:00', subject: 'Web Development', faculty: 'Dr. Lee', classroom: 'CS-107', type: 'theory' },
    { id: '12', day: 'Friday', time: '10:00-12:00', subject: 'Web Dev Lab', faculty: 'Dr. Lee', classroom: 'Lab-4', type: 'practical' },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [depts, batchesData] = await Promise.all([
          dbHelpers.getDepartments(),
          dbHelpers.getBatches()
        ]);

        setDepartments(depts || []);
        setBatches(batchesData || []);
        setTimetableEntries(sampleTimetable);
      } catch (error) {
        console.error('Error loading data:', error);
        setTimetableEntries(sampleTimetable);
      }
    };

    loadData();
  }, []);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    '09:00-10:00', '10:00-11:00', '11:00-12:00', '11:30-12:30',
    '12:30-13:30', '14:00-15:00', '14:00-16:00', '15:00-16:00', '16:00-17:00'
  ];

  const getClassForTimeSlot = (day: string, timeSlot: string) => {
    return timetableEntries.find(entry => 
      entry.day === day && entry.time === timeSlot
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'theory':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'practical':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'tutorial':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getTodayClasses = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return timetableEntries.filter(entry => entry.day === today);
  };

  const getUpcomingClasses = () => {
    const today = new Date().getDay();
    const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return timetableEntries.filter(entry => {
      const dayIndex = days.indexOf(entry.day);
      return dayIndex >= days.indexOf(todayName);
    }).slice(0, 5);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600 mr-3" />
                <span className="text-xl font-bold text-gray-900">Student Portal</span>
              </div>
              <nav className="flex space-x-6">
                <button
                  onClick={() => setActiveTab('timetable')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'timetable' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  My Timetable
                </button>
                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'schedule' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Today's Schedule
                </button>
                <button
                  onClick={() => setActiveTab('search')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'search' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Search Timetables
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* My Timetable Tab */}
        {activeTab === 'timetable' && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">My Timetable</h1>
              <p className="text-gray-600">View your weekly class schedule</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1,2,3,4,5,6,7,8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                  <select
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Batch</option>
                    <option value="A">Batch A</option>
                    <option value="B">Batch B</option>
                    <option value="C">Batch C</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <Download size={16} className="mr-2" />
                    Export PDF
                  </button>
                </div>
              </div>
            </div>

            {/* Timetable Grid */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                        Time
                      </th>
                      {days.map(day => (
                        <th key={day} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {timeSlots.map(timeSlot => (
                      <tr key={timeSlot} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {timeSlot}
                        </td>
                        {days.map(day => {
                          const classEntry = getClassForTimeSlot(day, timeSlot);
                          return (
                            <td key={`${day}-${timeSlot}`} className="px-4 py-4">
                              {classEntry ? (
                                <div className={`p-3 rounded-lg border-2 ${getTypeColor(classEntry.type)}`}>
                                  <div className="font-medium text-sm">{classEntry.subject}</div>
                                  <div className="text-xs mt-1">{classEntry.faculty}</div>
                                  <div className="text-xs flex items-center mt-1">
                                    <MapPin size={12} className="mr-1" />
                                    {classEntry.classroom}
                                  </div>
                                </div>
                              ) : (
                                <div className="h-16"></div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Today's Schedule Tab */}
        {activeTab === 'schedule' && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Today's Schedule</h1>
              <p className="text-gray-600">Your classes for today</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Classes */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Today's Classes</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {getTodayClasses().map(classEntry => (
                        <div key={classEntry.id} className={`p-4 rounded-lg border-2 ${getTypeColor(classEntry.type)}`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-lg">{classEntry.subject}</h3>
                              <p className="text-sm mt-1 flex items-center">
                                <User size={14} className="mr-1" />
                                {classEntry.faculty}
                              </p>
                              <p className="text-sm mt-1 flex items-center">
                                <MapPin size={14} className="mr-1" />
                                {classEntry.classroom}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">{classEntry.time}</div>
                              <div className="text-xs mt-1 capitalize">{classEntry.type}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Classes Today</span>
                      <span className="font-medium">{getTodayClasses().length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Theory Classes</span>
                      <span className="font-medium">{getTodayClasses().filter(c => c.type === 'theory').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lab Sessions</span>
                      <span className="font-medium">{getTodayClasses().filter(c => c.type === 'practical').length}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Classes</h3>
                  <div className="space-y-3">
                    {getUpcomingClasses().slice(0, 3).map(classEntry => (
                      <div key={classEntry.id} className="border-l-4 border-blue-500 pl-3">
                        <div className="font-medium text-sm">{classEntry.subject}</div>
                        <div className="text-xs text-gray-600">{classEntry.day} • {classEntry.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Search Timetables Tab */}
        {activeTab === 'search' && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Search Timetables</h1>
              <p className="text-gray-600">Find timetables for different departments and batches</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Computer Science</option>
                    <option>Electronics</option>
                    <option>Mechanical</option>
                    <option>Civil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {[1,2,3,4,5,6,7,8].map(sem => (
                      <option key={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Batch</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All Batches</option>
                    <option>Batch A</option>
                    <option>Batch B</option>
                    <option>Batch C</option>
                  </select>
                </div>
              </div>

              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <Search size={16} className="mr-2" />
                Search Timetables
              </button>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Timetables</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { dept: 'Computer Science', sem: 5, batch: 'A', status: 'Active' },
                    { dept: 'Computer Science', sem: 5, batch: 'B', status: 'Active' },
                    { dept: 'Electronics', sem: 3, batch: 'A', status: 'Active' },
                    { dept: 'Mechanical', sem: 7, batch: 'C', status: 'Draft' },
                  ].map((timetable, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{timetable.dept}</h4>
                          <p className="text-sm text-gray-600">Semester {timetable.sem} • Batch {timetable.batch}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          timetable.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {timetable.status}
                        </span>
                      </div>
                      <button className="w-full bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center">
                        <Eye size={16} className="mr-2" />
                        <button
                          onClick={() => setShowTimetableViewer(true)}
                          className="w-full bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                        >
                          <Eye size={16} className="mr-2" />
                          View Timetable
                        </button>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Timetable Viewer Modal */}
      {showTimetableViewer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-7xl w-full max-h-[95vh] overflow-hidden">
            <TimetableViewer onClose={() => setShowTimetableViewer(false)} />
          </div>
        </div>
      )}
    </div>
  );
}