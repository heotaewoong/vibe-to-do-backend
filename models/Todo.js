import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    done: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

todoSchema.index({ createdAt: -1 });

// Avoid OverwriteModelError in dev/watch
export default mongoose.models.Todo || mongoose.model('Todo', todoSchema);
