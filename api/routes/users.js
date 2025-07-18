const express = require('express');
const User = require('../models/User');
const { auth, tenant, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Get current user info
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
    
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users in tenant (Admin only)
router.get('/', adminOnly, tenant, async (req, res) => {
  try {
    const users = await User.find(req.tenantFilter).select('-password');
    res.json(users);
    
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Test protected route
router.get('/test', auth, (req, res) => {
  res.json({
    message: 'Protected route accessed successfully',
    user: req.user
  });
});

// Test admin route
router.get('/admin/test', adminOnly, (req, res) => {
  res.json({
    message: 'Admin route accessed successfully',
    user: req.user
  });
});

module.exports = router;