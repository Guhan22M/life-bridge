const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel'); // Your existing user model
const jwt = require('jsonwebtoken');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find user by email
        const email = profile.emails[0].value;

        if(!email){
          return done(new Error("No email found in Google profile"), null);
        }

        let user = await User.findOne({ email });

        // If user does not exist, create it
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: email,
            password: Math.random().toString(36).slice(-8) // Dummy password
          });
        }

        // Generate JWT for the user
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        // Pass both user and token to next step
        return done(null, { user, token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
