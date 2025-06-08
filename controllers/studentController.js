const studentModel = require('../models/studentModel');

exports.createStudent = async (req, res) => {
  const { name, email, age, marks } = req.body;
  try {
    const student = await studentModel.createStudent(name, email, age, marks);
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStudents = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const result = await studentModel.getStudents(+page, +limit);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await studentModel.getStudentById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  const { name, email, age } = req.body;
  try {
    const updated = await studentModel.updateStudent(req.params.id, name, email, age);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    await studentModel.deleteStudent(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};