import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, BookOpen, Download, Filter, Search, Eye, X } from 'lucide-react';
import { dbHelpers } from '../lib/supabase';

interface TimetableViewerProps {
  timetableId?: string;
  onClose?: () => void;
}

export function TimetableViewer({ timetableId, onClose }: TimetableViewerProps) {
  const [timetableEntries, setTimetableEntries] = useState<any[]>([]);
  const [timetableInfo, setTimetableInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
    '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00',
    '16:00-17:00', '17:00-18:00'
  ];

  useEffect(() => {
    if (timetableId) {
      loadTimetableData();
    } else {
      // Load sample data for demo
      loadSampleData();
    }
  }, [timetableId]);

  const loadTimetableData = async () => {
    try {
      setLoading(true);
      const [entries, info] = await Promise.all([
        dbHelpers.getTimetableEntries(timetableId!),
        // Get timetable info
        dbHelpers.getTimetables().then(tables => 
          tables?.find(t => t.id === timetableId)
        )
      ]);

      setTimetableEntries(entries || []);
      setTimetableInfo(info);
    } catch (error) {
      console.error('Error loading timetable:', error);
      loadSampleData();
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = () => {
    const sampleEntries = [
      {
        id: '1',
        day: 'Monday',
        time_slots: { start_time: '09:00', end_time: '10:00' },
        subjects: { name: 'Data Structures', code: 'CS301', type: 'theory' },
        faculty: { name: 'Dr. Smith' },
        classrooms: { name: 'CS-101', building: 'Main Block' },
        batches: { name: 'CS-5A' }
      },
      {
        id: '2',
        day: 'Monday',
        time_slots: { start_time: '10:00', end_time: '11:00' },
        subjects: { name: 'Database Systems', code: 'CS302', type: 'theory' },
        faculty: { name: 'Prof. Johnson' },
        classrooms: { name: 'CS-102', building: 'Main Block' },
        batches: { name: 'CS-5A' }
      },
      {
        id: '3',
        day: 'Tuesday',
        time_slots: { start_time: '09:00', end_time: '11:00' },
        subjects: { name: 'Programming Lab', code: 'CS303', type: 'practical' },
        faculty: { name: 'Dr. Brown' },
        classrooms: { name: 'Lab-1', building: 'Lab Block' },
        batches: { name: 'CS-5A' }
      },
      {
        id: '4',
        day: 'Wednesday',
        time_slots: { start_time: '14:00', end_time: '15:00' },
        subjects: { name: 'Computer Networks', code: 'CS304', type: 'theory' },
        faculty: { name: 'Dr. Wilson' },
        classrooms: { name: 'CS-103', building: 'Main Block' },
        batches: { name: 'CS-5A' }
      }
    ];

    setTimetableEntries(sampleEntries);
    setTimetableInfo({
      id: 'sample',
      name: 'Sample Timetable - CS 5th Semester',
      status: 'approved',
      score: 85
    });
    setLoading(false);
  };

  const getClassForTimeSlot = (day: string, timeSlot: string) => {
    return timetableEntries.find(entry => {
      const entryTime = `${entry.time_slots.start_time}-${entry.time_slots.end_time}`;
      return entry.day === day && entryTime === timeSlot;
    });
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

  const filteredEntries = timetableEntries.filter(entry => {
    const matchesDay = selectedDay === 'all' || entry.day === selectedDay;
    const matchesSearch = searchTerm === '' || 
      entry.subjects?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.faculty?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.classrooms?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesDay && matchesSearch;
  });

  const exportToPDF = () => {
    // Create a simple text export for now
    const content = timetableEntries.map(entry => 
      `${entry.day} ${entry.time_slots.start_time}-${entry.time_slots.end_time}: ${entry.subjects?.name} - ${entry.faculty?.name} - ${entry.classrooms?.name}`
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timetable-${timetableInfo?.name || 'export'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {timetableInfo?.name || 'Timetable Viewer'}
            </h2>
            <p className="text-gray-600 mt-1">
              {timetableInfo?.status && (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  timetableInfo.status === 'approved' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {timetableInfo.status}
                </span>
              )}
              {timetableInfo?.score && (
                <span className="ml-2 text-sm">Score: {timetableInfo.score}</span>
              )}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={exportToPDF}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Download size={16} className="mr-2" />
              Export
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search subjects, faculty, or classrooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Days</option>
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Time
                </th>
                {days.map(day => (
                  <th key={day} className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map(timeSlot => (
                <tr key={timeSlot}>
                  <td className="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">
                    {timeSlot}
                  </td>
                  {days.map(day => {
                    const classEntry = getClassForTimeSlot(day, timeSlot);
                    return (
                      <td key={`${day}-${timeSlot}`} className="border border-gray-200 p-2">
                        {classEntry ? (
                          <div className={`p-3 rounded-lg border-2 ${getTypeColor(classEntry.subjects?.type || 'theory')} min-h-[80px]`}>
                            <div className="font-medium text-sm mb-1">
                              {classEntry.subjects?.name}
                            </div>
                            <div className="text-xs text-gray-600 mb-1">
                              {classEntry.subjects?.code}
                            </div>
                            <div className="text-xs flex items-center mb-1">
                              <User size={12} className="mr-1" />
                              {classEntry.faculty?.name}
                            </div>
                            <div className="text-xs flex items-center mb-1">
                              <MapPin size={12} className="mr-1" />
                              {classEntry.classrooms?.name}
                            </div>
                            <div className="text-xs flex items-center">
                              <BookOpen size={12} className="mr-1" />
                              {classEntry.batches?.name}
                            </div>
                          </div>
                        ) : (
                          <div className="h-20"></div>
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

      {/* Summary */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{filteredEntries.length}</div>
            <div className="text-sm text-gray-600">Total Classes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {filteredEntries.filter(e => e.subjects?.type === 'theory').length}
            </div>
            <div className="text-sm text-gray-600">Theory Classes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {filteredEntries.filter(e => e.subjects?.type === 'practical').length}
            </div>
            <div className="text-sm text-gray-600">Lab Sessions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {new Set(filteredEntries.map(e => e.faculty?.name)).size}
            </div>
            <div className="text-sm text-gray-600">Faculty Involved</div>
          </div>
        </div>
      </div>
    </div>
  );
}