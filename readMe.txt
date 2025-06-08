
// SQL Schema (you can run this in PostgreSQL)
-- Table: students
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  age INTEGER
);

-- Table: marks
CREATE TABLE marks (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  subject VARCHAR(50),
  score INTEGER
);