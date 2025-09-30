import React, { useState, useEffect } from 'react';
import { supabase, dbHelpers } from '../lib/supabase';
import { 
  Calendar, 
  Users, 
  BookOpen, 
  MapPin, 
  Clock, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Plus,
  Settings,
  Play,
  Save,
  Download,
  Loader
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { TimetableOptimizer } from '../services/optimizationAlgorithm';
import { GeneratedTimetable, OptimizationParameters } from '../types';

interface DashboardStats {
  totalClassrooms: number;
  totalSubjects: number;
  totalFaculty: number;
  totalBatches: number;
  activeTimetables: number;
  pendingApprovals: number;
}

export function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [generatedTimetables, setGeneratedTimetables] = useState<GeneratedTimetable[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [faculty, setFaculty] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [recentTimetables, setRecentTimetables] = useState<GeneratedTimetable[]>([]);
  
  const [stats, setStats] = useState<DashboardStats>({
    totalClassrooms: 0,
    totalSubjects: 0,
    totalFaculty: 0,
    totalBatches: 0,
    activeTimetables: 0,
    pendingApprovals: 0
  });

  const [parameters, setParameters] = useState<OptimizationParameters>({
    maxClassesPerDay: 6,
    preferredStartTime: '09:00',
    preferredEndTime: '17:00',
    lunchBreakDuration: 60,
    minBreakBetweenClasses: 15,
    allowBackToBackClasses: true,
    prioritizeLabEquipment: true,
    balanceFacultyWorkload: true,
    minimizeGapsBetweenClasses: true
  });

  const [basicData, setBasicData] = useState({
    semesters: [1, 2, 3, 4, 5, 6, 7, 8],
    selectedDepartmentId: '',
    selectedSemester: 5,
    totalBatches: 4,
    totalSubjects: 8
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [classroomsData, subjectsData, facultyData, batchesData, timetablesData, depts, slots] = await Promise.all([
          dbHelpers.getClassrooms(),
          dbHelpers.getSubjects(),
          dbHelpers.getFaculty(),
          dbHelpers.getBatches(),
          dbHelpers.getTimetables(),
          dbHelpers.getDepartments(),
          dbHelpers.getTimeSlots()
        ]);

        setClassrooms(classroomsData || []);
        setSubjects(subjectsData || []);
        setFaculty(facultyData || []);
        setBatches(batchesData || []);
        setDepartments(depts || []);
        setTimeSlots(slots || []);

        setStats({
          totalClassrooms: classroomsData?.length || 0,
          totalSubjects: subjectsData?.length || 0,
          totalFaculty: facultyData?.length || 0,
          totalBatches: batchesData?.length || 0,
          activeTimetables: timetablesData?.filter(t => t.status === 'approved').length || 0,
          pendingApprovals: timetablesData?.filter(t => t.status === 'under_review').length || 0
        });

        const transformedTimetables = timetablesData?.slice(0, 5).map(t => ({
          id: t.id,
          name: t.name,
          entries: [],
          score: t.score,
          metrics: {
            classroomUtilization: t.classroom_utilization,
            facultyWorkloadBalance: t.faculty_workload_balance,
            conflictCount: t.conflict_count,
            preferenceMatch: t.preference_match
          },
          conflicts: [],
          suggestions: t.suggestions || [],
          generatedAt: new Date(t.created_at),
          status: t.status as 'draft' | 'under_review' | 'approved' | 'rejected'
        })) || [];

        setRecentTimetables(transformedTimetables);

        if (depts && depts.length > 0) {
          setBasicData(prev => ({ ...prev, selectedDepartmentId: depts[0].id }));
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadDashboardData();
  }, []);

  const handleGenerateTimetables = async () => {
    if (!basicData.selectedDepartmentId) {
      alert('Please select a department first');
      return;
    }

    setLoading(true);
    try {
      const transformedClassrooms = classrooms.map(c => ({
        id: c.id,
        name: c.name,
        capacity: c.capacity,
        type: c.type,
        equipment: c.equipment || [],
        building: c.building,
        floor: c.floor
      }));

      const transformedSubjects = subjects.map(s => ({
        id: s.id,
        name: s.name,
        code: s.code,
        department: departments.find(d => d.id === basicData.selectedDepartmentId)?.name || '',
        semester: s.semester,
        credits: s.credits,
        hoursPerWeek: s.hours_per_week,
        type: s.type,
        requiredEquipment: s.required_equipment || [],
        maxStudents: s.max_students
      }));

      const transformedFaculty = faculty.map(f => ({
        id: f.id,
        name: f.name,
        email: f.email,
        department: departments.find(d => d.id === basicData.selectedDepartmentId)?.name || '',
        subjects: f.faculty_subjects?.map((fs: any) => fs.subjects.id) || [],
        maxHoursPerWeek: f.max_hours_per_week,
        averageLeavesPerMonth: f.average_leaves_per_month,
        preferredTimeSlots: f.preferred_time_slots || [],
        unavailableSlots: f.unavailable_slots || []
      }));

      const transformedBatches = batches.map(b => ({
        id: b.id,
        name: b.name,
        department: departments.find(d => d.id === basicData.selectedDepartmentId)?.name || '',
        semester: b.semester,
        studentCount: b.student_count,
        subjects: b.batch_subjects?.map((bs: any) => bs.subjects.id) || [],
        shift: b.shift
      }));

      const transformedTimeSlots = timeSlots.map(ts => ({
        id: ts.id,
        day: ts.day,
        startTime: ts.start_time,
        endTime: ts.end_time,
        duration: ts.duration
      }));

      const optimizer = new TimetableOptimizer(
        transformedClassrooms,
        transformedSubjects,
        transformedFaculty,
        transformedBatches,
        transformedTimeSlots,
        [],
        parameters
      );

      const timetables = optimizer.generateOptimizedTimetables(3);
      setGeneratedTimetables(timetables);
      setActiveTab('generator');
    } catch (error) {
      console.error('Error generating timetables:', error);
    } finally {
      setLoading(false);
    }
  };

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
      {/* Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600 mr-3" />
                <span className="text-xl font-bold text-gray-900">Admin Panel</span>
              </div>
              <nav className="flex space-x-6">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'dashboard' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('generator')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'generator' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Generate Timetable
                </button>
                <button
                  onClick={() => setActiveTab('manage')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'manage' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Manage Data
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Administrator Dashboard</h1>
              <p className="text-gray-600">Manage academic schedules and optimize timetables</p>
            </div>

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
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Recent Timetables</h2>
                    <p className="text-gray-600 mt-1">Manage and review generated timetables</p>
                  </div>
                  <button
                    onClick={handleGenerateTimetables}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
                  >
                    {loading ? (
                      <Loader className="animate-spin mr-2" size={18} />
                    ) : (
                      <Plus size={18} className="mr-2" />
                    )}
                    {loading ? 'Generating...' : 'Generate New'}
                  </button>
                </div>
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
                            Approve
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Generator Tab */}
        {activeTab === 'generator' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Timetable Generator</h2>
                <p className="text-gray-600 mt-1">Configure parameters and generate optimized timetables</p>
              </div>
              <button
                onClick={handleGenerateTimetables}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {loading ? (
                  <Loader className="animate-spin mr-2" size={18} />
                ) : (
                  <Play className="mr-2" size={18} />
                )}
                {loading ? 'Generating...' : 'Generate Timetables'}
              </button>
            </div>

            {/* Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  value={basicData.selectedDepartmentId}
                  onChange={(e) => setBasicData({...basicData, selectedDepartmentId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semester
                </label>
                <select
                  value={basicData.selectedSemester}
                  onChange={(e) => setBasicData({...basicData, selectedSemester: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {basicData.semesters.map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Classes Per Day
                </label>
                <input
                  type="number"
                  value={parameters.maxClassesPerDay}
                  onChange={(e) => setParameters({...parameters, maxClassesPerDay: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lunch Break Duration (minutes)
                </label>
                <input
                  type="number"
                  value={parameters.lunchBreakDuration}
                  onChange={(e) => setParameters({...parameters, lunchBreakDuration: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="30"
                  max="120"
                />
              </div>
            </div>

            {/* Generated Results */}
            {generatedTimetables.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Generated Timetables</h3>
                {generatedTimetables.map((timetable, index) => (
                  <div key={timetable.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{timetable.name}</h4>
                        <p className="text-gray-600 text-sm mt-1">
                          Score: {timetable.score}% | Generated: {timetable.generatedAt.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                          <Save size={16} className="mr-1" />
                          Approve
                        </button>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                          <Download size={16} className="mr-1" />
                          Export
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-blue-600 text-sm font-medium">Classroom Utilization</div>
                        <div className="text-blue-900 text-xl font-bold">{timetable.metrics.classroomUtilization}%</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-green-600 text-sm font-medium">Faculty Balance</div>
                        <div className="text-green-900 text-xl font-bold">{timetable.metrics.facultyWorkloadBalance}%</div>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <div className="text-yellow-600 text-sm font-medium">Conflicts</div>
                        <div className="text-yellow-900 text-xl font-bold">{timetable.metrics.conflictCount}</div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="text-purple-600 text-sm font-medium">Preference Match</div>
                        <div className="text-purple-900 text-xl font-bold">{timetable.metrics.preferenceMatch}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Manage Tab */}
        {activeTab === 'manage' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <Settings size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Management</h2>
            <p className="text-gray-600">
              Manage departments, classrooms, subjects, faculty, and student batches.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}