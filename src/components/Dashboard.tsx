import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  BookOpen, 
  MapPin, 
  Clock, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GeneratedTimetable } from '../types';

interface DashboardStats {
  totalClassrooms: number;
  totalSubjects: number;
  totalFaculty: number;
  totalBatches: number;
  activeTimetables: number;
  pendingApprovals: number;
}

export function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalClassrooms: 45,
    totalSubjects: 120,
    totalFaculty: 85,
    totalBatches: 32,
    activeTimetables: 3,
    pendingApprovals: 2
  });

  const [recentTimetables, setRecentTimetables] = useState<GeneratedTimetable[]>([]);

  useEffect(() => {
    // Mock recent timetables data
    setRecentTimetables([
      {
        id: '1',
        name: 'Computer Science - Semester 5',
        entries: [],
        score: 92,
        metrics: {
          classroomUtilization: 88,
          facultyWorkloadBalance: 94,
          conflictCount: 2,
          preferenceMatch: 91
        },
        conflicts: [],
        suggestions: [],
        generatedAt: new Date('2024-01-15'),
        status: 'approved'
      },
      {
        id: '2',
        name: 'Mathematics - Semester 3',
        entries: [],
        score: 87,
        metrics: {
          classroomUtilization: 82,
          facultyWorkloadBalance: 89,
          conflictCount: 5,
          preferenceMatch: 88
        },
        conflicts: [],
        suggestions: [],
        generatedAt: new Date('2024-01-14'),
        status: 'under_review'
      },
      {
        id: '3',
        name: 'Physics - Semester 7',
        entries: [],
        score: 85,
        metrics: {
          classroomUtilization: 90,
          facultyWorkloadBalance: 78,
          conflictCount: 3,
          preferenceMatch: 86
        },
        conflicts: [],
        suggestions: [],
        generatedAt: new Date('2024-01-13'),
        status: 'draft'
      }
    ]);
  }, []);

  const StatCard = ({ icon: Icon, title, value, change, color }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 flex items-center ${
              change > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp size={14} className="mr-1" />
              {change > 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'under_review':
        return <Clock size={16} className="text-yellow-500" />;
      case 'draft':
        return <AlertCircle size={16} className="text-gray-400" />;
      default:
        return <AlertCircle size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'under_review':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'draft':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Academic Timetable Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
            </div>
            <div className="flex space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <Plus size={20} className="mr-2" />
                New Timetable
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <StatCard
            icon={MapPin}
            title="Classrooms"
            value={stats.totalClassrooms}
            change={5}
            color="bg-blue-500"
          />
          <StatCard
            icon={BookOpen}
            title="Subjects"
            value={stats.totalSubjects}
            change={8}
            color="bg-green-500"
          />
          <StatCard
            icon={Users}
            title="Faculty"
            value={stats.totalFaculty}
            change={3}
            color="bg-purple-500"
          />
          <StatCard
            icon={Calendar}
            title="Batches"
            value={stats.totalBatches}
            change={-2}
            color="bg-orange-500"
          />
          <StatCard
            icon={CheckCircle}
            title="Active Timetables"
            value={stats.activeTimetables}
            color="bg-teal-500"
          />
          <StatCard
            icon={Clock}
            title="Pending Approvals"
            value={stats.pendingApprovals}
            color="bg-yellow-500"
          />
        </div>

        {/* Recent Timetables */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Timetables</h2>
            <p className="text-gray-600 mt-1">Manage and review your generated timetables</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timetable
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Generated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTimetables.map((timetable) => (
                  <tr key={timetable.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{timetable.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        getStatusColor(timetable.status)
                      }`}>
                        {getStatusIcon(timetable.status)}
                        <span className="ml-1 capitalize">{timetable.status.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{timetable.score}%</div>
                        <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${timetable.score}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {timetable.metrics.classroomUtilization}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {timetable.generatedAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-900 mr-3">
                        Edit
                      </button>
                      {user?.role === 'admin' && (
                        <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-center">
              <Calendar className="mx-auto h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Generate New Timetable</h3>
              <p className="text-gray-600 text-sm">Create optimized schedules with our advanced algorithm</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-center">
              <Users className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Manage Faculty</h3>
              <p className="text-gray-600 text-sm">Add, edit, or remove faculty and their preferences</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-center">
              <MapPin className="mx-auto h-12 w-12 text-purple-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Classroom Setup</h3>
              <p className="text-gray-600 text-sm">Configure classrooms, capacity, and equipment</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-center">
              <BookOpen className="mx-auto h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Subject Management</h3>
              <p className="text-gray-600 text-sm">Organize subjects, credits, and requirements</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}