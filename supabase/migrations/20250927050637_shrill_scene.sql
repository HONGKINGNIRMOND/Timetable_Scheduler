/*
  # Create Demo User Accounts

  1. Demo Users
    - Admin user for full system access
    - Coordinator user for department-level access
    - Reviewer user for approval workflows

  2. Authentication
    - Creates auth users with email/password
    - Links to users table with proper roles
    - Assigns to Computer Science department

  Note: These are demo accounts for testing purposes
*/

-- Insert demo users into auth.users (this would typically be done through Supabase Auth)
-- For demo purposes, we'll create the profile records that would be linked to auth users

-- Demo Admin User
INSERT INTO users (
  id,
  auth_id,
  name,
  email,
  role,
  department_id,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  null, -- Will be linked when auth user is created
  'Dr. Sarah Johnson',
  'admin@university.edu',
  'admin',
  (SELECT id FROM departments WHERE code = 'CSE' LIMIT 1),
  now(),
  now()
);

-- Demo Coordinator User
INSERT INTO users (
  id,
  auth_id,
  name,
  email,
  role,
  department_id,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  null, -- Will be linked when auth user is created
  'Prof. Michael Chen',
  'coordinator@university.edu',
  'coordinator',
  (SELECT id FROM departments WHERE code = 'CSE' LIMIT 1),
  now(),
  now()
);

-- Demo Reviewer User
INSERT INTO users (
  id,
  auth_id,
  name,
  email,
  role,
  department_id,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  null, -- Will be linked when auth user is created
  'Dr. Emily Rodriguez',
  'reviewer@university.edu',
  'reviewer',
  (SELECT id FROM departments WHERE code = 'CSE' LIMIT 1),
  now(),
  now()
);

-- Create a function to link auth users to profile users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Update the users table to link the auth_id when a user signs up
  UPDATE public.users 
  SET auth_id = NEW.id 
  WHERE email = NEW.email AND auth_id IS NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically link new auth users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();