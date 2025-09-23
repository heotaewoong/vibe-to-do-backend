import express from 'express';
import mongoose from 'mongoose';
import Todo from '../models/Todo.js';

const router = express.Router();

// GET /api/todos - list todos
router.get('/', async (_req, res) => {
  try {
    const items = await Todo.find().sort({ createdAt: -1 }).lean();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'list_failed', message: err.message });
  }
});

// POST /api/todos - create a todo
router.post('/', async (req, res) => {
  try {
    const text = String(req.body?.text || '').trim();
    if (!text) return res.status(400).json({ error: 'text_required' });

    const doc = await Todo.create({ text });
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: 'create_failed', message: err.message });
  }
});

// PATCH /api/todos/:id - update a todo
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'invalid_id' });

    const update = {};
    if (typeof req.body.text === 'string') update.text = String(req.body.text).trim();
    if (typeof req.body.done === 'boolean') update.done = req.body.done;

    const doc = await Todo.findByIdAndUpdate(id, update, { new: true });
    if (!doc) return res.status(404).json({ error: 'not_found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: 'update_failed', message: err.message });
  }
});

// DELETE /api/todos/:id - delete a todo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'invalid_id' });

    const r = await Todo.findByIdAndDelete(id);
    if (!r) return res.status(404).json({ error: 'not_found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'delete_failed', message: err.message });
  }
});

export default router;
