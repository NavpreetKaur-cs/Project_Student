const express = require('express');
const router = express.Router();

const Student = require('../models/Student');
const Homework = require('../models/Homework');
const Attendance = require('../models/Attendance');
const mongoose = require('mongoose');

// Student login
router.post('/login', async (req, res) => {
  const { rollNumber, email } = req.body;
  try {
    const query = email ? { rollNumber, email } : { rollNumber };
    const student = await Student.findOne(query).populate('class');
    if (!student) return res.status(404).json({ message: 'Invalid credentials' });

    res.json({
      studentId: student._id,
      name: student.name,
      class: student.class,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Student profile
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }
    const student = await Student.findById(req.params.id).populate('class');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student', error: error.message });
  }
});

// Homework by class
router.get('/:id/homework', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const homework = await Homework.find({ class: student.class });
    res.json(homework);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching homework', error: error.message });
  }
});

// Attendance
router.get('/:id/attendance', async (req, res) => {
  try {
    const attendance = await Attendance.find({ student: req.params.id });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance', error: error.message });
  }
});

// Attendance summary
router.get('/:id/attendance-summary', async (req, res) => {
  try {
    const summary = await Attendance.aggregate([
      { $match: { student: mongoose.Types.ObjectId(req.params.id) } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const formatted = { Present: 0, Absent: 0, Late: 0 };
    summary.forEach(item => { formatted[item._id] = item.count; });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance summary', error: error.message });
  }
});

module.exports = router;