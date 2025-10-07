import React, { useState } from 'react';
import { supabase, dbHelpers } from '../lib/supabase';
import {
  Settings,
  Clock,
  Users,
  MapPin,
  BookOpen,
  Play,
  Save,
  Download,
  AlertCircle,
  CheckCircle,
  Loader,
  Eye,
  FileText,
  X
} from 'lucide-react';
import { TimetableOptimizer } from '../services/optimizationAlgorithm';
import { GeneratedTimetable, OptimizationParameters } from '../types';
import { TimetablePreview } from './TimetablePreview';
import { downloadTimetablePDF } from '../utils/pdfGenerator';

export function TimetableGenerator() {
  const [activeTab, setActiveTab] = useState('parameters');
  const [loading, setLoading] = useState(false);
  const [generatedTimetables, setGeneratedTimetables] = useState<GeneratedTimetable[]>([]);
  const [selectedTimetableForPreview, setSelectedTimetableForPreview] = useState<GeneratedTimetable | null>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [faculty, setFaculty] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  
  const [parameters, setParameters] = useState<OptimizationParameters>({
    maxClassesPerDay: 6,
    preferredStartTime: '09:00',
    preferredEndTime: '17:00',
    lunchBreakDuration: 50,
    minBreakBetweenClasses: 15,
    allowBackToBackClasses: true,
    prioritizeLabEquipment: true,
    balanceFacultyWorkload: true,
    minimizeGapsBetweenClasses: true
  });

  const [timeSlotConfig, setTimeSlotConfig] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    classDuration: 60,
    lunchStartTime: '11:30',
    lunchEndTime: '12:20',
    customSlots: [
      { startTime: '08:00', endTime: '09:00' },
      { startTime: '09:00', endTime: '10:00' },
      { startTime: '10:00', endTime: '11:00' },
      { startTime: '11:00', endTime: '11:30' },
      { startTime: '12:20', endTime: '13:20' },
      { startTime: '13:20', endTime: '14:20' },
      { startTime: '14:20', endTime: '15:20' },
      { startTime: '15:20', endTime: '16:20' },
      { startTime: '16:20', endTime: '17:20' }
    ]
  });

  const [basicData, setBasicData] = useState({
    semesters: [1, 2, 3, 4, 5, 6, 7, 8],
    selectedDepartmentId: '',
    selectedSemester: 5,
    totalBatches: 4,
    totalSubjects: 8,
    academicYear: '2024-2025'
  });

  // Load initial data
  React.useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [depts, rooms, slots] = await Promise.all([
          dbHelpers.getDepartments(),
          dbHelpers.getClassrooms(),
          dbHelpers.getTimeSlots()
        ]);

        setDepartments(depts || []);
        setClassrooms(rooms || []);
        setTimeSlots(slots || []);

        // Set first department as default
        if (depts && depts.length > 0) {
          setBasicData(prev => ({ ...prev, selectedDepartmentId: depts[0].id }));
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();
  }, []);

  // Load department-specific data when department changes
  React.useEffect(() => {
    const loadDepartmentData = async () => {
      if (!basicData.selectedDepartmentId) return;

      try {
        const [subjectsData, facultyData, batchesData] = await Promise.all([
          dbHelpers.getSubjects(basicData.selectedDepartmentId, basicData.selectedSemester),
          dbHelpers.getFaculty(basicData.selectedDepartmentId),
          dbHelpers.getBatches(basicData.selectedDepartmentId, basicData.selectedSemester)
        ]);

        setSubjects(subjectsData || []);
        setFaculty(facultyData || []);
        setBatches(batchesData || []);
      } catch (error) {
        console.error('Error loading department data:', error);
      }
    };

    loadDepartmentData();
  }, [basicData.selectedDepartmentId, basicData.selectedSemester]);

  const handleSaveTimetable = async (timetable: GeneratedTimetable) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Please log in to save timetables');
        return;
      }

      const { data: savedTimetable, error } = await supabase
        .from('timetables')
        .insert({
          name: timetable.name,
          department_id: basicData.selectedDepartmentId,
          semester: basicData.selectedSemester,
          academic_year: '2024-2025',
          status: 'draft',
          score: timetable.score,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      const entriesData = timetable.entries.map(entry => ({
        timetable_id: savedTimetable.id,
        subject_id: entry.subjectId,
        batch_id: entry.batchId,
        faculty_id: entry.facultyId,
        classroom_id: entry.classroomId,
        time_slot_id: entry.timeSlot.id,
        day: entry.day
      }));

      await supabase.from('timetable_entries').insert(entriesData);

      alert('Timetable saved successfully!');
    } catch (error) {
      console.error('Error saving timetable:', error);
      alert('Failed to save timetable');
    }
  };

  const handleExportTimetable = (timetable: GeneratedTimetable) => {
    const entries = timetable.entries.map(entry => {
      const subject = subjects.find(s => s.id === entry.subjectId);
      const facultyMember = faculty.find(f => f.id === entry.facultyId);
      const classroom = classrooms.find(c => c.id === entry.classroomId);
      const batch = batches.find(b => b.id === entry.batchId);

      return {
        day: entry.day,
        time_slots: {
          start_time: entry.timeSlot.startTime,
          end_time: entry.timeSlot.endTime
        },
        subjects: {
          name: subject?.name || 'Unknown',
          code: subject?.code || 'N/A',
          type: subject?.type || 'theory'
        },
        faculty: {
          name: facultyMember?.name || 'Unknown'
        },
        classrooms: {
          name: classroom?.name || 'Unknown',
          building: classroom?.building || 'N/A'
        },
        batches: {
          name: batch?.name || 'Unknown'
        }
      };
    });

    downloadTimetablePDF(
      timetable.name,
      entries,
      {
        department: departments.find(d => d.id === basicData.selectedDepartmentId)?.name,
        semester: `Semester ${basicData.selectedSemester}`,
        academicYear: basicData.academicYear,
        startDate: timeSlotConfig.startDate,
        endDate: timeSlotConfig.endDate
      }
    );
  };

  const handleGenerateTimetables = async () => {
    if (!basicData.selectedDepartmentId) {
      alert('Please select a department first');
      return;
    }

    setLoading(true);
    try {
      // Transform database data to match the optimizer interface
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
      setActiveTab('results');
    } catch (error) {
      console.error('Error generating timetables:', error);
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ id, label, icon: Icon, active }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-6 py-3 text-sm font-medium rounded-lg transition-colors ${
        active
          ? 'bg-blue-100 text-blue-700 border-blue-200'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      <Icon size={18} className="mr-2" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Timetable Generator</h1>
          <p className="text-gray-600">Create optimized academic schedules with advanced algorithms</p>
        </div>

        {/* Navigation */}
        <div className="flex space-x-2 mb-8 overflow-x-auto">
          <TabButton
            id="basic"
            label="Basic Setup"
            icon={Settings}
            active={activeTab === 'basic'}
          />
          <TabButton
            id="classrooms"
            label="Classrooms"
            icon={MapPin}
            active={activeTab === 'classrooms'}
          />
          <TabButton
            id="subjects"
            label="Subjects"
            icon={BookOpen}
            active={activeTab === 'subjects'}
          />
          <TabButton
            id="faculty"
            label="Faculty"
            icon={Users}
            active={activeTab === 'faculty'}
          />
          <TabButton
            id="parameters"
            label="Parameters"
            icon={Clock}
            active={activeTab === 'parameters'}
          />
          <TabButton
            id="results"
            label="Results"
            icon={CheckCircle}
            active={activeTab === 'results'}
          />
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Basic Setup Tab */}
          {activeTab === 'basic' && (
            <div className="p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Configuration</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    Academic Year
                  </label>
                  <input
                    type="text"
                    value={basicData.academicYear}
                    onChange={(e) => setBasicData({...basicData, academicYear: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 2024-2025"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={timeSlotConfig.startDate}
                    onChange={(e) => setTimeSlotConfig({...timeSlotConfig, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={timeSlotConfig.endDate}
                    onChange={(e) => setTimeSlotConfig({...timeSlotConfig, endDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Batches
                  </label>
                  <input
                    type="number"
                    value={basicData.totalBatches}
                    onChange={(e) => setBasicData({...basicData, totalBatches: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Subjects
                  </label>
                  <input
                    type="number"
                    value={basicData.totalSubjects}
                    onChange={(e) => setBasicData({...basicData, totalSubjects: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="15"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Parameters Tab */}
          {activeTab === 'parameters' && (
            <div className="p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Optimization Parameters</h2>

              <h3 className="text-lg font-medium text-gray-800 mb-4">Time Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lunch Start Time
                  </label>
                  <input
                    type="time"
                    value={timeSlotConfig.lunchStartTime}
                    onChange={(e) => setTimeSlotConfig({...timeSlotConfig, lunchStartTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lunch End Time
                  </label>
                  <input
                    type="time"
                    value={timeSlotConfig.lunchEndTime}
                    onChange={(e) => setTimeSlotConfig({...timeSlotConfig, lunchEndTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={timeSlotConfig.classDuration}
                    onChange={(e) => setTimeSlotConfig({...timeSlotConfig, classDuration: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="30"
                    max="180"
                  />
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
              </div>

              <h3 className="text-lg font-medium text-gray-800 mb-4">Custom Time Slots</h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-8">
                <div className="text-sm text-gray-600 mb-3">
                  Configure your daily class schedule. Lunch break ({timeSlotConfig.lunchStartTime} - {timeSlotConfig.lunchEndTime}) is automatically excluded.
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {timeSlotConfig.customSlots.map((slot, index) => (
                    <div key={index} className="bg-white p-3 rounded border border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Slot {index + 1}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-blue-600">
                        {slot.startTime} - {slot.endTime}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <h3 className="text-lg font-medium text-gray-800 mb-4">Optimization Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Start Time
                  </label>
                  <input
                    type="time"
                    value={parameters.preferredStartTime}
                    onChange={(e) => setParameters({...parameters, preferredStartTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred End Time
                  </label>
                  <input
                    type="time"
                    value={parameters.preferredEndTime}
                    onChange={(e) => setParameters({...parameters, preferredEndTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowBackToBack"
                    checked={parameters.allowBackToBackClasses}
                    onChange={(e) => setParameters({...parameters, allowBackToBackClasses: e.target.checked})}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="allowBackToBack" className="ml-2 text-sm text-gray-700">
                    Allow back-to-back classes
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="prioritizeLab"
                    checked={parameters.prioritizeLabEquipment}
                    onChange={(e) => setParameters({...parameters, prioritizeLabEquipment: e.target.checked})}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="prioritizeLab" className="ml-2 text-sm text-gray-700">
                    Prioritize laboratory equipment availability
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="balanceWorkload"
                    checked={parameters.balanceFacultyWorkload}
                    onChange={(e) => setParameters({...parameters, balanceFacultyWorkload: e.target.checked})}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="balanceWorkload" className="ml-2 text-sm text-gray-700">
                    Balance faculty workload
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && (
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Generated Timetables</h2>
                  <p className="text-gray-600 mt-1">
                    {generatedTimetables.length > 0 
                      ? `${generatedTimetables.length} optimized solutions generated`
                      : 'Click "Generate Timetables" to create optimized schedules'
                    }
                  </p>
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

              {generatedTimetables.length > 0 && (
                <div className="space-y-6">
                  {generatedTimetables.map((timetable, index) => (
                    <div key={timetable.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{timetable.name}</h3>
                          <p className="text-gray-600 text-sm mt-1">
                            Score: {timetable.score}% | Generated: {timetable.generatedAt.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedTimetableForPreview(timetable)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                          >
                            <Eye size={16} className="mr-1" />
                            Preview
                          </button>
                          <button
                            onClick={() => handleSaveTimetable(timetable)}
                            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center"
                          >
                            <Save size={16} className="mr-1" />
                            Save
                          </button>
                          <button
                            onClick={() => handleExportTimetable(timetable)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                          >
                            <Download size={16} className="mr-1" />
                            Export PDF
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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

                      {timetable.conflicts.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                            <AlertCircle size={16} className="mr-1 text-yellow-500" />
                            Conflicts & Suggestions
                          </h4>
                          <div className="space-y-2">
                            {timetable.conflicts.map((conflict, idx) => (
                              <div key={idx} className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
                                {conflict.description}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {timetable.suggestions.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Optimization Suggestions</h4>
                          <ul className="space-y-1">
                            {timetable.suggestions.map((suggestion, idx) => (
                              <li key={idx} className="text-sm text-gray-600 flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Other tabs content would go here */}
          {(activeTab === 'classrooms' || activeTab === 'subjects' || activeTab === 'faculty') && (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Settings size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
              </h3>
              <p className="text-gray-600">
                This section would contain forms to manage {activeTab}.
                For the MVP, we're focusing on the core optimization engine.
              </p>
            </div>
          )}
        </div>
      </div>

      {selectedTimetableForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-5/6 overflow-auto">
            <TimetablePreview
              timetable={selectedTimetableForPreview}
              subjects={subjects}
              faculty={faculty}
              classrooms={classrooms}
              batches={batches}
              onClose={() => setSelectedTimetableForPreview(null)}
              onExport={() => handleExportTimetable(selectedTimetableForPreview)}
            />
          </div>
        </div>
      )}
    </div>
  );
}