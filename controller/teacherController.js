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
