const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();
const BloodRequest = require('../models/bloodRequestModel');

// @desc    Send blood request to donors
// @route   POST /api/blood
// @access  Private
const sendBloodRequest = asyncHandler(async (req, res) => {
  const {
    patientName,
    age,
    bloodGroup,
    unitsNeeded,
    condition,
    hospitalName,
    hospitalLocation,
    wardOrRoomNumber,
    contactDetails,
  } = req.body;

  if (!patientName || !bloodGroup || !age || !unitsNeeded || !condition || !hospitalName || !hospitalLocation || !wardOrRoomNumber || !contactDetails) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Your user's email and name from the JWT token (req.user)
  const requesterEmail = req.user.email;
  const requesterName = req.user.name;

//   const yesMailLink = `mailto:${requesterEmail}?subject=Blood Donation Confirmation&body=Hello ${requesterName},%0D%0A%0D%0AI am available to donate blood as requested.%0D%0A%0D%0ARegards,%0D%0A[Your Name]`;
//   const noMailLink = `mailto:${requesterEmail}?subject=Blood Donation Response&body=Sorry ${requesterName},%0D%0A%0D%0AI am currently unable to donate blood.%0D%0A%0D%0ARegards,%0D%0A[Your Name]`;

    const yesBody = `Hello ${requesterName},

    I am available to donate blood as requested.

    Regards,
    ${req.user.name || 'Your Name'}`;
    const yesMailLink = `mailto:${requesterEmail}?subject=${encodeURIComponent('Blood Donation Confirmation')}&body=${encodeURIComponent(yesBody)}`;

    const noBody = `Sorry ${requesterName},

    I am currently unable to donate blood.

    Regards,
    ${req.user.name || 'Your Name'}`;
    const noMailLink = `mailto:${requesterEmail}?subject=${encodeURIComponent('Blood Donation Response')}&body=${encodeURIComponent(noBody)}`;


  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

//   const organisations = ["rotary@gmail.com","ngo@gmail.com","example@gmail.com"];

  const mailOptions = {
    from: `LifeBridge <${process.env.EMAIL_USER}>`,
    to: ["arasanguhan22@gmail.com","22cb010@kpriet.ac.in"], 
    subject: `Urgent Blood Request: ${bloodGroup} for ${patientName}`,
    html: `
      <h2>Blood Donation Request</h2>
      <p><strong>Patient:</strong> ${patientName}</p>
      <p><strong>Patient Age:</strong> ${age}</p>
      <p><strong>Blood Group:</strong> ${bloodGroup}</p>
      <p><strong>Units Required:</strong> ${unitsNeeded}</p>
      <p><strong>Condition:</strong> ${condition}</p>
      <p><strong>Hospital:</strong> ${hospitalName}, ${hospitalLocation}</p>
      <p><strong>Ward Number:</strong> ${wardOrRoomNumber}</p>
      <p><strong>Contact:</strong> ${contactDetails}</p>
      <hr>
      <p><strong>Requester:</strong> ${requesterName} (${requesterEmail})</p>
      <p>Do you have the required blood?</p>
      <a href="${yesMailLink}" style="color:green;font-weight:bold;">✅ Yes – I can donate</a><br><br>
      <a href="${noMailLink}" style="color:red;font-weight:bold;">❌ No – Sorry</a>
    `,
  };

  await transporter.sendMail(mailOptions);
  
  // ✅ Send confirmation mail to the requester (req.user)
  await transporter.sendMail({
    from: `LifeBridge <${process.env.EMAIL_USER}>`,
    to: req.user.email, // Send to the requester
    subject: 'Your Blood Request Has Been Sent',
    html: `
    <h3>Hi ${req.user.name},</h3>
    <p>Your blood request has been successfully sent to registered organizations.</p>
    <p><strong>Patient Details:</strong></p>
    <ul>
        <li><strong>Name:</strong> ${patientName}</li>
        <li><strong>Age:</strong> ${age}</li>
        <li><strong>Blood Group:</strong> ${bloodGroup}</li>
        <li><strong>Units Needed:</strong> ${unitsNeeded}</li>
        <li><strong>Condition:</strong> ${condition}</li>
        <li><strong>Hospital:</strong> ${hospitalName}, ${hospitalLocation}</li>
        <li><strong>Ward/Room:</strong> ${wardOrRoomNumber}</li>
        <li><strong>Contact:</strong> ${contactDetails}</li>
    </ul>
    <p>We’ll notify you if a donor responds.</p>
    <br>
    <p>Regards,<br>LifeBridge Team</p>
    `,
  });
  
  await BloodRequest.create({
    user: req.user._id,
    patientName,
    age,
    condition,
    bloodGroup,
    unitsNeeded,
    contactDetails,
    hospitalName,
    hospitalLocation,
    wardOrRoomNumber,
    description: `Requested by ${requesterName} (${requesterEmail})`,
  });
  

  res.status(200).json({ message: 'Blood request sent to donors successfully' });
});

// @desc Get user's blood request history
// @route GET /api/blood/history
// @access Private
const getBloodRequestHistory = asyncHandler(async (req, res) => {
    const requests = await BloodRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(requests);
  });
  
  // @desc Delete a specific blood request
  // @route DELETE /api/blood/:id
  // @access Private
  const deleteBloodRequest = asyncHandler(async (req, res) => {
    const request = await BloodRequest.findById(req.params.id);
  
    if (!request) {
      res.status(404);
      throw new Error('Blood request not found');
    }
  
    if (request.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }
  
    await BloodRequest.findByIdAndDelete(req.params.id);;
    res.status(200).json({ message: 'Blood request deleted' });
  });
  

module.exports = {
  sendBloodRequest, getBloodRequestHistory, deleteBloodRequest
};
