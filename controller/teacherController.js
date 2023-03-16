const Teacher= require('../models/teacher');



//get All teachers
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error retrieving teachers' });
  }
};

//get each teacher by id

exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'teacher not found' });
    }
    res.status(200).json(teacher);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error retrieving teacher' });
  }
};

// create teacher

exports.addTeacher = async (req, res) => {
  try {
    const teacher = new Teacher({
      email: req.body.email
    });
    const newTeacher = await teacher.save();
    res.status(201).json(newTeacher);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error adding teacher' });
  }
};

//update teacher

exports.updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'teacher not found' });
    }
    teacher.email = req.body.email;
    const updatedTeacher = await teacher.save();
    res.status(200).json(updatedTeacher);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating teacher' });
  }
};

//delete teacher

exports.deleteTeacher =async(req,res)=>{
    const id = req.params.id
  
    try{
  
     await Teacher.findByIdAndDelete(id);
     
      res.status(200)
      .json({
        success: true,
        message: "Successfully deleted",
      });
  
    } catch(err){
        console.log(err)
      res.status(500)
      .json({
        success:false,
        message: "Failed to delete",
      });
  }
  };

  exports.sendemailTeacher = async (req, res) => {
    const { subject, message } = req.body;
    const teacherIds = req.body.teacher;
  
    try {
      const teacher = await Teacher.find({ _id: { $in: teacherIds } });
      if (!teacher || teacher.length === 0) {
        return res.status(400).json({ message: 'No teacher found' });
      }
      const teacherEmails = teacher.map(teachers => teachers.email);
  
      // create reusable transporter object using the SMTP transport
      const transporter = nodemailer.createTransport({
        host: process.env.HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        }
      });
  
      // send mail with defined transport object
      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: teacherEmails.join(', '),
        subject,
        text: message
      };
      const info = await transporter.sendMail(mailOptions);
      console.log(`Message sent: ${info.messageId}`);
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error sending email' });
    }
  }