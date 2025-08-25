const express = require('express');
const passport = require('passport');

const router = express.Router();

// Step 1: Redirect to Google login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Step 2: Google callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  (req, res) => {
    // Passport puts our { user, token } into req.user

    if(!req.user){
      return res.redirect('/')
    }

    const { user, token } = req.user;

    // Send token & user to frontend
    res.redirect(`https://life-bridge-ca4d.onrender.com/google-success?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`);
  }
);

module.exports = router;
