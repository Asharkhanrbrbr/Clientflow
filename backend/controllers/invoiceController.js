import Invoice from '../models/Invoice.js';
import dayjs from 'dayjs';

// Helper: auto-mark overdue
async function autoMarkOverdue(invoice) {
  if (invoice.status === 'unpaid' && dayjs(invoice.dueDate).isBefore(dayjs(), 'day')) {
    invoice.status = 'overdue';
    await invoice.save();
  }
}

// Create a new invoice
export const createInvoice = async (req, res, next) => {
  try {
    const { projectId, amount, status, issueDate, dueDate } = req.body;
    const invoice = await Invoice.create({
      projectId,
      amount,
      status,
      issueDate,
      dueDate,
      userId: req.user._id,
    });
    await autoMarkOverdue(invoice);
    res.status(201).json({ invoice });
  } catch (err) {
    next(err);
  }
};

// Get invoices with filtering, pagination
export const getInvoices = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { userId: req.user._id };
    if (status) query.status = status;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [invoices, total] = await Promise.all([
      Invoice.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Invoice.countDocuments(query),
    ]);
    // Auto-mark overdue for all fetched invoices
    await Promise.all(invoices.map(autoMarkOverdue));
    res.json({
      invoices,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

// Get single invoice
export const getInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, userId: req.user._id });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    await autoMarkOverdue(invoice);
    res.json({ invoice });
  } catch (err) {
    next(err);
  }
};

// Update invoice
export const updateInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    await autoMarkOverdue(invoice);
    res.json({ invoice });
  } catch (err) {
    next(err);
  }
};

// Delete invoice
export const deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    next(err);
  }
};
