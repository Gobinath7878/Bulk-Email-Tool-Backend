const express = require('express');
const mongoose=require('mongoose')
const nodemailer = require('nodemailer');
const cors=require('cors');
const dotenv=require('dotenv');
const cookieParser=require('cookie-parser');
// const Recipient = require('./models/Recipient.js');
// const Teacher =require('./models/Teacher.js')
const recipientRoute =require('./routes/recipient.js')
const teacherRoute=require("./routes/teacher.js")
const userRoute=require("./routes/users")

dotenv.config()
const app=express()

const port=process.env.PORT || 8000;
const corsOptions ={
    origin:true,
    Credentials:true,

}
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });
  
//database connection
mongoose.set("strictQuery",false);
const connect=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL,
            {
                useNewUrlParser:true,
                useUnifiedTopology:true
            })

            console.log('MongoDb database connected')
    } catch(err){
      console.log('MongoDB database connection failed')
    }
}


//for testing
app.get("/",(req,res)=>{
    res.send("api is working good")
})

//middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/api/v1/recipient",recipientRoute);//here recipients is nothing but students
app.use("/api/v1/teacher",teacherRoute);
app.use("/api/v1/auth",userRoute)//login and register 

app.post('/api/v1/send/email/students', async (req, res) => {
  const { subject, message } = req.body;
  const recipientIds = req.body.recipients;

  try {
    const recipients = await Recipient.find({ _id: { $in: recipientIds } });
    if (!recipients || recipients.length === 0) {
      return res.status(400).json({ message: 'No recipients found' });
    }
    const recipientEmails = recipients.map(recipient => recipient.email);

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
      to: recipientEmails.join(', '),
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
});

app.post('/api/v1/send/email/teacher', async (req, res) => {
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
});


// start the server
app.listen(port,()=>{
    connect();
    console.log('server is listening on port',port)
})
