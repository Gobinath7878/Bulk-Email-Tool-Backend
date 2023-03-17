
const express = require('express');
const teacherController = require('../controller/teacherController.js');
const router = express.Router();

// Recipient routes
router.get('/getAll', teacherController.getTeachers);
router.get('/get/:id', teacherController.getTeacherById);
router.post('/create', teacherController.addTeacher);
router.put('/put/:id', teacherController.updateTeacher);
router.delete('/delete/:id',teacherController.deleteTeacher);
router.post('/send/mail',teacherController.sendemailTeacher);

module.exports = router;