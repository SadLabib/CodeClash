const express = require('express');
const passport = require('passport');
const { register, login, oauthSuccess, oauthFailure } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Google OAuth routes
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );
  
  router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/api/auth/oauth-failure', session: false }),
    oauthSuccess
  );
  
  // GitHub OAuth routes
  router.get('/github',
    passport.authenticate('github', { scope: ['user:email'] })
  );
  
  router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/api/auth/oauth-failure', session: false }),
    oauthSuccess
  );
  
  // OAuth failure route
  router.get('/oauth-failure', oauthFailure);

module.exports = router;