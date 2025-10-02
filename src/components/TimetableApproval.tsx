import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, MessageSquare, User, Calendar } from 'lucide-react';
import { dbHelpers } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface TimetableApprovalProps {
  onClose?: () => void;
}

export function TimetableApproval({ onClose }: TimetableApprovalProps) {
  const { user } = useAuth();
  const [timetables, setTimetables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimetable, setSelectedTimetable] = useState<any>(null);
  const [comment, setComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadPendingTimetables();
  }, []);

  const loadPendingTimetables = async () => {
    try {
      setLoading(true);
      const data = await dbHelpers.getTimetables(undefined, 'under_review');
      
      // Add sample data if no real data
      const sampleTimetables = [
        {
          id: 'sample-1',
          name: 'Computer Science - Semester 5 Timetable',
          departments: { name: 'Computer Science', code: 'CS' },
          semester: 5,
          score: 87,
          classroom_utilization: 78,
          faculty_workload_balance: 85,
          conflict_count: 2,
          preference_match: 92,
          status: 'under_review',
          created_at: new Date().toISOString(),
          created_by: 'coord-1',
          suggestions: [
            'Consider redistributing Lab sessions for better equipment utilization',
            'Faculty workload can be balanced by adjusting tutorial timings'
          ]
        },
        {
          id: 'sample-2',
          name: 'Electronics - Semester 3 Timetable',
          departments: { name: 'Electronics Engineering', code: 'ECE' },
          semester: 3,
          score: 82,
          classroom_utilization: 85,
          faculty_workload_balance: 79,
          conflict_count: 1,
          preference_match: 88,
          status: 'under_review',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          created_by: 'coord-2',
          suggestions: [
            'Minor scheduling conflict in Lab Block B on Wednesday',
            'Overall excellent optimization with minimal adjustments needed'
          ]
        }
      ];

      setTimetables(data && data.length > 0 ? data : sampleTimetables);
    } catch (error) {
      console.error('Error loading timetables:', error);
      setTimetables([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (timetableId: string) => {
    setActionLoading(true);
    try {
      await dbHelpers.updateTimetableStatus(timetableId, 'approved', user?.id);
      
      // Update local state
      setTimetables(prev => prev.map(t => 
        t.id === timetableId 
          ? { ...t, status: 'approved', approved_by: user?.id }
          : t
      ));
      
      setSelectedTimetable(null);
      setComment('');
    } catch (error) {
      console.error('Error approving timetable:', error);
      alert('Error approving timetable. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (timetableId: string) => {
    if (!comment.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }

    setActionLoading(true);
    try {
      await dbHelpers.updateTimetableStatus(timetableId, 'rejected', user?.id);
      
      // Update local state
      setTimetables(prev => prev.map(t => 
        t.id === timetableId 
          ? { ...t, status: 'rejected', approved_by: user?.id }
          : t
      ));
      
      setSelectedTimetable(null);
      setComment('');
    } catch (error) {
      console.error('Error rejecting timetable:', error);
      alert('Error rejecting timetable. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConflictSeverity = (count: number) => {
    if (count === 0) return { color: 'text-green-600', label: 'No Conflicts' };
    if (count <= 2) return { color: 'text-yellow-600', label: 'Minor Conflicts' };
    return { color: 'text-red-600', label: 'Major Conflicts' };
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
        <h2 className="text-xl font-semibold text-gray-900">Timetable Approval</h2>
        <p className="text-gray-600 mt-1">Review and approve pending timetables</p>
      </div>

      {timetables.length === 0 ? (
        <div className="p-8 text-center">
          <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">All Caught Up!</h3>
          <p className="text-gray-600">No timetables pending approval at the moment.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {timetables.map((timetable) => (
            <div key={timetable.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{timetable.name}</h3>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {timetable.departments?.name} - Semester {timetable.semester}
                    </span>
                    <span className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {new Date(timetable.created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <User size={14} className="mr-1" />
                      Created by Coordinator
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    Pending Review
                  </span>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Overall Score</div>
                  <div className={`text-xl font-bold ${getScoreColor(timetable.score)}`}>
                    {timetable.score}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Room Utilization</div>
                  <div className="text-xl font-bold text-blue-600">
                    {timetable.classroom_utilization}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Faculty Balance</div>
                  <div className="text-xl font-bold text-purple-600">
                    {timetable.faculty_workload_balance}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Conflicts</div>
                  <div className={`text-xl font-bold ${getConflictSeverity(timetable.conflict_count).color}`}>
                    {timetable.conflict_count}
                  </div>
                  <div className={`text-xs ${getConflictSeverity(timetable.conflict_count).color}`}>
                    {getConflictSeverity(timetable.conflict_count).label}
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              {timetable.suggestions && timetable.suggestions.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                    <AlertTriangle size={16} className="mr-1 text-yellow-500" />
                    Optimization Suggestions
                  </h4>
                  <ul className="space-y-1">
                    {timetable.suggestions.map((suggestion: string, index: number) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="text-yellow-500 mr-2">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setSelectedTimetable(timetable)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Details
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleReject(timetable.id)}
                    disabled={actionLoading}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center"
                  >
                    <XCircle size={16} className="mr-1" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(timetable.id)}
                    disabled={actionLoading}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center"
                  >
                    <CheckCircle size={16} className="mr-1" />
                    Approve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Review Modal */}
      {selectedTimetable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Review: {selectedTimetable.name}
              </h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comments / Feedback
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add your comments or reasons for approval/rejection..."
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSelectedTimetable(null);
                  setComment('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedTimetable.id)}
                disabled={actionLoading}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center"
              >
                <XCircle size={16} className="mr-1" />
                Reject
              </button>
              <button
                onClick={() => handleApprove(selectedTimetable.id)}
                disabled={actionLoading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center"
              >
                <CheckCircle size={16} className="mr-1" />
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}