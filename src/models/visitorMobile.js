import mongoose from 'mongoose';

const visitorMobileSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  visitCount: {
    type: Number,
    default: 1,
  },
  lastVisit: {
    type: Date,
    default: Date.now,
  },
  firstVisit: {
    type: Date,
    default: Date.now,
  },
  source: {
    type: String,
    enum: ['buy_now', 'add_to_cart', 'manual'],
    default: 'manual',
  },
  userData: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
  },
}, {
  timestamps: true,
});

const VisitorMobile = mongoose.models.VisitorMobile || mongoose.model('VisitorMobile', visitorMobileSchema);

export default VisitorMobile;
