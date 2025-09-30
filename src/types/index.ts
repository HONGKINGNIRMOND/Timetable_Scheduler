export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
  department?: string;
}

export interface Classroom {
  id: string;
  name: string;
  capacity: number;
  type: 'lecture' | 'laboratory' | 'seminar';
  equipment: string[];
  building?: string;
  floor?: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  department: string;
  semester: number;
  credits: number;
  hoursPerWeek: number;
  type: 'theory' | 'practical' | 'tutorial';
  requiredEquipment?: string[];
  maxStudents?: number;
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  department: string;
  subjects: string[];
  maxHoursPerWeek: number;
  averageLeavesPerMonth: number;
  preferredTimeSlots?: string[];
  unavailableSlots?: string[];
}

export interface Batch {
  id: string;
  name: string;
  department: string;
  semester: number;
  studentCount: number;
  subjects: string[];
  shift: 'morning' | 'afternoon' | 'evening';
}

export interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  duration: number;
}

export interface FixedClass {
  id: string;
  subjectId: string;
  batchId: string;
  facultyId: string;
  classroomId: string;
  timeSlot: string;
  isRecurring: boolean;
  description?: string;
}

export interface TimetableEntry {
  id: string;
  subjectId: string;
  batchId: string;
  facultyId: string;
  classroomId: string;
  timeSlot: TimeSlot;
  day: string;
  week?: number;
}

export interface GeneratedTimetable {
  id: string;
  name: string;
  entries: TimetableEntry[];
  score: number;
  metrics: {
    classroomUtilization: number;
    facultyWorkloadBalance: number;
    conflictCount: number;
    preferenceMatch: number;
  };
  conflicts: Conflict[];
  suggestions: string[];
  generatedAt: Date;
  status: 'draft' | 'under_review' | 'approved' | 'rejected';
}

export interface Conflict {
  type: 'classroom' | 'faculty' | 'batch' | 'equipment';
  description: string;
  severity: 'low' | 'medium' | 'high';
  suggestions: string[];
  affectedEntries: string[];
}

export interface OptimizationParameters {
  maxClassesPerDay: number;
  preferredStartTime: string;
  preferredEndTime: string;
  lunchBreakDuration: number;
  minBreakBetweenClasses: number;
  allowBackToBackClasses: boolean;
  prioritizeLabEquipment: boolean;
  balanceFacultyWorkload: boolean;
  minimizeGapsBetweenClasses: boolean;
}