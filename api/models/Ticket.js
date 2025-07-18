
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['open', 'in-progress', 'closed'], default: 'open' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  customerId: { type: String, required: true }, // Tenant identifier
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamp on save
ticketSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add tenant isolation to all queries
ticketSchema.pre(/^find/, function(next) {
  // Only apply tenant filter if it's not already set
  if (!this.getQuery().customerId && this.tenantId) {
    this.find({ customerId: this.tenantId });
  }
  next();
});

module.exports = mongoose.model('Ticket', ticketSchema);