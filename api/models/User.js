const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  customerId: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    required: true, 
    enum: ['Admin', 'User'],
    default: 'User'
  },
  tenantId: { 
    type: String, 
    required: true,
    lowercase: true}
},
  {timestamps: true }
);

// Add index for efficient tenant queries
userSchema.index({ customerId: 1 });
userSchema.index({ email: 1, customerId: 1 });

module.exports = mongoose.model('User', userSchema);