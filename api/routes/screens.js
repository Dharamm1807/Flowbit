const express = require('express');
const { auth } = require('../middleware/auth');
const { tenantIsolation } = require('../middleware/tenantIsolation');

const router = express.Router();

// Apply authentication and tenant isolation
router.use(auth);
router.use(tenantIsolation);

// Screen registry configuration
const screenRegistry = {
  user: [
    {
      id: 'my-requests',
      name: 'My Requests',
      path: '/my-requests',
      permissions: ['user'],
      icon: 'list',
      description: 'View all your submitted requests'
    },
    {
      id: 'new-ticket',
      name: 'Create Ticket',
      path: '/new-ticket',
      permissions: ['user'],
      icon: 'plus-circle',
      description: 'Submit a new support ticket'
    }
  ],
  admin: [
    {
      id: 'admin-requests',
      name: 'All Tenant Requests',
      path: '/admin/requests',
      permissions: ['admin'],
      icon: 'layers',
      description: 'Manage all requests from your tenants'
    }
  ]
};

// Get available screens for user
function getAvailableScreens(role) {
  const screens = [...screenRegistry.user];
  if (role === 'admin') {
    screens.push(...screenRegistry.admin);
  }
  
  return screens;
}

// Get available screens endpoint
router.get('/screens', async (req, res) => {
  try {
    const role = req.user.role.toLowerCase();
    const availableScreens = getAvailableScreens(role);
    
    res.json({
      customerId: req.user.customerId,
      userRole: role,
      availableScreens: availableScreens,
      totalScreens: availableScreens.length
    });
  } catch (error) {
    console.error('Get screens error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific screen configuration
router.get('/screens/:screenId', async (req, res) => {
  try {
    const { screenId } = req.params;
    const role = req.user.role.toLowerCase();
    
    // Get all possible screens for this role
    const allScreens = getAvailableScreens(role);
    const screen = allScreens.find(s => s.id === screenId);
    
    if (!screen) {
      return res.status(404).json({ error: 'Screen not found' });
    }
    
    res.json({
      ...screen,
      customerId: req.user.customerId,
      userRole: role
    });
  } catch (error) {
    console.error('Get screen error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;