import {
  Classroom,
  Subject,
  Faculty,
  Batch,
  TimeSlot,
  FixedClass,
  TimetableEntry,
  GeneratedTimetable,
  Conflict,
  OptimizationParameters
} from '../types';

export class TimetableOptimizer {
  private classrooms: Classroom[];
  private subjects: Subject[];
  private faculty: Faculty[];
  private batches: Batch[];
  private timeSlots: TimeSlot[];
  private fixedClasses: FixedClass[];
  private parameters: OptimizationParameters;

  constructor(
    classrooms: Classroom[],
    subjects: Subject[],
    faculty: Faculty[],
    batches: Batch[],
    timeSlots: TimeSlot[],
    fixedClasses: FixedClass[],
    parameters: OptimizationParameters
  ) {
    this.classrooms = classrooms;
    this.subjects = subjects;
    this.faculty = faculty;
    this.batches = batches;
    this.timeSlots = timeSlots;
    this.fixedClasses = fixedClasses;
    this.parameters = parameters;
  }

  generateOptimizedTimetables(count: number = 3): GeneratedTimetable[] {
    const timetables: GeneratedTimetable[] = [];

    for (let i = 0; i < count; i++) {
      let bestAttempt = this.generateSingleTimetable(i);

      for (let attempt = 0; attempt < 3; attempt++) {
        const candidate = this.generateSingleTimetable(i * 10 + attempt);
        if (candidate.score > bestAttempt.score) {
          bestAttempt = candidate;
        }
      }

      timetables.push(bestAttempt);
    }

    return timetables.sort((a, b) => b.score - a.score);
  }

  private generateSingleTimetable(variant: number): GeneratedTimetable {
    const entries: TimetableEntry[] = [];
    const conflicts: Conflict[] = [];

    // Start with fixed classes
    this.fixedClasses.forEach(fixedClass => {
      const timeSlot = this.timeSlots.find(ts => ts.id === fixedClass.timeSlot);
      if (timeSlot) {
        entries.push({
          id: `fixed-${fixedClass.id}`,
          subjectId: fixedClass.subjectId,
          batchId: fixedClass.batchId,
          facultyId: fixedClass.facultyId,
          classroomId: fixedClass.classroomId,
          timeSlot,
          day: timeSlot.day
        });
      }
    });

    // Generate schedule for each batch
    this.batches.forEach(batch => {
      this.scheduleBatch(batch, entries, conflicts, variant);
    });

    const metrics = this.calculateMetrics(entries);
    const score = this.calculateScore(metrics, conflicts);
    const suggestions = this.generateSuggestions(conflicts, entries);

    return {
      id: `timetable-${variant + 1}`,
      name: `Optimized Timetable ${variant + 1}`,
      entries,
      score,
      metrics,
      conflicts,
      suggestions,
      generatedAt: new Date(),
      status: 'draft'
    };
  }

  private scheduleBatch(
    batch: Batch,
    entries: TimetableEntry[],
    conflicts: Conflict[],
    variant: number
  ): void {
    const batchSubjects = this.subjects.filter(s => batch.subjects.includes(s.id));

    batchSubjects.forEach(subject => {
      const requiredHours = subject.hoursPerWeek;
      const scheduledHours = this.scheduleSubjectForBatch(
        subject,
        batch,
        requiredHours,
        entries,
        conflicts,
        variant
      );

      if (scheduledHours < requiredHours) {
        conflicts.push({
          type: 'batch',
          description: `Unable to schedule all ${requiredHours} hours for ${subject.name} with ${batch.name}`,
          severity: 'high',
          suggestions: [
            'Consider adding more time slots',
            'Check faculty availability',
            'Review classroom capacity'
          ],
          affectedEntries: []
        });
      }
    });
  }

  private scheduleSubjectForBatch(
    subject: Subject,
    batch: Batch,
    requiredHours: number,
    entries: TimetableEntry[],
    conflicts: Conflict[],
    variant: number
  ): number {
    let scheduledHours = 0;
    const availableFaculty = this.faculty.filter(f => f.subjects.includes(subject.id));

    if (availableFaculty.length === 0) {
      conflicts.push({
        type: 'faculty',
        description: `No faculty available for ${subject.name}`,
        severity: 'high',
        suggestions: ['Assign faculty to this subject'],
        affectedEntries: []
      });
      return 0;
    }

    // Try different strategies based on variant
    const strategies = [
      this.scheduleWithMinimalGaps.bind(this),
      this.scheduleWithFacultyBalance.bind(this),
      this.scheduleWithRoomOptimization.bind(this)
    ];

    const strategy = strategies[variant % strategies.length];
    scheduledHours = strategy(subject, batch, requiredHours, entries, conflicts, availableFaculty);

    return scheduledHours;
  }

  private scheduleWithMinimalGaps(
    subject: Subject,
    batch: Batch,
    requiredHours: number,
    entries: TimetableEntry[],
    conflicts: Conflict[],
    availableFaculty: Faculty[]
  ): number {
    let scheduledHours = 0;
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const classesNeeded = Math.ceil(requiredHours / 60);
    let classesScheduled = 0;

    for (const day of days) {
      if (classesScheduled >= classesNeeded) break;

      const daySlots = this.timeSlots.filter(ts => ts.day === day);
      const sortedSlots = this.sortSlotsByPreference(daySlots, batch, entries);

      for (const slot of sortedSlots) {
        if (classesScheduled >= classesNeeded) break;

        const assignment = this.assignSlot(subject, batch, slot, availableFaculty, entries);
        if (assignment) {
          entries.push(assignment);
          scheduledHours += slot.duration;
          classesScheduled++;
        }
      }
    }

    return scheduledHours;
  }

  private sortSlotsByPreference(
    slots: TimeSlot[],
    batch: Batch,
    entries: TimetableEntry[]
  ): TimeSlot[] {
    const batchSchedule = entries.filter(e => e.batchId === batch.id);

    return slots
      .filter(slot =>
        !batchSchedule.some(schedule =>
          schedule.day === slot.day &&
          this.slotsOverlap(schedule.timeSlot, slot)
        )
      )
      .sort((a, b) => {
        const aMinutes = this.timeToMinutes(a.startTime);
        const bMinutes = this.timeToMinutes(b.startTime);

        const preferredStart = this.timeToMinutes(this.parameters.preferredStartTime);
        const preferredEnd = this.timeToMinutes(this.parameters.preferredEndTime);

        const aInRange = aMinutes >= preferredStart && aMinutes < preferredEnd ? 1 : 0;
        const bInRange = bMinutes >= preferredStart && bMinutes < preferredEnd ? 1 : 0;

        if (aInRange !== bInRange) return bInRange - aInRange;

        return aMinutes - bMinutes;
      });
  }

  private scheduleWithFacultyBalance(
    subject: Subject,
    batch: Batch,
    requiredHours: number,
    entries: TimetableEntry[],
    conflicts: Conflict[],
    availableFaculty: Faculty[]
  ): number {
    let scheduledHours = 0;
    
    // Sort faculty by current workload (ascending)
    const facultyWorkload = this.calculateFacultyWorkload(entries);
    const sortedFaculty = availableFaculty.sort((a, b) => 
      (facultyWorkload[a.id] || 0) - (facultyWorkload[b.id] || 0)
    );

    for (const faculty of sortedFaculty) {
      if (scheduledHours >= requiredHours) break;

      const availableSlots = this.getAvailableSlotsForFaculty(faculty, entries);
      const bestSlot = this.findBestSlotForBatch(availableSlots, batch, entries);

      if (bestSlot) {
        const assignment = this.assignSpecificSlot(subject, batch, bestSlot, faculty, entries);
        if (assignment) {
          entries.push(assignment);
          scheduledHours += bestSlot.duration;
        }
      }
    }

    return scheduledHours;
  }

  private scheduleWithRoomOptimization(
    subject: Subject,
    batch: Batch,
    requiredHours: number,
    entries: TimetableEntry[],
    conflicts: Conflict[],
    availableFaculty: Faculty[]
  ): number {
    let scheduledHours = 0;
    const suitableClassrooms = this.findSuitableClassrooms(subject, batch);

    for (const classroom of suitableClassrooms) {
      if (scheduledHours >= requiredHours) break;

      const availableSlots = this.getAvailableSlotsForClassroom(classroom, entries);
      const bestSlot = this.findBestSlotForBatch(availableSlots, batch, entries);

      if (bestSlot) {
        const assignment = this.assignSlotWithClassroom(subject, batch, bestSlot, classroom, availableFaculty, entries);
        if (assignment) {
          entries.push(assignment);
          scheduledHours += bestSlot.duration;
        }
      }
    }

    return scheduledHours;
  }

  private findBestSlotForBatch(
    availableSlots: TimeSlot[],
    batch: Batch,
    entries: TimetableEntry[]
  ): TimeSlot | null {
    const batchSchedule = entries.filter(e => e.batchId === batch.id);

    const freeSlots = availableSlots.filter(slot =>
      !batchSchedule.some(schedule =>
        schedule.day === slot.day &&
        this.slotsOverlap(schedule.timeSlot, slot)
      )
    );

    if (freeSlots.length === 0) return null;

    return freeSlots.sort((a, b) => {
      const aDaySchedule = batchSchedule.filter(e => e.day === a.day);
      const bDaySchedule = batchSchedule.filter(e => e.day === b.day);

      if (aDaySchedule.length !== bDaySchedule.length) {
        return aDaySchedule.length - bDaySchedule.length;
      }

      const aMinutes = this.timeToMinutes(a.startTime);
      const bMinutes = this.timeToMinutes(b.startTime);

      return aMinutes - bMinutes;
    })[0];
  }

  private assignSlot(
    subject: Subject,
    batch: Batch,
    slot: TimeSlot,
    availableFaculty: Faculty[],
    entries: TimetableEntry[]
  ): TimetableEntry | null {
    // Find available faculty for this slot
    const freeFaculty = availableFaculty.filter(faculty => 
      this.isFacultyFreeAtSlot(faculty, slot, entries)
    );

    if (freeFaculty.length === 0) return null;

    // Find suitable classroom
    const suitableClassrooms = this.findSuitableClassrooms(subject, batch);
    const freeClassroom = suitableClassrooms.find(classroom => 
      this.isClassroomFreeAtSlot(classroom, slot, entries)
    );

    if (!freeClassroom) return null;

    return {
      id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      subjectId: subject.id,
      batchId: batch.id,
      facultyId: freeFaculty[0].id,
      classroomId: freeClassroom.id,
      timeSlot: slot,
      day: slot.day
    };
  }

  private assignSpecificSlot(
    subject: Subject,
    batch: Batch,
    slot: TimeSlot,
    faculty: Faculty,
    entries: TimetableEntry[]
  ): TimetableEntry | null {
    if (!this.isFacultyFreeAtSlot(faculty, slot, entries)) return null;

    const suitableClassrooms = this.findSuitableClassrooms(subject, batch);
    const freeClassroom = suitableClassrooms.find(classroom => 
      this.isClassroomFreeAtSlot(classroom, slot, entries)
    );

    if (!freeClassroom) return null;

    return {
      id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      subjectId: subject.id,
      batchId: batch.id,
      facultyId: faculty.id,
      classroomId: freeClassroom.id,
      timeSlot: slot,
      day: slot.day
    };
  }

  private assignSlotWithClassroom(
    subject: Subject,
    batch: Batch,
    slot: TimeSlot,
    classroom: Classroom,
    availableFaculty: Faculty[],
    entries: TimetableEntry[]
  ): TimetableEntry | null {
    if (!this.isClassroomFreeAtSlot(classroom, slot, entries)) return null;

    const freeFaculty = availableFaculty.filter(faculty => 
      this.isFacultyFreeAtSlot(faculty, slot, entries)
    );

    if (freeFaculty.length === 0) return null;

    return {
      id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      subjectId: subject.id,
      batchId: batch.id,
      facultyId: freeFaculty[0].id,
      classroomId: classroom.id,
      timeSlot: slot,
      day: slot.day
    };
  }

  private findSuitableClassrooms(subject: Subject, batch: Batch): Classroom[] {
    return this.classrooms.filter(classroom => {
      // Check capacity
      if (classroom.capacity < batch.studentCount) return false;

      // Check type compatibility
      if (subject.type === 'practical' && classroom.type !== 'laboratory') return false;

      // Check equipment requirements
      if (subject.requiredEquipment) {
        const hasRequiredEquipment = subject.requiredEquipment.every(equipment => 
          classroom.equipment.includes(equipment)
        );
        if (!hasRequiredEquipment) return false;
      }

      return true;
    });
  }

  private isFacultyFreeAtSlot(faculty: Faculty, slot: TimeSlot, entries: TimetableEntry[]): boolean {
    return !entries.some(entry => 
      entry.facultyId === faculty.id && 
      entry.day === slot.day && 
      this.slotsOverlap(entry.timeSlot, slot)
    );
  }

  private isClassroomFreeAtSlot(classroom: Classroom, slot: TimeSlot, entries: TimetableEntry[]): boolean {
    return !entries.some(entry => 
      entry.classroomId === classroom.id && 
      entry.day === slot.day && 
      this.slotsOverlap(entry.timeSlot, slot)
    );
  }

  private slotsOverlap(slot1: TimeSlot, slot2: TimeSlot): boolean {
    const start1 = this.timeToMinutes(slot1.startTime);
    const end1 = this.timeToMinutes(slot1.endTime);
    const start2 = this.timeToMinutes(slot2.startTime);
    const end2 = this.timeToMinutes(slot2.endTime);

    return start1 < end2 && start2 < end1;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private getAvailableSlotsForFaculty(faculty: Faculty, entries: TimetableEntry[]): TimeSlot[] {
    return this.timeSlots.filter(slot => this.isFacultyFreeAtSlot(faculty, slot, entries));
  }

  private getAvailableSlotsForClassroom(classroom: Classroom, entries: TimetableEntry[]): TimeSlot[] {
    return this.timeSlots.filter(slot => this.isClassroomFreeAtSlot(classroom, slot, entries));
  }

  private calculateFacultyWorkload(entries: TimetableEntry[]): Record<string, number> {
    const workload: Record<string, number> = {};
    entries.forEach(entry => {
      workload[entry.facultyId] = (workload[entry.facultyId] || 0) + entry.timeSlot.duration;
    });
    return workload;
  }

  private calculateMetrics(entries: TimetableEntry[]) {
    const classroomUtilization = this.calculateClassroomUtilization(entries);
    const facultyWorkloadBalance = this.calculateFacultyWorkloadBalance(entries);
    const conflictCount = 0; // Will be set by conflict detection
    const preferenceMatch = this.calculatePreferenceMatch(entries);

    return {
      classroomUtilization,
      facultyWorkloadBalance,
      conflictCount,
      preferenceMatch
    };
  }

  private calculateClassroomUtilization(entries: TimetableEntry[]): number {
    const totalSlots = this.timeSlots.length * this.classrooms.length;
    const usedSlots = entries.length;
    return Math.round((usedSlots / totalSlots) * 100);
  }

  private calculateFacultyWorkloadBalance(entries: TimetableEntry[]): number {
    const workloads = this.calculateFacultyWorkload(entries);
    const values = Object.values(workloads);
    
    if (values.length === 0) return 100;
    
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Convert to a 0-100 scale where 100 is perfectly balanced
    return Math.max(0, Math.round(100 - standardDeviation));
  }

  private calculatePreferenceMatch(entries: TimetableEntry[]): number {
    let totalMatches = 0;
    let totalPreferences = 0;

    entries.forEach(entry => {
      const faculty = this.faculty.find(f => f.id === entry.facultyId);
      if (faculty?.preferredTimeSlots) {
        totalPreferences++;
        if (faculty.preferredTimeSlots.includes(entry.timeSlot.id)) {
          totalMatches++;
        }
      }
    });

    return totalPreferences > 0 ? Math.round((totalMatches / totalPreferences) * 100) : 100;
  }

  private calculateScore(metrics: any, conflicts: Conflict[]): number {
    const weights = {
      classroomUtilization: 0.25,
      facultyWorkloadBalance: 0.35,
      preferenceMatch: 0.20,
      conflictPenalty: 0.20
    };

    let conflictPenalty = 0;
    conflicts.forEach(conflict => {
      switch (conflict.severity) {
        case 'high': conflictPenalty += 30; break;
        case 'medium': conflictPenalty += 20; break;
        case 'low': conflictPenalty += 10; break;
      }
    });

    const score = (
      metrics.classroomUtilization * weights.classroomUtilization +
      metrics.facultyWorkloadBalance * weights.facultyWorkloadBalance +
      metrics.preferenceMatch * weights.preferenceMatch -
      conflictPenalty * weights.conflictPenalty
    );

    return Math.max(0, Math.round(score));
  }

  private generateSuggestions(conflicts: Conflict[], entries: TimetableEntry[]): string[] {
    const suggestions: string[] = [];

    if (conflicts.some(c => c.type === 'classroom')) {
      suggestions.push('Consider adding more classrooms or extending operating hours');
    }

    if (conflicts.some(c => c.type === 'faculty')) {
      suggestions.push('Review faculty assignments and consider hiring additional staff');
    }

    const utilizationMetric = this.calculateClassroomUtilization(entries);
    if (utilizationMetric < 60) {
      suggestions.push('Classroom utilization can be improved by better time slot allocation');
    }

    return suggestions;
  }
}