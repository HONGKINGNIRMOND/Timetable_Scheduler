/*
  # Insert Sample Data for Academic Timetable Platform

  This migration adds sample data to demonstrate the platform functionality:
  - Sample departments
  - Sample classrooms with different types and equipment
  - Sample subjects for different departments and semesters
  - Sample faculty members with their subject assignments
  - Sample student batches
  - Sample time slots for scheduling
  - Sample optimization parameters
*/

-- Insert sample departments
INSERT INTO departments (id, name, code, head_of_department) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Computer Science', 'CS', 'Dr. Sarah Johnson'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Mathematics', 'MATH', 'Prof. Michael Chen'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Physics', 'PHY', 'Dr. Emily Davis'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Chemistry', 'CHEM', 'Prof. Robert Wilson')
ON CONFLICT (id) DO NOTHING;

-- Insert sample classrooms
INSERT INTO classrooms (id, name, capacity, type, equipment, building, floor) VALUES
  ('650e8400-e29b-41d4-a716-446655440001', 'Room 101', 60, 'lecture', ARRAY['Projector', 'Whiteboard', 'Audio System'], 'Main Building', 1),
  ('650e8400-e29b-41d4-a716-446655440002', 'Room 102', 80, 'lecture', ARRAY['Smart Board', 'Audio System'], 'Main Building', 1),
  ('650e8400-e29b-41d4-a716-446655440003', 'Lab 201', 30, 'laboratory', ARRAY['Computers', 'Network', 'Projector'], 'IT Building', 2),
  ('650e8400-e29b-41d4-a716-446655440004', 'Lab 202', 25, 'laboratory', ARRAY['Computers', 'Software Tools'], 'IT Building', 2),
  ('650e8400-e29b-41d4-a716-446655440005', 'Physics Lab', 40, 'laboratory', ARRAY['Lab Equipment', 'Safety Gear'], 'Science Building', 1),
  ('650e8400-e29b-41d4-a716-446655440006', 'Chemistry Lab', 35, 'laboratory', ARRAY['Fume Hoods', 'Lab Equipment', 'Safety Gear'], 'Science Building', 2),
  ('650e8400-e29b-41d4-a716-446655440007', 'Seminar Hall', 120, 'seminar', ARRAY['Projector', 'Audio System', 'Microphone'], 'Main Building', 2),
  ('650e8400-e29b-41d4-a716-446655440008', 'Room 301', 50, 'lecture', ARRAY['Whiteboard', 'Projector'], 'Main Building', 3),
  ('650e8400-e29b-41d4-a716-446655440009', 'Room 302', 45, 'lecture', ARRAY['Smart Board'], 'Main Building', 3),
  ('650e8400-e29b-41d4-a716-446655440010', 'Math Lab', 30, 'laboratory', ARRAY['Computers', 'Mathematical Software'], 'Science Building', 3)
ON CONFLICT (id) DO NOTHING;

-- Insert sample subjects
INSERT INTO subjects (id, name, code, department_id, semester, credits, hours_per_week, type, required_equipment, max_students) VALUES
  -- Computer Science subjects
  ('750e8400-e29b-41d4-a716-446655440001', 'Data Structures and Algorithms', 'CS501', '550e8400-e29b-41d4-a716-446655440001', 5, 4, 4, 'theory', NULL, 60),
  ('750e8400-e29b-41d4-a716-446655440002', 'Database Management Systems', 'CS502', '550e8400-e29b-41d4-a716-446655440001', 5, 3, 3, 'theory', NULL, 60),
  ('750e8400-e29b-41d4-a716-446655440003', 'Operating Systems Lab', 'CS503', '550e8400-e29b-41d4-a716-446655440001', 5, 2, 4, 'practical', ARRAY['Computers'], 30),
  ('750e8400-e29b-41d4-a716-446655440004', 'Software Engineering', 'CS504', '550e8400-e29b-41d4-a716-446655440001', 5, 3, 3, 'theory', NULL, 60),
  ('750e8400-e29b-41d4-a716-446655440005', 'Computer Networks', 'CS505', '550e8400-e29b-41d4-a716-446655440001', 6, 4, 4, 'theory', NULL, 60),
  ('750e8400-e29b-41d4-a716-446655440006', 'Web Development Lab', 'CS506', '550e8400-e29b-41d4-a716-446655440001', 6, 2, 4, 'practical', ARRAY['Computers', 'Network'], 30),
  
  -- Mathematics subjects
  ('750e8400-e29b-41d4-a716-446655440007', 'Linear Algebra', 'MATH301', '550e8400-e29b-41d4-a716-446655440002', 3, 4, 4, 'theory', NULL, 80),
  ('750e8400-e29b-41d4-a716-446655440008', 'Calculus III', 'MATH302', '550e8400-e29b-41d4-a716-446655440002', 3, 4, 4, 'theory', NULL, 80),
  ('750e8400-e29b-41d4-a716-446655440009', 'Statistics', 'MATH303', '550e8400-e29b-41d4-a716-446655440002', 3, 3, 3, 'theory', NULL, 80),
  ('750e8400-e29b-41d4-a716-446655440010', 'Mathematical Modeling Lab', 'MATH304', '550e8400-e29b-41d4-a716-446655440002', 3, 2, 4, 'practical', ARRAY['Computers', 'Mathematical Software'], 30),
  
  -- Physics subjects
  ('750e8400-e29b-41d4-a716-446655440011', 'Quantum Mechanics', 'PHY401', '550e8400-e29b-41d4-a716-446655440003', 4, 4, 4, 'theory', NULL, 50),
  ('750e8400-e29b-41d4-a716-446655440012', 'Electromagnetic Theory', 'PHY402', '550e8400-e29b-41d4-a716-446655440003', 4, 4, 4, 'theory', NULL, 50),
  ('750e8400-e29b-41d4-a716-446655440013', 'Physics Lab', 'PHY403', '550e8400-e29b-41d4-a716-446655440003', 4, 2, 4, 'practical', ARRAY['Lab Equipment', 'Safety Gear'], 25),
  
  -- Chemistry subjects
  ('750e8400-e29b-41d4-a716-446655440014', 'Organic Chemistry', 'CHEM301', '550e8400-e29b-41d4-a716-446655440004', 3, 4, 4, 'theory', NULL, 60),
  ('750e8400-e29b-41d4-a716-446655440015', 'Physical Chemistry', 'CHEM302', '550e8400-e29b-41d4-a716-446655440004', 3, 4, 4, 'theory', NULL, 60),
  ('750e8400-e29b-41d4-a716-446655440016', 'Chemistry Lab', 'CHEM303', '550e8400-e29b-41d4-a716-446655440004', 3, 2, 4, 'practical', ARRAY['Fume Hoods', 'Lab Equipment', 'Safety Gear'], 20)
ON CONFLICT (id) DO NOTHING;

-- Insert sample faculty
INSERT INTO faculty (id, name, email, department_id, max_hours_per_week, average_leaves_per_month) VALUES
  -- Computer Science faculty
  ('850e8400-e29b-41d4-a716-446655440001', 'Dr. Sarah Johnson', 'sarah.johnson@university.edu', '550e8400-e29b-41d4-a716-446655440001', 20, 2),
  ('850e8400-e29b-41d4-a716-446655440002', 'Prof. David Smith', 'david.smith@university.edu', '550e8400-e29b-41d4-a716-446655440001', 18, 1),
  ('850e8400-e29b-41d4-a716-446655440003', 'Dr. Lisa Wang', 'lisa.wang@university.edu', '550e8400-e29b-41d4-a716-446655440001', 22, 2),
  ('850e8400-e29b-41d4-a716-446655440004', 'Prof. James Brown', 'james.brown@university.edu', '550e8400-e29b-41d4-a716-446655440001', 20, 1),
  
  -- Mathematics faculty
  ('850e8400-e29b-41d4-a716-446655440005', 'Prof. Michael Chen', 'michael.chen@university.edu', '550e8400-e29b-41d4-a716-446655440002', 20, 2),
  ('850e8400-e29b-41d4-a716-446655440006', 'Dr. Anna Rodriguez', 'anna.rodriguez@university.edu', '550e8400-e29b-41d4-a716-446655440002', 18, 1),
  ('850e8400-e29b-41d4-a716-446655440007', 'Prof. Thomas Lee', 'thomas.lee@university.edu', '550e8400-e29b-41d4-a716-446655440002', 19, 2),
  
  -- Physics faculty
  ('850e8400-e29b-41d4-a716-446655440008', 'Dr. Emily Davis', 'emily.davis@university.edu', '550e8400-e29b-41d4-a716-446655440003', 20, 2),
  ('850e8400-e29b-41d4-a716-446655440009', 'Prof. Richard Wilson', 'richard.wilson@university.edu', '550e8400-e29b-41d4-a716-446655440003', 18, 1),
  
  -- Chemistry faculty
  ('850e8400-e29b-41d4-a716-446655440010', 'Prof. Robert Wilson', 'robert.wilson@university.edu', '550e8400-e29b-41d4-a716-446655440004', 20, 2),
  ('850e8400-e29b-41d4-a716-446655440011', 'Dr. Maria Garcia', 'maria.garcia@university.edu', '550e8400-e29b-41d4-a716-446655440004', 19, 1)
ON CONFLICT (id) DO NOTHING;

-- Insert faculty-subject mappings
INSERT INTO faculty_subjects (faculty_id, subject_id) VALUES
  -- Computer Science faculty subjects
  ('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001'), -- Dr. Sarah Johnson - Data Structures
  ('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440004'), -- Dr. Sarah Johnson - Software Engineering
  ('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002'), -- Prof. David Smith - Database Systems
  ('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440005'), -- Prof. David Smith - Computer Networks
  ('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440003'), -- Dr. Lisa Wang - OS Lab
  ('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440006'), -- Dr. Lisa Wang - Web Dev Lab
  ('850e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440001'), -- Prof. James Brown - Data Structures
  ('850e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440005'), -- Prof. James Brown - Computer Networks
  
  -- Mathematics faculty subjects
  ('850e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440007'), -- Prof. Michael Chen - Linear Algebra
  ('850e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440008'), -- Prof. Michael Chen - Calculus III
  ('850e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440009'), -- Dr. Anna Rodriguez - Statistics
  ('850e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440010'), -- Dr. Anna Rodriguez - Math Modeling Lab
  ('850e8400-e29b-41d4-a716-446655440007', '750e8400-e29b-41d4-a716-446655440007'), -- Prof. Thomas Lee - Linear Algebra
  ('850e8400-e29b-41d4-a716-446655440007', '750e8400-e29b-41d4-a716-446655440009'), -- Prof. Thomas Lee - Statistics
  
  -- Physics faculty subjects
  ('850e8400-e29b-41d4-a716-446655440008', '750e8400-e29b-41d4-a716-446655440011'), -- Dr. Emily Davis - Quantum Mechanics
  ('850e8400-e29b-41d4-a716-446655440008', '750e8400-e29b-41d4-a716-446655440013'), -- Dr. Emily Davis - Physics Lab
  ('850e8400-e29b-41d4-a716-446655440009', '750e8400-e29b-41d4-a716-446655440012'), -- Prof. Richard Wilson - Electromagnetic Theory
  ('850e8400-e29b-41d4-a716-446655440009', '750e8400-e29b-41d4-a716-446655440013'), -- Prof. Richard Wilson - Physics Lab
  
  -- Chemistry faculty subjects
  ('850e8400-e29b-41d4-a716-446655440010', '750e8400-e29b-41d4-a716-446655440014'), -- Prof. Robert Wilson - Organic Chemistry
  ('850e8400-e29b-41d4-a716-446655440010', '750e8400-e29b-41d4-a716-446655440016'), -- Prof. Robert Wilson - Chemistry Lab
  ('850e8400-e29b-41d4-a716-446655440011', '750e8400-e29b-41d4-a716-446655440015'), -- Dr. Maria Garcia - Physical Chemistry
  ('850e8400-e29b-41d4-a716-446655440011', '750e8400-e29b-41d4-a716-446655440016')  -- Dr. Maria Garcia - Chemistry Lab
ON CONFLICT (faculty_id, subject_id) DO NOTHING;

-- Insert sample batches
INSERT INTO batches (id, name, department_id, semester, student_count, shift) VALUES
  -- Computer Science batches
  ('950e8400-e29b-41d4-a716-446655440001', 'CS-5A', '550e8400-e29b-41d4-a716-446655440001', 5, 55, 'morning'),
  ('950e8400-e29b-41d4-a716-446655440002', 'CS-5B', '550e8400-e29b-41d4-a716-446655440001', 5, 50, 'morning'),
  ('950e8400-e29b-41d4-a716-446655440003', 'CS-6A', '550e8400-e29b-41d4-a716-446655440001', 6, 48, 'morning'),
  ('950e8400-e29b-41d4-a716-446655440004', 'CS-6B', '550e8400-e29b-41d4-a716-446655440001', 6, 52, 'afternoon'),
  
  -- Mathematics batches
  ('950e8400-e29b-41d4-a716-446655440005', 'MATH-3A', '550e8400-e29b-41d4-a716-446655440002', 3, 65, 'morning'),
  ('950e8400-e29b-41d4-a716-446655440006', 'MATH-3B', '550e8400-e29b-41d4-a716-446655440002', 3, 60, 'morning'),
  
  -- Physics batches
  ('950e8400-e29b-41d4-a716-446655440007', 'PHY-4A', '550e8400-e29b-41d4-a716-446655440003', 4, 40, 'morning'),
  ('950e8400-e29b-41d4-a716-446655440008', 'PHY-4B', '550e8400-e29b-41d4-a716-446655440003', 4, 35, 'afternoon'),
  
  -- Chemistry batches
  ('950e8400-e29b-41d4-a716-446655440009', 'CHEM-3A', '550e8400-e29b-41d4-a716-446655440004', 3, 45, 'morning'),
  ('950e8400-e29b-41d4-a716-446655440010', 'CHEM-3B', '550e8400-e29b-41d4-a716-446655440004', 3, 42, 'afternoon')
ON CONFLICT (id) DO NOTHING;

-- Insert batch-subject mappings
INSERT INTO batch_subjects (batch_id, subject_id) VALUES
  -- CS-5A subjects
  ('950e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001'), -- Data Structures
  ('950e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440002'), -- Database Systems
  ('950e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440003'), -- OS Lab
  ('950e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440004'), -- Software Engineering
  
  -- CS-5B subjects
  ('950e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001'), -- Data Structures
  ('950e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002'), -- Database Systems
  ('950e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440003'), -- OS Lab
  ('950e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440004'), -- Software Engineering
  
  -- CS-6A subjects
  ('950e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440005'), -- Computer Networks
  ('950e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440006'), -- Web Dev Lab
  
  -- CS-6B subjects
  ('950e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440005'), -- Computer Networks
  ('950e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440006'), -- Web Dev Lab
  
  -- MATH-3A subjects
  ('950e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440007'), -- Linear Algebra
  ('950e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440008'), -- Calculus III
  ('950e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440009'), -- Statistics
  ('950e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440010'), -- Math Modeling Lab
  
  -- MATH-3B subjects
  ('950e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440007'), -- Linear Algebra
  ('950e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440008'), -- Calculus III
  ('950e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440009'), -- Statistics
  ('950e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440010'), -- Math Modeling Lab
  
  -- PHY-4A subjects
  ('950e8400-e29b-41d4-a716-446655440007', '750e8400-e29b-41d4-a716-446655440011'), -- Quantum Mechanics
  ('950e8400-e29b-41d4-a716-446655440007', '750e8400-e29b-41d4-a716-446655440012'), -- Electromagnetic Theory
  ('950e8400-e29b-41d4-a716-446655440007', '750e8400-e29b-41d4-a716-446655440013'), -- Physics Lab
  
  -- PHY-4B subjects
  ('950e8400-e29b-41d4-a716-446655440008', '750e8400-e29b-41d4-a716-446655440011'), -- Quantum Mechanics
  ('950e8400-e29b-41d4-a716-446655440008', '750e8400-e29b-41d4-a716-446655440012'), -- Electromagnetic Theory
  ('950e8400-e29b-41d4-a716-446655440008', '750e8400-e29b-41d4-a716-446655440013'), -- Physics Lab
  
  -- CHEM-3A subjects
  ('950e8400-e29b-41d4-a716-446655440009', '750e8400-e29b-41d4-a716-446655440014'), -- Organic Chemistry
  ('950e8400-e29b-41d4-a716-446655440009', '750e8400-e29b-41d4-a716-446655440015'), -- Physical Chemistry
  ('950e8400-e29b-41d4-a716-446655440009', '750e8400-e29b-41d4-a716-446655440016'), -- Chemistry Lab
  
  -- CHEM-3B subjects
  ('950e8400-e29b-41d4-a716-446655440010', '750e8400-e29b-41d4-a716-446655440014'), -- Organic Chemistry
  ('950e8400-e29b-41d4-a716-446655440010', '750e8400-e29b-41d4-a716-446655440015'), -- Physical Chemistry
  ('950e8400-e29b-41d4-a716-446655440010', '750e8400-e29b-41d4-a716-446655440016')  -- Chemistry Lab
ON CONFLICT (batch_id, subject_id) DO NOTHING;

-- Insert sample time slots
INSERT INTO time_slots (id, day, start_time, end_time, duration) VALUES
  -- Monday slots
  ('a50e8400-e29b-41d4-a716-446655440001', 'Monday', '09:00', '10:00', 1),
  ('a50e8400-e29b-41d4-a716-446655440002', 'Monday', '10:15', '11:15', 1),
  ('a50e8400-e29b-41d4-a716-446655440003', 'Monday', '11:30', '12:30', 1),
  ('a50e8400-e29b-41d4-a716-446655440004', 'Monday', '13:30', '14:30', 1),
  ('a50e8400-e29b-41d4-a716-446655440005', 'Monday', '14:45', '15:45', 1),
  ('a50e8400-e29b-41d4-a716-446655440006', 'Monday', '16:00', '17:00', 1),
  
  -- Tuesday slots
  ('a50e8400-e29b-41d4-a716-446655440007', 'Tuesday', '09:00', '10:00', 1),
  ('a50e8400-e29b-41d4-a716-446655440008', 'Tuesday', '10:15', '11:15', 1),
  ('a50e8400-e29b-41d4-a716-446655440009', 'Tuesday', '11:30', '12:30', 1),
  ('a50e8400-e29b-41d4-a716-446655440010', 'Tuesday', '13:30', '14:30', 1),
  ('a50e8400-e29b-41d4-a716-446655440011', 'Tuesday', '14:45', '15:45', 1),
  ('a50e8400-e29b-41d4-a716-446655440012', 'Tuesday', '16:00', '17:00', 1),
  
  -- Wednesday slots
  ('a50e8400-e29b-41d4-a716-446655440013', 'Wednesday', '09:00', '10:00', 1),
  ('a50e8400-e29b-41d4-a716-446655440014', 'Wednesday', '10:15', '11:15', 1),
  ('a50e8400-e29b-41d4-a716-446655440015', 'Wednesday', '11:30', '12:30', 1),
  ('a50e8400-e29b-41d4-a716-446655440016', 'Wednesday', '13:30', '14:30', 1),
  ('a50e8400-e29b-41d4-a716-446655440017', 'Wednesday', '14:45', '15:45', 1),
  ('a50e8400-e29b-41d4-a716-446655440018', 'Wednesday', '16:00', '17:00', 1),
  
  -- Thursday slots
  ('a50e8400-e29b-41d4-a716-446655440019', 'Thursday', '09:00', '10:00', 1),
  ('a50e8400-e29b-41d4-a716-446655440020', 'Thursday', '10:15', '11:15', 1),
  ('a50e8400-e29b-41d4-a716-446655440021', 'Thursday', '11:30', '12:30', 1),
  ('a50e8400-e29b-41d4-a716-446655440022', 'Thursday', '13:30', '14:30', 1),
  ('a50e8400-e29b-41d4-a716-446655440023', 'Thursday', '14:45', '15:45', 1),
  ('a50e8400-e29b-41d4-a716-446655440024', 'Thursday', '16:00', '17:00', 1),
  
  -- Friday slots
  ('a50e8400-e29b-41d4-a716-446655440025', 'Friday', '09:00', '10:00', 1),
  ('a50e8400-e29b-41d4-a716-446655440026', 'Friday', '10:15', '11:15', 1),
  ('a50e8400-e29b-41d4-a716-446655440027', 'Friday', '11:30', '12:30', 1),
  ('a50e8400-e29b-41d4-a716-446655440028', 'Friday', '13:30', '14:30', 1),
  ('a50e8400-e29b-41d4-a716-446655440029', 'Friday', '14:45', '15:45', 1),
  ('a50e8400-e29b-41d4-a716-446655440030', 'Friday', '16:00', '17:00', 1)
ON CONFLICT (id) DO NOTHING;

-- Insert sample optimization parameters
INSERT INTO optimization_parameters (id, name, max_classes_per_day, preferred_start_time, preferred_end_time, lunch_break_duration, min_break_between_classes) VALUES
  ('b50e8400-e29b-41d4-a716-446655440001', 'Default Parameters', 6, '09:00', '17:00', 60, 15),
  ('b50e8400-e29b-41d4-a716-446655440002', 'Morning Shift Focus', 5, '08:00', '14:00', 45, 15),
  ('b50e8400-e29b-41d4-a716-446655440003', 'Afternoon Shift Focus', 6, '13:00', '19:00', 60, 15)
ON CONFLICT (id) DO NOTHING;