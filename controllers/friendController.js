// controllers/friendController.js
const { Op } = require('sequelize');
const Friend = require('../models/friend');
const User = require('../models/user');

const sendFriendRequest = async (req, res) => {
  const { friendId } = req.body;
  const userId = req.user.id;

  if (userId === friendId) return res.status(400).json({ message: 'You cannot add yourself as a friend.' });

  await Friend.create({ userId, friendId, status: 'pending' });
  res.json({ message: 'Friend request sent.' });
};

const acceptFriendRequest = async (req, res) => {
  const { friendId } = req.body;
  const userId = req.user.id;

  console.log(friendId, userId);

  const friendRequest = await Friend.findOne({ where: { userId: friendId, friendId: userId, status: 'pending' } });
  if (!friendRequest) return res.status(404).json({ message: 'Friend request not found.' });

  friendRequest.status = 'accepted';
  await friendRequest.save();
  res.json({ message: 'Friend request accepted.' });
};

const listFriends = async (req, res) => {
  const userId = req.user.id;

  const friends = await Friend.findAll({
    where: {
      [Op.or]: [
        { userId, status: 'accepted' },
        { friendId: userId, status: 'accepted' }
      ]
    }
  });
  res.json(friends);
};

const pendingFriends = async (req, res) => {
  const userId = req.user.id;

  const friends = await Friend.findAll({
    where: {
      friendId: userId,
      status: 'pending' 
    }
  });
  res.json(friends);
};

const unfriend = async (req, res) => {
  const { friendId } = req.body;
  const userId = req.user.id;

  if (userId === friendId) return res.status(400).json({ message: 'You cannot unfriend yourself.' });

  const friendRelationship = await Friend.findOne({
    where: {
      [Op.or]: [
        { userId, friendId, status: 'accepted' },
        { userId: friendId, friendId: userId, status: 'accepted' }
      ]
    }
  });

  if (!friendRelationship) return res.status(404).json({ message: 'Friend relationship not found.' });

  await friendRelationship.destroy();
  res.json({ message: 'Unfriended successfully.' });
};

const rejectFriendRequest = async (req, res) => {
  const { friendId } = req.body;
  const userId = req.user.id;

  if (userId === friendId) return res.status(400).json({ message: 'You cannot reject a friend request from yourself.' });

  const friendRequest = await Friend.findOne({
    where: {
      userId: friendId,
      friendId: userId,
      status: 'pending'
    }
  });

  if (!friendRequest) return res.status(404).json({ message: 'Friend request not found.' });

  await friendRequest.destroy();
  res.json({ message: 'Friend request rejected.' });
};

module.exports = { sendFriendRequest, acceptFriendRequest, listFriends, pendingFriends, unfriend, rejectFriendRequest };
