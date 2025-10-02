import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, Users, MapPin, BookOpen, RefreshCw } from 'lucide-react';
import { dbHelpers } from '../lib/supabase';

interface Conflict {
  id: string;
  type: 'classroom' | 'faculty' | 'batch' | 'equipment';
  description: string;
  severity: 'low' | 'medium' | 'high';
  suggestions: string[];
  affectedEntries: any[];
  timetableId: string;
  timetableName: string;
}

export function ConflictResolution() {
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState<string | null>(null);
  const [selectedConflict, setSelectedConflict] = useState<Conflict | null>(null);

  useEffect(() => {
    loadConflicts();
  }, []);

  const loadConflicts = async () => {
    try {
      setLoading(true);
      
      // Sample conflicts data
      const sampleConflicts: Conflict[] = [
        {
          id: 'conflict-1',
          type: 'classroom',
          description: 'Room CS-101 is double-booked on Monday 10:00-11:00',
          severity: 'high',
          suggestions: [
            'Move one class to CS-102 which is available at the same time',
            'Reschedule one class to a different time slot',
            'Use the larger auditorium if both classes can be combined'
          ],
          affectedEntries: [
            {
              subject: 'Data Structures',
              faculty: 'Dr. Smith',
              batch: 'CS-5A',
              time: 'Monday 10:00-11:00'
            },
            {
              subject: 'Database Systems',
              faculty: 'Prof. Johnson',
              batch: 'CS-5B',
              time: 'Monday 10:00-11:00'
            }
          ],
          timetableId: 'tt-1',
          timetableName: 'CS Semester 5 Timetable'
        },
        {
          id: 'conflict-2',
          type: 'faculty',
          description: 'Dr. Wilson is scheduled for two classes simultaneously',
          severity: 'high',
          suggestions: [
            'Assign another qualified faculty member to one of the classes',
            'Reschedule one class to when Dr. Wilson is available',
            'Consider team teaching if both subjects are related'
          ],
          affectedEntries: [
            {
              subject: 'Computer Networks',
              faculty: 'Dr. Wilson',
              batch: 'CS-5A',
              time: 'Tuesday 14:00-15:00'
            },
            {
              subject: 'Network Security',
              faculty: 'Dr. Wilson',
              batch: 'CS-7A',
              time: 'Tuesday 14:00-15:00'
            }
          ],
          timetableId: 'tt-1',
          timetableName: 'CS Semester 5 Timetable'
        },
        {
          id: 'conflict-3',
          type: 'equipment',
          description: 'Lab equipment conflict: Both classes need specialized hardware',
          severity: 'medium',
          suggestions: [
            'Schedule lab sessions in different time slots',
            'Use alternative lab with similar equipment',
            'Arrange for additional equipment if budget allows'
          ],
          affectedEntries: [
            {
              subject: 'Microprocessor Lab',
              faculty: 'Dr. Brown',
              batch: 'ECE-5A',
              time: 'Wednesday 14:00-16:00'
            },
            {
              subject: 'Embedded Systems Lab',
              faculty: 'Prof. Davis',
              batch: 'ECE-5B',
              time: 'Wednesday 14:00-16:00'
            }
          ],
          timetableId: 'tt-2',
          timetableName: 'ECE Semester 5 Timetable'
        },
        {
          id: 'conflict-4',
          type: 'batch',
          description: 'Student batch CS-5A has overlapping class schedules',
          severity: 'medium',
          suggestions: [
            'Reschedule one of the overlapping classes',
            'Check if classes can be combined for efficiency',
            'Verify batch assignment accuracy'
          ],
          affectedEntries: [
            {
              subject: 'Software Engineering',
              faculty: 'Prof. Miller',
              batch: 'CS-5A',
              time: 'Thursday 11:00-12:00'
            },
            {
              subject: 'Web Development',
              faculty: 'Dr. Lee',
              batch: 'CS-5A',
              time: 'Thursday 11:00-12:00'
            }
          ],
          timetableId: 'tt-1',
          timetableName: 'CS Semester 5 Timetable'
        }
      ];

      setConflicts(sampleConflicts);
    } catch (error) {
      console.error('Error loading conflicts:', error);
      setConflicts([]);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'classroom':
        return <MapPin size={16} />;
      case 'faculty':
        return <Users size={16} />;
      case 'batch':
        return <BookOpen size={16} />;
      case 'equipment':
        return <AlertTriangle size={16} />;
      default:
        return <AlertTriangle size={16} />;
    }
  };

  const handleResolveConflict = async (conflictId: string) => {
    setResolving(conflictId);
    
    // Simulate resolution process
    setTimeout(() => {
      setConflicts(prev => prev.filter(c => c.id !== conflictId));
      setResolving(null);
      setSelectedConflict(null);
    }, 2000);
  };

  const handleIgnoreConflict = (conflictId: string) => {
    setConflicts(prev => prev.filter(c => c.id !== conflictId));
    setSelectedConflict(null);
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
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Conflict Resolution</h2>
            <p className="text-gray-600 mt-1">
              {conflicts.length} conflicts found across all timetables
            </p>
          </div>
          <button
            onClick={loadConflicts}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {conflicts.length === 0 ? (
        <div className="p-8 text-center">
          <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Conflicts Found!</h3>
          <p className="text-gray-600">All timetables are optimally scheduled without conflicts.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {conflicts.map((conflict) => (
            <div key={conflict.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${getSeverityColor(conflict.severity)}`}>
                    {getTypeIcon(conflict.type)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{conflict.description}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {conflict.timetableName} • {conflict.type.charAt(0).toUpperCase() + conflict.type.slice(1)} Conflict
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(conflict.severity)}`}>
                  {conflict.severity.toUpperCase()}
                </span>
              </div>

              {/* Affected Entries */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Affected Classes:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {conflict.affectedEntries.map((entry, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-medium text-sm">{entry.subject}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {entry.faculty} • {entry.batch} • {entry.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Suggested Solutions:</h4>
                <ul className="space-y-1">
                  {conflict.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => handleIgnoreConflict(conflict.id)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Ignore
                </button>
                <button
                  onClick={() => setSelectedConflict(conflict)}
                  className="px-4 py-2 text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleResolveConflict(conflict.id)}
                  disabled={resolving === conflict.id}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center"
                >
                  {resolving === conflict.id ? (
                    <>
                      <RefreshCw size={16} className="mr-1 animate-spin" />
                      Resolving...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} className="mr-1" />
                      Auto-Resolve
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Conflict Modal */}
      {selectedConflict && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Conflict Details
              </h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600">{selectedConflict.description}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Affected Classes</h4>
                  <div className="space-y-2">
                    {selectedConflict.affectedEntries.map((entry, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="font-medium">{entry.subject}</div>
                        <div className="text-sm text-gray-600">
                          Faculty: {entry.faculty} | Batch: {entry.batch} | Time: {entry.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Resolution Options</h4>
                  <div className="space-y-2">
                    {selectedConflict.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                        <input
                          type="radio"
                          name="resolution"
                          className="mt-1"
                          defaultChecked={index === 0}
                        />
                        <span className="text-sm">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedConflict(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleResolveConflict(selectedConflict.id)}
                disabled={resolving === selectedConflict.id}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center"
              >
                {resolving === selectedConflict.id ? (
                  <>
                    <RefreshCw size={16} className="mr-1 animate-spin" />
                    Resolving...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} className="mr-1" />
                    Apply Resolution
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