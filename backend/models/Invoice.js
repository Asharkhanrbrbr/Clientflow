import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  amount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['paid', 'unpaid', 'overdue'], default: 'unpaid' },
  issueDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.model('Invoice', invoiceSchema);
