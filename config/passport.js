const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/user');
const bcrypt = require('bcryptjs');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ where: { email: profile.emails[0].value } });
      
      if (user) {
        if (!user.googleId) {
          await user.update({ googleId: profile.id });
        }
        return done(null, user);
      }
      
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(Math.random().toString(36).slice(-8), salt);
      
      user = await User.create({
        username: profile.displayName || profile.emails[0].value.split('@')[0],
        email: profile.emails[0].value,
        password: password,
        googleId: profile.id
      });
      
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    scope: ['user:email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value :
                   `${profile.username}@github.com`;
      
      let user = await User.findOne({ where: { email } });
      
      if (user) {
        if (!user.githubId) {
          await user.update({ githubId: profile.id });
        }
        return done(null, user);
      }
      
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(Math.random().toString(36).slice(-8), salt);
      
      user = await User.create({
        username: profile.username || profile.displayName,
        email: email,
        password: password,
        githubId: profile.id
      });
      
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

module.exports = passport;