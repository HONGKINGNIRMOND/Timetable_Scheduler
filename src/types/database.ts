export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          auth_id: string | null;
          name: string;
          email: string;
          role: 'admin' | 'coordinator' | 'reviewer';
          department_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_id?: string | null;
          name: string;
          email: string;
          role: 'admin' | 'coordinator' | 'reviewer';
          department_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          auth_id?: string | null;
          name?: string;
          email?: string;
          role?: 'admin' | 'coordinator' | 'reviewer';
          department_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      departments: {
        Row: {
          id: string;
          name: string;
          code: string;
          head_of_department: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          head_of_department?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          head_of_department?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      classrooms: {
        Row: {
          id: string;
          name: string;
          capacity: number;
          type: 'lecture' | 'laboratory' | 'seminar';
          equipment: string[];
          building: string | null;
          floor: number | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          capacity?: number;
          type: 'lecture' | 'laboratory' | 'seminar';
          equipment?: string[];
          building?: string | null;
          floor?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          capacity?: number;
          type?: 'lecture' | 'laboratory' | 'seminar';
          equipment?: string[];
          building?: string | null;
          floor?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      subjects: {
        Row: {
          id: string;
          name: string;
          code: string;
          department_id: string;
          semester: number;
          credits: number;
          hours_per_week: number;
          type: 'theory' | 'practical' | 'tutorial';
          required_equipment: string[] | null;
          max_students: number | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          department_id: string;
          semester: number;
          credits?: number;
          hours_per_week?: number;
          type: 'theory' | 'practical' | 'tutorial';
          required_equipment?: string[] | null;
          max_students?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          department_id?: string;
          semester?: number;
          credits?: number;
          hours_per_week?: number;
          type?: 'theory' | 'practical' | 'tutorial';
          required_equipment?: string[] | null;
          max_students?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      faculty: {
        Row: {
          id: string;
          name: string;
          email: string;
          department_id: string;
          max_hours_per_week: number;
          average_leaves_per_month: number;
          preferred_time_slots: string[];
          unavailable_slots: string[];
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          department_id: string;
          max_hours_per_week?: number;
          average_leaves_per_month?: number;
          preferred_time_slots?: string[];
          unavailable_slots?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          department_id?: string;
          max_hours_per_week?: number;
          average_leaves_per_month?: number;
          preferred_time_slots?: string[];
          unavailable_slots?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      faculty_subjects: {
        Row: {
          id: string;
          faculty_id: string;
          subject_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          faculty_id: string;
          subject_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          faculty_id?: string;
          subject_id?: string;
          created_at?: string;
        };
      };
      batches: {
        Row: {
          id: string;
          name: string;
          department_id: string;
          semester: number;
          student_count: number;
          shift: 'morning' | 'afternoon' | 'evening';
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          department_id: string;
          semester: number;
          student_count?: number;
          shift: 'morning' | 'afternoon' | 'evening';
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          department_id?: string;
          semester?: number;
          student_count?: number;
          shift?: 'morning' | 'afternoon' | 'evening';
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      batch_subjects: {
        Row: {
          id: string;
          batch_id: string;
          subject_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          batch_id: string;
          subject_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          batch_id?: string;
          subject_id?: string;
          created_at?: string;
        };
      };
      time_slots: {
        Row: {
          id: string;
          day: string;
          start_time: string;
          end_time: string;
          duration: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          day: string;
          start_time: string;
          end_time: string;
          duration?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          day?: string;
          start_time?: string;
          end_time?: string;
          duration?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      fixed_classes: {
        Row: {
          id: string;
          subject_id: string;
          batch_id: string;
          faculty_id: string;
          classroom_id: string;
          time_slot_id: string;
          is_recurring: boolean;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          subject_id: string;
          batch_id: string;
          faculty_id: string;
          classroom_id: string;
          time_slot_id: string;
          is_recurring?: boolean;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          subject_id?: string;
          batch_id?: string;
          faculty_id?: string;
          classroom_id?: string;
          time_slot_id?: string;
          is_recurring?: boolean;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      generated_timetables: {
        Row: {
          id: string;
          name: string;
          department_id: string;
          semester: number;
          score: number;
          classroom_utilization: number;
          faculty_workload_balance: number;
          conflict_count: number;
          preference_match: number;
          suggestions: string[];
          status: 'draft' | 'under_review' | 'approved' | 'rejected';
          created_by: string | null;
          approved_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          department_id: string;
          semester: number;
          score?: number;
          classroom_utilization?: number;
          faculty_workload_balance?: number;
          conflict_count?: number;
          preference_match?: number;
          suggestions?: string[];
          status?: 'draft' | 'under_review' | 'approved' | 'rejected';
          created_by?: string | null;
          approved_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          department_id?: string;
          semester?: number;
          score?: number;
          classroom_utilization?: number;
          faculty_workload_balance?: number;
          conflict_count?: number;
          preference_match?: number;
          suggestions?: string[];
          status?: 'draft' | 'under_review' | 'approved' | 'rejected';
          created_by?: string | null;
          approved_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      timetable_entries: {
        Row: {
          id: string;
          timetable_id: string;
          subject_id: string;
          batch_id: string;
          faculty_id: string;
          classroom_id: string;
          time_slot_id: string;
          day: string;
          week_number: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          timetable_id: string;
          subject_id: string;
          batch_id: string;
          faculty_id: string;
          classroom_id: string;
          time_slot_id: string;
          day: string;
          week_number?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          timetable_id?: string;
          subject_id?: string;
          batch_id?: string;
          faculty_id?: string;
          classroom_id?: string;
          time_slot_id?: string;
          day?: string;
          week_number?: number | null;
          created_at?: string;
        };
      };
      timetable_conflicts: {
        Row: {
          id: string;
          timetable_id: string;
          type: 'classroom' | 'faculty' | 'batch' | 'equipment';
          description: string;
          severity: 'low' | 'medium' | 'high';
          suggestions: string[];
          affected_entries: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          timetable_id: string;
          type: 'classroom' | 'faculty' | 'batch' | 'equipment';
          description: string;
          severity: 'low' | 'medium' | 'high';
          suggestions?: string[];
          affected_entries?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          timetable_id?: string;
          type?: 'classroom' | 'faculty' | 'batch' | 'equipment';
          description?: string;
          severity?: 'low' | 'medium' | 'high';
          suggestions?: string[];
          affected_entries?: string[];
          created_at?: string;
        };
      };
      optimization_parameters: {
        Row: {
          id: string;
          name: string;
          max_classes_per_day: number;
          preferred_start_time: string;
          preferred_end_time: string;
          lunch_break_duration: number;
          min_break_between_classes: number;
          allow_back_to_back_classes: boolean;
          prioritize_lab_equipment: boolean;
          balance_faculty_workload: boolean;
          minimize_gaps_between_classes: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          max_classes_per_day?: number;
          preferred_start_time?: string;
          preferred_end_time?: string;
          lunch_break_duration?: number;
          min_break_between_classes?: number;
          allow_back_to_back_classes?: boolean;
          prioritize_lab_equipment?: boolean;
          balance_faculty_workload?: boolean;
          minimize_gaps_between_classes?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          max_classes_per_day?: number;
          preferred_start_time?: string;
          preferred_end_time?: string;
          lunch_break_duration?: number;
          min_break_between_classes?: number;
          allow_back_to_back_classes?: boolean;
          prioritize_lab_equipment?: boolean;
          balance_faculty_workload?: boolean;
          minimize_gaps_between_classes?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}