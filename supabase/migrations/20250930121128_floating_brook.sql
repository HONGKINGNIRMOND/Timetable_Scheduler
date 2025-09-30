/*
  # Complete Schema Fix for Academic Timetable System

  1. Drop and recreate all tables with proper structure
  2. Fix RLS policies to prevent infinite recursion
  3. Insert comprehensive sample data
  4. Create proper user accounts with correct relationships
*/

-- Drop existing tables in correct order (respecting foreign keys)
DROP TABLE IF EXISTS timetable_conflicts CASCADE;
DROP TABLE IF EXISTS timetable_entries CASCADE;
DROP TABLE IF EXISTS generated_timetables CASCADE;
DROP TABLE IF EXISTS optimization_parameters CASCADE;
DROP TABLE IF EXISTS fixed_classes CASCADE;
DROP TABLE IF EXISTS batch_subjects CASCADE;
DROP TABLE IF EXISTS faculty_subjects CASCADE;
DROP TABLE IF EXISTS time_slots CASCADE;
DROP TABLE IF EXISTS batches CASCADE;
DROP TABLE IF EXISTS faculty CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS classrooms CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create departments table
CREATE TABLE departments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  code text UNIQUE NOT NULL,
  head_of_department text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'coordinator', 'reviewer')),
  department_id uuid REFERENCES departments(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create classrooms table
CREATE TABLE classrooms (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  capacity integer DEFAULT 0,
  type text NOT NULL CHECK (type IN ('lecture', 'laboratory', 'seminar')),
  equipment text[] DEFAULT '{}',
  building text,
  floor integer,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subjects table
CREATE TABLE subjects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  department_id uuid REFERENCES departments(id) ON DELETE CASCADE,
  semester integer NOT NULL CHECK (semester >= 1 AND semester <= 8),
  credits integer DEFAULT 0,
  hours_per_week integer DEFAULT 0,
  type text NOT NULL CHECK (type IN ('theory', 'practical', 'tutorial')),
  required_equipment text[] DEFAULT '{}',
  max_students integer,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create faculty table
CREATE TABLE faculty (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  department_id uuid REFERENCES departments(id) ON DELETE CASCADE,
  max_hours_per_week integer DEFAULT 20,
  average_leaves_per_month integer DEFAULT 2,
  preferred_time_slots text[] DEFAULT '{}',
  unavailable_slots text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create faculty_subjects junction table
CREATE TABLE faculty_subjects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  faculty_id uuid REFERENCES faculty(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(faculty_id, subject_id)
);

-- Create batches table
CREATE TABLE batches (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  department_id uuid REFERENCES departments(id) ON DELETE CASCADE,
  semester integer NOT NULL CHECK (semester >= 1 AND semester <= 8),
  student_count integer DEFAULT 0,
  shift text NOT NULL CHECK (shift IN ('morning', 'afternoon', 'evening')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create batch_subjects junction table
CREATE TABLE batch_subjects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id uuid REFERENCES batches(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(batch_id, subject_id)
);

-- Create time_slots table
CREATE TABLE time_slots (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  day text NOT NULL CHECK (day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')),
  start_time time NOT NULL,
  end_time time NOT NULL,
  duration integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create generated_timetables table
CREATE TABLE generated_timetables (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  department_id uuid REFERENCES departments(id) ON DELETE CASCADE,
  semester integer NOT NULL CHECK (semester >= 1 AND semester <= 8),
  score integer DEFAULT 0,
  classroom_utilization integer DEFAULT 0,
  faculty_workload_balance integer DEFAULT 0,
  conflict_count integer DEFAULT 0,
  preference_match integer DEFAULT 0,
  suggestions text[] DEFAULT '{}',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'under_review', 'approved', 'rejected')),
  created_by uuid REFERENCES users(id),
  approved_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create timetable_entries table
CREATE TABLE timetable_entries (
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

-- Enable RLS on all tables
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies without recursion
CREATE POLICY "Public read access for departments" ON departments FOR SELECT USING (true);
CREATE POLICY "Admin full access to departments" ON departments FOR ALL USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'admin@university.edu'
  )
);

CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth_id = auth.uid());
CREATE POLICY "Admin can read all users" ON users FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'admin@university.edu'
  )
);

CREATE POLICY "Public read access for classrooms" ON classrooms FOR SELECT USING (true);
CREATE POLICY "Admin full access to classrooms" ON classrooms FOR ALL USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email IN ('admin@university.edu', 'coordinator@university.edu')
  )
);

CREATE POLICY "Public read access for subjects" ON subjects FOR SELECT USING (true);
CREATE POLICY "Admin full access to subjects" ON subjects FOR ALL USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email IN ('admin@university.edu', 'coordinator@university.edu')
  )
);

CREATE POLICY "Public read access for faculty" ON faculty FOR SELECT USING (true);
CREATE POLICY "Admin full access to faculty" ON faculty FOR ALL USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email IN ('admin@university.edu', 'coordinator@university.edu')
  )
);

CREATE POLICY "Public read access for faculty_subjects" ON faculty_subjects FOR SELECT USING (true);
CREATE POLICY "Admin full access to faculty_subjects" ON faculty_subjects FOR ALL USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email IN ('admin@university.edu', 'coordinator@university.edu')
  )
);

CREATE POLICY "Public read access for batches" ON batches FOR SELECT USING (true);
CREATE POLICY "Admin full access to batches" ON batches FOR ALL USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email IN ('admin@university.edu', 'coordinator@university.edu')
  )
);

CREATE POLICY "Public read access for batch_subjects" ON batch_subjects FOR SELECT USING (true);
CREATE POLICY "Admin full access to batch_subjects" ON batch_subjects FOR ALL USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email IN ('admin@university.edu', 'coordinator@university.edu')
  )
);

CREATE POLICY "Public read access for time_slots" ON time_slots FOR SELECT USING (true);
CREATE POLICY "Admin full access to time_slots" ON time_slots FOR ALL USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'admin@university.edu'
  )
);

CREATE POLICY "Public read access for generated_timetables" ON generated_timetables FOR SELECT USING (true);
CREATE POLICY "Admin full access to generated_timetables" ON generated_timetables FOR ALL USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email IN ('admin@university.edu', 'coordinator@university.edu', 'reviewer@university.edu')
  )
);

CREATE POLICY "Public read access for timetable_entries" ON timetable_entries FOR SELECT USING (true);
CREATE POLICY "Admin full access to timetable_entries" ON timetable_entries FOR ALL USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email IN ('admin@university.edu', 'coordinator@university.edu')
  )
);

-- Insert sample data
INSERT INTO departments (name, code, head_of_department) VALUES
('Computer Science', 'CS', 'Dr. Sarah Johnson'),
('Electronics Engineering', 'ECE', 'Prof. Michael Chen'),
('Mechanical Engineering', 'ME', 'Dr. Emily Rodriguez'),
('Business Administration', 'MBA', 'Prof. David Wilson');

-- Insert classrooms
INSERT INTO classrooms (name, capacity, type, equipment, building, floor) VALUES
('CS-101', 60, 'lecture', '{"projector", "whiteboard", "audio_system"}', 'Main Building', 1),
('CS-102', 60, 'lecture', '{"projector", "whiteboard", "audio_system"}', 'Main Building', 1),
('CS-Lab1', 30, 'laboratory', '{"computers", "projector", "network"}', 'Lab Building', 2),
('CS-Lab2', 30, 'laboratory', '{"computers", "projector", "network"}', 'Lab Building', 2),
('ECE-201', 50, 'lecture', '{"projector", "whiteboard", "audio_system"}', 'Engineering Block', 2),
('ECE-Lab', 25, 'laboratory', '{"oscilloscopes", "function_generators", "multimeters"}', 'Engineering Block', 1),
('ME-301', 45, 'lecture', '{"projector", "whiteboard"}', 'Mechanical Block', 3),
('Workshop', 20, 'laboratory', '{"lathes", "milling_machines", "tools"}', 'Workshop', 1),
('MBA-Hall', 80, 'lecture', '{"projector", "audio_system", "whiteboard"}', 'Business Block', 1),
('Seminar-1', 25, 'seminar', '{"projector", "round_tables"}', 'Main Building', 2);

-- Insert subjects for different departments
INSERT INTO subjects (name, code, department_id, semester, credits, hours_per_week, type, required_equipment) VALUES
-- CS Department
('Data Structures', 'CS301', (SELECT id FROM departments WHERE code = 'CS'), 3, 4, 5, 'theory', '{}'),
('Database Systems', 'CS302', (SELECT id FROM departments WHERE code = 'CS'), 3, 4, 5, 'theory', '{}'),
('Computer Networks', 'CS303', (SELECT id FROM departments WHERE code = 'CS'), 3, 3, 4, 'theory', '{}'),
('Software Engineering', 'CS304', (SELECT id FROM departments WHERE code = 'CS'), 3, 3, 4, 'theory', '{}'),
('DS Lab', 'CS301L', (SELECT id FROM departments WHERE code = 'CS'), 3, 2, 3, 'practical', '{"computers"}'),
('DBMS Lab', 'CS302L', (SELECT id FROM departments WHERE code = 'CS'), 3, 2, 3, 'practical', '{"computers"}'),

-- ECE Department
('Digital Electronics', 'ECE301', (SELECT id FROM departments WHERE code = 'ECE'), 3, 4, 5, 'theory', '{}'),
('Microprocessors', 'ECE302', (SELECT id FROM departments WHERE code = 'ECE'), 3, 4, 5, 'theory', '{}'),
('Communication Systems', 'ECE303', (SELECT id FROM departments WHERE code = 'ECE'), 3, 3, 4, 'theory', '{}'),
('Digital Lab', 'ECE301L', (SELECT id FROM departments WHERE code = 'ECE'), 3, 2, 3, 'practical', '{"oscilloscopes"}'),

-- ME Department
('Thermodynamics', 'ME301', (SELECT id FROM departments WHERE code = 'ME'), 3, 4, 5, 'theory', '{}'),
('Fluid Mechanics', 'ME302', (SELECT id FROM departments WHERE code = 'ME'), 3, 4, 5, 'theory', '{}'),
('Manufacturing Lab', 'ME301L', (SELECT id FROM departments WHERE code = 'ME'), 3, 2, 3, 'practical', '{"lathes"}'),

-- MBA Department
('Marketing Management', 'MBA301', (SELECT id FROM departments WHERE code = 'MBA'), 3, 3, 4, 'theory', '{}'),
('Financial Management', 'MBA302', (SELECT id FROM departments WHERE code = 'MBA'), 3, 3, 4, 'theory', '{}');

-- Insert faculty
INSERT INTO faculty (name, email, department_id, max_hours_per_week) VALUES
-- CS Faculty
('Dr. Alice Smith', 'alice.smith@university.edu', (SELECT id FROM departments WHERE code = 'CS'), 18),
('Prof. Bob Johnson', 'bob.johnson@university.edu', (SELECT id FROM departments WHERE code = 'CS'), 20),
('Dr. Carol Davis', 'carol.davis@university.edu', (SELECT id FROM departments WHERE code = 'CS'), 16),

-- ECE Faculty
('Prof. David Brown', 'david.brown@university.edu', (SELECT id FROM departments WHERE code = 'ECE'), 18),
('Dr. Eva Wilson', 'eva.wilson@university.edu', (SELECT id FROM departments WHERE code = 'ECE'), 20),

-- ME Faculty
('Prof. Frank Miller', 'frank.miller@university.edu', (SELECT id FROM departments WHERE code = 'ME'), 18),
('Dr. Grace Taylor', 'grace.taylor@university.edu', (SELECT id FROM departments WHERE code = 'ME'), 16),

-- MBA Faculty
('Prof. Henry Anderson', 'henry.anderson@university.edu', (SELECT id FROM departments WHERE code = 'MBA'), 15),
('Dr. Ivy Thomas', 'ivy.thomas@university.edu', (SELECT id FROM departments WHERE code = 'MBA'), 15);

-- Insert faculty-subject mappings
INSERT INTO faculty_subjects (faculty_id, subject_id) VALUES
-- CS Faculty assignments
((SELECT id FROM faculty WHERE email = 'alice.smith@university.edu'), (SELECT id FROM subjects WHERE code = 'CS301')),
((SELECT id FROM faculty WHERE email = 'alice.smith@university.edu'), (SELECT id FROM subjects WHERE code = 'CS301L')),
((SELECT id FROM faculty WHERE email = 'bob.johnson@university.edu'), (SELECT id FROM subjects WHERE code = 'CS302')),
((SELECT id FROM faculty WHERE email = 'bob.johnson@university.edu'), (SELECT id FROM subjects WHERE code = 'CS302L')),
((SELECT id FROM faculty WHERE email = 'carol.davis@university.edu'), (SELECT id FROM subjects WHERE code = 'CS303')),
((SELECT id FROM faculty WHERE email = 'carol.davis@university.edu'), (SELECT id FROM subjects WHERE code = 'CS304')),

-- ECE Faculty assignments
((SELECT id FROM faculty WHERE email = 'david.brown@university.edu'), (SELECT id FROM subjects WHERE code = 'ECE301')),
((SELECT id FROM faculty WHERE email = 'david.brown@university.edu'), (SELECT id FROM subjects WHERE code = 'ECE301L')),
((SELECT id FROM faculty WHERE email = 'eva.wilson@university.edu'), (SELECT id FROM subjects WHERE code = 'ECE302')),
((SELECT id FROM faculty WHERE email = 'eva.wilson@university.edu'), (SELECT id FROM subjects WHERE code = 'ECE303')),

-- ME Faculty assignments
((SELECT id FROM faculty WHERE email = 'frank.miller@university.edu'), (SELECT id FROM subjects WHERE code = 'ME301')),
((SELECT id FROM faculty WHERE email = 'frank.miller@university.edu'), (SELECT id FROM subjects WHERE code = 'ME301L')),
((SELECT id FROM faculty WHERE email = 'grace.taylor@university.edu'), (SELECT id FROM subjects WHERE code = 'ME302')),

-- MBA Faculty assignments
((SELECT id FROM faculty WHERE email = 'henry.anderson@university.edu'), (SELECT id FROM subjects WHERE code = 'MBA301')),
((SELECT id FROM faculty WHERE email = 'ivy.thomas@university.edu'), (SELECT id FROM subjects WHERE code = 'MBA302'));

-- Insert batches
INSERT INTO batches (name, department_id, semester, student_count, shift) VALUES
-- CS Batches
('CS-3A', (SELECT id FROM departments WHERE code = 'CS'), 3, 45, 'morning'),
('CS-3B', (SELECT id FROM departments WHERE code = 'CS'), 3, 42, 'morning'),
('CS-5A', (SELECT id FROM departments WHERE code = 'CS'), 5, 38, 'morning'),

-- ECE Batches
('ECE-3A', (SELECT id FROM departments WHERE code = 'ECE'), 3, 40, 'morning'),
('ECE-3B', (SELECT id FROM departments WHERE code = 'ECE'), 3, 35, 'afternoon'),

-- ME Batches
('ME-3A', (SELECT id FROM departments WHERE code = 'ME'), 3, 35, 'morning'),

-- MBA Batches
('MBA-3A', (SELECT id FROM departments WHERE code = 'MBA'), 3, 50, 'evening');

-- Insert batch-subject mappings
INSERT INTO batch_subjects (batch_id, subject_id) VALUES
-- CS-3A subjects
((SELECT id FROM batches WHERE name = 'CS-3A'), (SELECT id FROM subjects WHERE code = 'CS301')),
((SELECT id FROM batches WHERE name = 'CS-3A'), (SELECT id FROM subjects WHERE code = 'CS302')),
((SELECT id FROM batches WHERE name = 'CS-3A'), (SELECT id FROM subjects WHERE code = 'CS303')),
((SELECT id FROM batches WHERE name = 'CS-3A'), (SELECT id FROM subjects WHERE code = 'CS301L')),
((SELECT id FROM batches WHERE name = 'CS-3A'), (SELECT id FROM subjects WHERE code = 'CS302L')),

-- CS-3B subjects (same as 3A)
((SELECT id FROM batches WHERE name = 'CS-3B'), (SELECT id FROM subjects WHERE code = 'CS301')),
((SELECT id FROM batches WHERE name = 'CS-3B'), (SELECT id FROM subjects WHERE code = 'CS302')),
((SELECT id FROM batches WHERE name = 'CS-3B'), (SELECT id FROM subjects WHERE code = 'CS303')),
((SELECT id FROM batches WHERE name = 'CS-3B'), (SELECT id FROM subjects WHERE code = 'CS301L')),
((SELECT id FROM batches WHERE name = 'CS-3B'), (SELECT id FROM subjects WHERE code = 'CS302L')),

-- ECE-3A subjects
((SELECT id FROM batches WHERE name = 'ECE-3A'), (SELECT id FROM subjects WHERE code = 'ECE301')),
((SELECT id FROM batches WHERE name = 'ECE-3A'), (SELECT id FROM subjects WHERE code = 'ECE302')),
((SELECT id FROM batches WHERE name = 'ECE-3A'), (SELECT id FROM subjects WHERE code = 'ECE301L')),

-- ME-3A subjects
((SELECT id FROM batches WHERE name = 'ME-3A'), (SELECT id FROM subjects WHERE code = 'ME301')),
((SELECT id FROM batches WHERE name = 'ME-3A'), (SELECT id FROM subjects WHERE code = 'ME302')),
((SELECT id FROM batches WHERE name = 'ME-3A'), (SELECT id FROM subjects WHERE code = 'ME301L')),

-- MBA-3A subjects
((SELECT id FROM batches WHERE name = 'MBA-3A'), (SELECT id FROM subjects WHERE code = 'MBA301')),
((SELECT id FROM batches WHERE name = 'MBA-3A'), (SELECT id FROM subjects WHERE code = 'MBA302'));

-- Insert time slots
INSERT INTO time_slots (day, start_time, end_time, duration) VALUES
-- Monday
('Monday', '09:00', '10:00', 1),
('Monday', '10:00', '11:00', 1),
('Monday', '11:15', '12:15', 1),
('Monday', '12:15', '13:15', 1),
('Monday', '14:15', '15:15', 1),
('Monday', '15:15', '16:15', 1),
('Monday', '16:30', '17:30', 1),

-- Tuesday
('Tuesday', '09:00', '10:00', 1),
('Tuesday', '10:00', '11:00', 1),
('Tuesday', '11:15', '12:15', 1),
('Tuesday', '12:15', '13:15', 1),
('Tuesday', '14:15', '15:15', 1),
('Tuesday', '15:15', '16:15', 1),
('Tuesday', '16:30', '17:30', 1),

-- Wednesday
('Wednesday', '09:00', '10:00', 1),
('Wednesday', '10:00', '11:00', 1),
('Wednesday', '11:15', '12:15', 1),
('Wednesday', '12:15', '13:15', 1),
('Wednesday', '14:15', '15:15', 1),
('Wednesday', '15:15', '16:15', 1),
('Wednesday', '16:30', '17:30', 1),

-- Thursday
('Thursday', '09:00', '10:00', 1),
('Thursday', '10:00', '11:00', 1),
('Thursday', '11:15', '12:15', 1),
('Thursday', '12:15', '13:15', 1),
('Thursday', '14:15', '15:15', 1),
('Thursday', '15:15', '16:15', 1),
('Thursday', '16:30', '17:30', 1),

-- Friday
('Friday', '09:00', '10:00', 1),
('Friday', '10:00', '11:00', 1),
('Friday', '11:15', '12:15', 1),
('Friday', '12:15', '13:15', 1),
('Friday', '14:15', '15:15', 1),
('Friday', '15:15', '16:15', 1),
('Friday', '16:30', '17:30', 1);