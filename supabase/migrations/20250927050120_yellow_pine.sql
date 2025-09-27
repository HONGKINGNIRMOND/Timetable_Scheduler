/*
  # Academic Timetable Platform Database Schema

  1. New Tables
    - `users` - System users (admin, coordinator, reviewer)
    - `departments` - Academic departments
    - `classrooms` - Available classrooms with capacity and equipment
    - `subjects` - Academic subjects with requirements
    - `faculty` - Faculty members with preferences and constraints
    - `batches` - Student batches/groups
    - `time_slots` - Available time periods
    - `fixed_classes` - Pre-scheduled fixed classes
    - `timetable_entries` - Individual timetable entries
    - `generated_timetables` - Complete generated timetables
    - `timetable_conflicts` - Detected conflicts in timetables
    - `optimization_parameters` - Saved optimization settings

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Secure data access based on user roles and departments

  3. Relationships
    - Foreign key constraints between related tables
    - Proper indexing for performance
    - Default values for consistency
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'coordinator', 'reviewer')),
  department_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  code text NOT NULL UNIQUE,
  head_of_department text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Classrooms table
CREATE TABLE IF NOT EXISTS classrooms (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  capacity integer NOT NULL DEFAULT 0,
  type text NOT NULL CHECK (type IN ('lecture', 'laboratory', 'seminar')),
  equipment text[] DEFAULT '{}',
  building text,
  floor integer,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  department_id uuid REFERENCES departments(id) ON DELETE CASCADE,
  semester integer NOT NULL CHECK (semester >= 1 AND semester <= 8),
  credits integer NOT NULL DEFAULT 0,
  hours_per_week integer NOT NULL DEFAULT 0,
  type text NOT NULL CHECK (type IN ('theory', 'practical', 'tutorial')),
  required_equipment text[] DEFAULT '{}',
  max_students integer,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Faculty table
CREATE TABLE IF NOT EXISTS faculty (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  department_id uuid REFERENCES departments(id) ON DELETE CASCADE,
  max_hours_per_week integer NOT NULL DEFAULT 20,
  average_leaves_per_month integer DEFAULT 2,
  preferred_time_slots text[] DEFAULT '{}',
  unavailable_slots text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Faculty-Subject mapping table
CREATE TABLE IF NOT EXISTS faculty_subjects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  faculty_id uuid REFERENCES faculty(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(faculty_id, subject_id)
);

-- Batches table
CREATE TABLE IF NOT EXISTS batches (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  department_id uuid REFERENCES departments(id) ON DELETE CASCADE,
  semester integer NOT NULL CHECK (semester >= 1 AND semester <= 8),
  student_count integer NOT NULL DEFAULT 0,
  shift text NOT NULL CHECK (shift IN ('morning', 'afternoon', 'evening')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Batch-Subject mapping table
CREATE TABLE IF NOT EXISTS batch_subjects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id uuid REFERENCES batches(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(batch_id, subject_id)
);

-- Time slots table
CREATE TABLE IF NOT EXISTS time_slots (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  day text NOT NULL CHECK (day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')),
  start_time time NOT NULL,
  end_time time NOT NULL,
  duration integer NOT NULL DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Fixed classes table
CREATE TABLE IF NOT EXISTS fixed_classes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  batch_id uuid REFERENCES batches(id) ON DELETE CASCADE,
  faculty_id uuid REFERENCES faculty(id) ON DELETE CASCADE,
  classroom_id uuid REFERENCES classrooms(id) ON DELETE CASCADE,
  time_slot_id uuid REFERENCES time_slots(id) ON DELETE CASCADE,
  is_recurring boolean DEFAULT true,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Generated timetables table
CREATE TABLE IF NOT EXISTS generated_timetables (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  department_id uuid REFERENCES departments(id) ON DELETE CASCADE,
  semester integer NOT NULL CHECK (semester >= 1 AND semester <= 8),
  score integer NOT NULL DEFAULT 0,
  classroom_utilization integer DEFAULT 0,
  faculty_workload_balance integer DEFAULT 0,
  conflict_count integer DEFAULT 0,
  preference_match integer DEFAULT 0,
  suggestions text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'under_review', 'approved', 'rejected')),
  created_by uuid REFERENCES users(id),
  approved_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Timetable entries table
CREATE TABLE IF NOT EXISTS timetable_entries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  timetable_id uuid REFERENCES generated_timetables(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  batch_id uuid REFERENCES batches(id) ON DELETE CASCADE,
  faculty_id uuid REFERENCES faculty(id) ON DELETE CASCADE,
  classroom_id uuid REFERENCES classrooms(id) ON DELETE CASCADE,
  time_slot_id uuid REFERENCES time_slots(id) ON DELETE CASCADE,
  day text NOT NULL CHECK (day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')),
  week_number integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Timetable conflicts table
CREATE TABLE IF NOT EXISTS timetable_conflicts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  timetable_id uuid REFERENCES generated_timetables(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('classroom', 'faculty', 'batch', 'equipment')),
  description text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  suggestions text[] DEFAULT '{}',
  affected_entries uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Optimization parameters table
CREATE TABLE IF NOT EXISTS optimization_parameters (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  max_classes_per_day integer DEFAULT 6,
  preferred_start_time time DEFAULT '09:00',
  preferred_end_time time DEFAULT '17:00',
  lunch_break_duration integer DEFAULT 60,
  min_break_between_classes integer DEFAULT 15,
  allow_back_to_back_classes boolean DEFAULT true,
  prioritize_lab_equipment boolean DEFAULT true,
  balance_faculty_workload boolean DEFAULT true,
  minimize_gaps_between_classes boolean DEFAULT true,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add foreign key constraint for users department
ALTER TABLE users ADD CONSTRAINT fk_users_department 
  FOREIGN KEY (department_id) REFERENCES departments(id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON users(auth_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_subjects_department ON subjects(department_id);
CREATE INDEX IF NOT EXISTS idx_subjects_semester ON subjects(semester);
CREATE INDEX IF NOT EXISTS idx_faculty_department ON faculty(department_id);
CREATE INDEX IF NOT EXISTS idx_batches_department ON batches(department_id);
CREATE INDEX IF NOT EXISTS idx_batches_semester ON batches(semester);
CREATE INDEX IF NOT EXISTS idx_timetable_entries_timetable ON timetable_entries(timetable_id);
CREATE INDEX IF NOT EXISTS idx_timetable_entries_day ON timetable_entries(day);
CREATE INDEX IF NOT EXISTS idx_generated_timetables_status ON generated_timetables(status);
CREATE INDEX IF NOT EXISTS idx_generated_timetables_department ON generated_timetables(department_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE fixed_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE optimization_parameters ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = auth_id);

CREATE POLICY "Admins can read all users" ON users
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.auth_id = auth.uid() AND u.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert users" ON users
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.auth_id = auth.uid() AND u.role = 'admin'
    )
  );

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = auth_id);

-- Departments policies
CREATE POLICY "All authenticated users can read departments" ON departments
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can manage departments" ON departments
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.auth_id = auth.uid() AND u.role = 'admin'
    )
  );

-- Classrooms policies
CREATE POLICY "All authenticated users can read classrooms" ON classrooms
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins and coordinators can manage classrooms" ON classrooms
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.auth_id = auth.uid() AND u.role IN ('admin', 'coordinator')
    )
  );

-- Subjects policies
CREATE POLICY "Users can read subjects from their department" ON subjects
  FOR SELECT TO authenticated
  USING (
    department_id IN (
      SELECT department_id FROM users 
      WHERE auth_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.auth_id = auth.uid() AND u.role = 'admin'
    )
  );

CREATE POLICY "Coordinators and admins can manage subjects" ON subjects
  FOR ALL TO authenticated
  USING (
    (department_id IN (
      SELECT department_id FROM users 
      WHERE auth_id = auth.uid() AND role IN ('coordinator', 'admin')
    )) OR
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.auth_id = auth.uid() AND u.role = 'admin'
    )
  );

-- Faculty policies
CREATE POLICY "Users can read faculty from their department" ON faculty
  FOR SELECT TO authenticated
  USING (
    department_id IN (
      SELECT department_id FROM users 
      WHERE auth_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.auth_id = auth.uid() AND u.role = 'admin'
    )
  );

CREATE POLICY "Coordinators and admins can manage faculty" ON faculty
  FOR ALL TO authenticated
  USING (
    (department_id IN (
      SELECT department_id FROM users 
      WHERE auth_id = auth.uid() AND role IN ('coordinator', 'admin')
    )) OR
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.auth_id = auth.uid() AND u.role = 'admin'
    )
  );

-- Similar policies for other tables...
CREATE POLICY "Authenticated users can read faculty_subjects" ON faculty_subjects
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Coordinators and admins can manage faculty_subjects" ON faculty_subjects
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.auth_id = auth.uid() AND u.role IN ('admin', 'coordinator')
    )
  );

CREATE POLICY "Users can read batches from their department" ON batches
  FOR SELECT TO authenticated
  USING (
    department_id IN (
      SELECT department_id FROM users 
      WHERE auth_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.auth_id = auth.uid() AND u.role = 'admin'
    )
  );

CREATE POLICY "Coordinators and admins can manage batches" ON batches
  FOR ALL TO authenticated
  USING (
    (department_id IN (
      SELECT department_id FROM users 
      WHERE auth_id = auth.uid() AND role IN ('coordinator', 'admin')
    )) OR
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.auth_id = auth.uid() AND u.role = 'admin'
    )
  );

-- Time slots policies
CREATE POLICY "All authenticated users can read time_slots" ON time_slots
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can manage time_slots" ON time_slots
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.auth_id = auth.uid() AND u.role = 'admin'
    )
  );

-- Generated timetables policies
CREATE POLICY "Users can read timetables from their department" ON generated_timetables
  FOR SELECT TO authenticated
  USING (
    department_id IN (
      SELECT department_id FROM users 
      WHERE auth_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.auth_id = auth.uid() AND u.role = 'admin'
    )
  );

CREATE POLICY "Coordinators can create timetables" ON generated_timetables
  FOR INSERT TO authenticated
  WITH CHECK (
    department_id IN (
      SELECT department_id FROM users 
      WHERE auth_id = auth.uid() AND role IN ('coordinator', 'admin')
    ) OR
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.auth_id = auth.uid() AND u.role = 'admin'
    )
  );

CREATE POLICY "Creators can update their timetables" ON generated_timetables
  FOR UPDATE TO authenticated
  USING (
    created_by IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.auth_id = auth.uid() AND u.role = 'admin'
    )
  );

-- Timetable entries policies
CREATE POLICY "Users can read timetable entries" ON timetable_entries
  FOR SELECT TO authenticated
  USING (
    timetable_id IN (
      SELECT id FROM generated_timetables gt
      WHERE gt.department_id IN (
        SELECT department_id FROM users 
        WHERE auth_id = auth.uid()
      )
    ) OR
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.auth_id = auth.uid() AND u.role = 'admin'
    )
  );

CREATE POLICY "Coordinators can manage timetable entries" ON timetable_entries
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.auth_id = auth.uid() AND u.role IN ('admin', 'coordinator')
    )
  );

-- Default policies for remaining tables
CREATE POLICY "Authenticated users can read batch_subjects" ON batch_subjects
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Coordinators can manage batch_subjects" ON batch_subjects
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.auth_id = auth.uid() AND u.role IN ('admin', 'coordinator')
    )
  );

CREATE POLICY "Authenticated users can read fixed_classes" ON fixed_classes
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Coordinators can manage fixed_classes" ON fixed_classes
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.auth_id = auth.uid() AND u.role IN ('admin', 'coordinator')
    )
  );

CREATE POLICY "Authenticated users can read timetable_conflicts" ON timetable_conflicts
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "System can manage timetable_conflicts" ON timetable_conflicts
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read optimization_parameters" ON optimization_parameters
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Coordinators can manage optimization_parameters" ON optimization_parameters
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.auth_id = auth.uid() AND u.role IN ('admin', 'coordinator')
    )
  );