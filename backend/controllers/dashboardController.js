import Invoice from '../models/Invoice.js';
import Project from '../models/Project.js';
import dayjs from 'dayjs';

export const getSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;
    // Total revenue (sum of paid invoices)
    const totalRevenue = await Invoice.aggregate([
      { $match: { userId, status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    // Unpaid invoices count
    const unpaidCount = await Invoice.countDocuments({ userId, status: 'unpaid' });
    // Active projects count
    const activeProjects = await Project.countDocuments({ userId, status: 'active' });
    // Monthly revenue aggregation (last 12 months)
    const start = dayjs().subtract(11, 'month').startOf('month').toDate();
    const monthlyRevenue = await Invoice.aggregate([
      { $match: { userId, status: 'paid', issueDate: { $gte: start } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$issueDate' } },
        total: { $sum: '$amount' },
      } },
      { $sort: { _id: 1 } },
    ]);
    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      unpaidInvoices: unpaidCount,
      activeProjects,
      monthlyRevenue,
    });
  } catch (err) {
    next(err);
  }
};
