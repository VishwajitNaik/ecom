import mongoose from 'mongoose';

const adminTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fcmToken: {
    type: String,
    required: true,
  },
  deviceInfo: {
    type: String,
    default: 'unknown',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Compound index to ensure one token per user-device combination
adminTokenSchema.index({ userId: 1, fcmToken: 1 }, { unique: true });

const AdminToken = mongoose.models.AdminToken || mongoose.model('AdminToken', adminTokenSchema);

export default AdminToken;