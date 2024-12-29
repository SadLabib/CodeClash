// routes/friendRoutes.js
const express = require('express');
const { sendFriendRequest, acceptFriendRequest, listFriends, pendingFriends, unfriend, rejectFriendRequest } = require('../controllers/friendController');
const authenticateToken = require('../middlewares/auth');

const router = express.Router();

router.post('/add', authenticateToken, sendFriendRequest);
router.post('/accept', authenticateToken, acceptFriendRequest);
router.get('/list', authenticateToken, listFriends);
router.get('/pending', authenticateToken, pendingFriends);
router.post('/unfriend', authenticateToken, unfriend);
router.post('/reject', authenticateToken, rejectFriendRequest); 

module.exports = router;
