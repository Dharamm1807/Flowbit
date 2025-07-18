const tenantIsolation = (req, res, next) => {
  if (!req.user || !req.user.customerId) {
    return res.status(401).json({ error: 'Valid authentication required for tenant isolation' });
  }

  req.tenantFilter = { customerId: req.user.customerId };
  req.tenantId = req.user.customerId;
  
  next();
};

// Middleware to automatically add tenant ID to create operations
const addTenantToBody = (req, res, next) => {
  if (!req.user || !req.user.customerId) {
    return res.status(401).json({ error: 'Valid authentication required' });
  }

  // Automatically add customerId to request body for create operations
  req.body.customerId = req.user.customerId;
  
  next();
};

module.exports = {
  tenantIsolation,
  addTenantToBody
};