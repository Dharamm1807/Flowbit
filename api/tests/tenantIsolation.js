// tests/tenantIsolation.test.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/User');
const Ticket = require('../models/ticket'); // Assuming you have a Ticket model

describe('Tenant Data Isolation', () => {
  let mongoServer;
  let tenantAAdmin;
  let tenantBTicket;

  beforeAll(async () => {
    // Create in-memory MongoDB for testing
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  beforeEach(async () => {
    // Seed test data
    tenantAAdmin = await User.create({
      email: 'admin@logisticsco.com',
      password: 'hashedpass',
      customerId: 'logisticsco',
      role: 'Admin',
      tenantId: 'logisticsco'
    });

    await User.create({
      email: 'admin@retailgmbh.de',
      password: 'hashedpass',
      customerId: 'retailgmbh',
      role: 'Admin',
      tenantId: 'retailgmbh'
    });

    tenantBTicket = await Ticket.create({
      title: 'Retail Ticket',
      description: 'Should be inaccessible',
      tenantId: 'retailgmbh',
      createdBy: 'admin@retailgmbh.de'
    });
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Ticket.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test('Admin from Tenant A cannot see Tenant B tickets', async () => {
    // Mock tenant isolation middleware
    const mockReq = {
      user: tenantAAdmin.toObject(), // LogisticsCo admin
      query: {}
    };

    // Simulate the middleware adding tenant filter
    mockReq.query.tenantId = mockReq.user.tenantId;

    // Attempt to query tickets
    const tickets = await Ticket.find(mockReq.query);

    // Verify results
    expect(tickets.length).toBe(0); // Should find no tickets
    tickets.forEach(ticket => {
      expect(ticket.tenantId).not.toBe('retailgmbh'); // Extra paranoid check
    });
  });

  test('Admin from Tenant A cannot query Tenant B users', async () => {
    const users = await User.find({ tenantId: 'retailgmbh' });
    
    // Should not see RetailGmbH users
    expect(users).not.toContainEqual(
      expect.objectContaining({ email: 'admin@retailgmbh.de' })
    );
  });
});