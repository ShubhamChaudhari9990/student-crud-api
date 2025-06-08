const pool = require('../config/db');

exports.createStudent = async (name, email, age, marks) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      'INSERT INTO students (name, email, age) VALUES ($1, $2, $3) RETURNING id',
      [name, email, age]
    );
    const studentId = result.rows[0].id;

    for (const m of marks) {
      await client.query(
        'INSERT INTO marks (student_id, subject, score) VALUES ($1, $2, $3)',
        [studentId, m.subject, m.score]
      );
    }
    await client.query('COMMIT');
    return { id: studentId, name, email, age, marks };
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

exports.getStudents = async (page, limit) => {
  const offset = (page - 1) * limit;
  const students = await pool.query('SELECT * FROM students ORDER BY id LIMIT $1 OFFSET $2', [limit, offset]);
  const total = await pool.query('SELECT COUNT(*) FROM students');
  return {
    students: students.rows,
    meta: {
      total: +total.rows[0].count,
      page,
      limit,
    },
  };
};

exports.getStudentById = async (id) => {
  const student = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
  if (student.rows.length === 0) return null;
  const marks = await pool.query('SELECT subject, score FROM marks WHERE student_id = $1', [id]);
  return { ...student.rows[0], marks: marks.rows };
};

exports.updateStudent = async (id, name, email, age) => {
  await pool.query('UPDATE students SET name = $1, email = $2, age = $3 WHERE id = $4', [name, email, age, id]);
  return { id, name, email, age };
};

exports.deleteStudent = async (id) => {
  await pool.query('DELETE FROM marks WHERE student_id = $1', [id]);
  await pool.query('DELETE FROM students WHERE id = $1', [id]);
};