/*
  # Update User Roles to Admin and Student Only

  1. Changes
    - Update users table role constraint to only allow 'admin' and 'student'
    - Update RLS policies to work with new role structure
    - Keep existing sample data structure
*/

-- Update the role constraint to only allow admin and student
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role = ANY (ARRAY['admin'::text, 'student'::text]));

-- Update RLS policies for the new role structure
DROP POLICY IF EXISTS "Admin can read all users" ON users;
DROP POLICY IF EXISTS "Admin full access to departments" ON departments;
DROP POLICY IF EXISTS "Admin full access to classrooms" ON classrooms;
DROP POLICY IF EXISTS "Admin full access to subjects" ON subjects;
DROP POLICY IF EXISTS "Admin full access to faculty" ON faculty;
DROP POLICY IF EXISTS "Admin full access to faculty_subjects" ON faculty_subjects;
DROP POLICY IF EXISTS "Admin full access to batches" ON batches;
DROP POLICY IF EXISTS "Admin full access to batch_subjects" ON batch_subjects;
DROP POLICY IF EXISTS "Admin full access to generated_timetables" ON generated_timetables;
DROP POLICY IF EXISTS "Admin full access to timetable_entries" ON timetable_entries;

-- Create new policies for admin and student roles
CREATE POLICY "Admin can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'admin@university.edu'
    )
  );

CREATE POLICY "Admin full access to departments"
  ON departments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'admin@university.edu'
    )
  );

CREATE POLICY "Admin full access to classrooms"
  ON classrooms
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'admin@university.edu'
    )
  );

CREATE POLICY "Admin full access to subjects"
  ON subjects
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'admin@university.edu'
    )
  );

CREATE POLICY "Admin full access to faculty"
  ON faculty
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'admin@university.edu'
    )
  );

CREATE POLICY "Admin full access to faculty_subjects"
  ON faculty_subjects
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'admin@university.edu'
    )
  );

CREATE POLICY "Admin full access to batches"
  ON batches
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'admin@university.edu'
    )
  );

CREATE POLICY "Admin full access to batch_subjects"
  ON batch_subjects
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'admin@university.edu'
    )
  );

CREATE POLICY "Admin full access to generated_timetables"
  ON generated_timetables
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'admin@university.edu'
    )
  );

CREATE POLICY "Admin full access to timetable_entries"
  ON timetable_entries
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'admin@university.edu'
    )
  );