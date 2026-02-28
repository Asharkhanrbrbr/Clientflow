import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }, // Will be hashed
  role: { type: String, enum: ['admin', 'freelancer'], default: 'freelancer' },
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.model('User', userSchema);
