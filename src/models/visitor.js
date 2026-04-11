import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Visitor = mongoose.models.Visitor || mongoose.model('Visitor', visitorSchema);

export default Visitor;