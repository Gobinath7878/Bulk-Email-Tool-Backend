
const express = require('express');
const recipientController = require('../controller/recipientController.js');
const router = express.Router();

// Recipient routes
router.get('/getAll', recipientController.getRecipients);
router.get('/get/:id', recipientController.getRecipientById);
router.post('/create', recipientController.addRecipient);
router.put('/put/:id', recipientController.updateRecipient);
router.delete('/delete/:id', recipientController.deleteRecipient);
router.post('/send/mail',recipientController.sendemailRecipient)

module.exports = router;