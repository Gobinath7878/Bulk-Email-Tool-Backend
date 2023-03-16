const Recipient = require('../models/recipient.js');


//here recipients is nothing but students
//get All recipients
exports.getRecipients = async (req, res) => {
  try {
    const recipients = await Recipient.find();
    res.status(200).json(recipients);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error retrieving recipients' });
  }
};

//get each recipients by id

exports.getRecipientById = async (req, res) => {
  try {
    const recipient = await Recipient.findById(req.params.id);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }
    res.status(200).json(recipient);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error retrieving recipient' });
  }
};

// create recipients

exports.addRecipient = async (req, res) => {
  try {
    const recipient = new Recipient({
      email: req.body.email
    });
    const newRecipient = await recipient.save();
    res.status(201).json(newRecipient);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error adding recipient' });
  }
};

//update recipients

exports.updateRecipient = async (req, res) => {
  try {
    const recipient = await Recipient.findById(req.params.id);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }
    recipient.email = req.body.email;
    const updatedRecipient = await recipient.save();
    res.status(200).json(updatedRecipient);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating recipient' });
  }
};

//delete recipients

exports.deleteRecipient =async(req,res)=>{
    const id = req.params.id
  
    try{
  
     await Recipient.findByIdAndDelete(id);
     
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

  exports.sendemailRecipient = async (req, res) => {
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
  }