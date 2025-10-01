import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Provide fallback values for development
const defaultUrl = supabaseUrl || 'https://your-project.supabase.co';
const defaultKey = supabaseAnonKey || 'your-anon-key';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables not found. Please check your .env file.');
  console.warn('Required variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient<Database>(defaultUrl, defaultKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'academic-scheduler'
    }
  }
});

// Helper functions for common database operations
export const dbHelpers = {
  // Get current user profile
  async getCurrentUserProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // For demo purposes, return a simple profile
    return {
      id: user.id,
      name: user.email === 'admin@university.edu' ? 'Admin User' : 'Student User',
      email: user.email || '',
      role: user.email === 'admin@university.edu' ? 'admin' : 'student',
      auth_id: user.id,
      department_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      departments: {
        id: '1',
        name: 'Computer Science',
        code: 'CS'
      }
    };
  },

  // Get departments
  async getDepartments() {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  },

  // Get classrooms
  async getClassrooms() {
    const { data, error } = await supabase
      .from('classrooms')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data;
  },

  // Get subjects by department and semester
  async getSubjects(departmentId?: string, semester?: number) {
    let query = supabase
      .from('subjects')
      .select(`
        *,
        departments (
          id,
          name,
          code
        )
      `)
      .eq('is_active', true);

    if (departmentId) {
      query = query.eq('department_id', departmentId);
    }

    if (semester) {
      query = query.eq('semester', semester);
    }

    const { data, error } = await query.order('name');

    if (error) throw error;
    return data;
  },

  // Get faculty with their subjects
  async getFaculty(departmentId?: string) {
    let query = supabase
      .from('faculty')
      .select(`
        *,
        departments (
          id,
          name,
          code
        ),
        faculty_subjects (
          subjects (
            id,
            name,
            code
          )
        )
      `)
      .eq('is_active', true);

    if (departmentId) {
      query = query.eq('department_id', departmentId);
    }

    const { data, error } = await query.order('name');

    if (error) throw error;
    return data;
  },

  // Get batches with their subjects
  async getBatches(departmentId?: string, semester?: number) {
    let query = supabase
      .from('batches')
      .select(`
        *,
        departments (
          id,
          name,
          code
        ),
        batch_subjects (
          subjects (
            id,
            name,
            code,
            type,
            credits,
            hours_per_week
          )
        )
      `)
      .eq('is_active', true);

    if (departmentId) {
      query = query.eq('department_id', departmentId);
    }

    if (semester) {
      query = query.eq('semester', semester);
    }

    const { data, error } = await query.order('name');

    if (error) throw error;
    return data;
  },

  // Get time slots
  async getTimeSlots() {
    const { data, error } = await supabase
      .from('time_slots')
      .select('*')
      .eq('is_active', true)
      .order('day')
      .order('start_time');

    if (error) throw error;
    return data;
  },

  // Get generated timetables
  async getTimetables(departmentId?: string, status?: string) {
    let query = supabase
      .from('generated_timetables')
      .select(`
        *,
        departments (
          id,
          name,
          code
        )
      `);

    if (departmentId) {
      query = query.eq('department_id', departmentId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get timetable entries for a specific timetable
  async getTimetableEntries(timetableId: string) {
    const { data, error } = await supabase
      .from('timetable_entries')
      .select(`
        *,
        subjects (
          id,
          name,
          code,
          type
        ),
        batches (
          id,
          name
        ),
        faculty (
          id,
          name
        ),
        classrooms (
          id,
          name,
          building
        ),
        time_slots (
          id,
          day,
          start_time,
          end_time,
          duration
        )
      `)
      .eq('timetable_id', timetableId)
      .order('day')
      .order('time_slots.start_time');

    if (error) throw error;
    return data;
  },

  // Create a new timetable
  async createTimetable(timetableData: any) {
    const { data, error } = await supabase
      .from('generated_timetables')
      .insert(timetableData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update timetable status
  async updateTimetableStatus(timetableId: string, status: string, approvedBy?: string) {
    const updateData: any = { 
      status,
      updated_at: new Date().toISOString()
    };

    if (approvedBy) {
      updateData.approved_by = approvedBy;
    }

    const { data, error } = await supabase
      .from('generated_timetables')
      .update(updateData)
      .eq('id', timetableId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Insert timetable entries
  async insertTimetableEntries(entries: any[]) {
    const { data, error } = await supabase
      .from('timetable_entries')
      .insert(entries)
      .select();

    if (error) throw error;
    return data;
  },

  // Get optimization parameters
  async getOptimizationParameters() {
    const { data, error } = await supabase
      .from('optimization_parameters')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};