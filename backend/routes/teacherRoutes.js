const express = require('express');
const router = express.Router();

const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Homework = require('../models/Homework');
const Attendance = require('../models/Attendance');
const Class = require('../models/Class');

// Teacher registration
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await Teacher.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Teacher already exists' });

    const newTeacher = new Teacher({ name, email, password });
    await newTeacher.save();
    res.status(201).json({ teacherId: newTeacher._id, name: newTeacher.name });
  } catch (error) {
    res.status(500).json({ message: 'Error registering teacher', error: error.message });
  }
});

// Teacher login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const teacher = await Teacher.findOne({ email, password });
    if (!teacher) return res.status(404).json({ message: 'Invalid credentials' });

    res.json({ teacherId: teacher._id, name: teacher.name });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Create class
router.post('/class', async (req, res) => {
  try {
    const { name } = req.body;
    const newClass = new Class({ name });
    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ message: 'Error creating class', error: error.message });
  }
});

// Add student
router.post('/students', async (req, res) => {
  try {
    const { name, email, rollNumber, classId } = req.body;
    const newStudent = new Student({ name, email, rollNumber, class: classId });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ message: 'Error creating student', error: error.message });
  }
});

// Assign homework
router.post('/homework', async (req, res) => {
  try {
    const { classId, title, description, dueDate } = req.body;
    const newHomework = new Homework({ class: classId, title, description, dueDate });
    await newHomework.save();
    res.status(201).json(newHomework);
  } catch (error) {
    res.status(500).json({ message: 'Error creating homework', error: error.message });
  }
});

// Mark attendance
router.post('/attendance', async (req, res) => {
  try {
    const { studentId, classId, date, status } = req.body;
    const newAttendance = new Attendance({ student: studentId, class: classId, date, status });
    await newAttendance.save();
    res.status(201).json(newAttendance);
  } catch (error) {
    res.status(500).json({ message: 'Error marking attendance', error: error.message });
  }
});

// Dashboard summary
router.get('/dashboard', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalHomework = await Homework.countDocuments();
    const totalAttendance = await Attendance.countDocuments();
    res.json({ totalStudents, totalHomework, totalAttendance });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
  }
});

module.exports = router;