import Client from '../models/Client.js';

// Create a new client
export const createClient = async (req, res, next) => {
  try {
    const { name, email, company, phone, notes } = req.body;
    const exists = await Client.findOne({ email, userId: req.user._id });
    if (exists) {
      return res.status(409).json({ message: 'Client with this email already exists.' });
    }
    const client = await Client.create({
      name,
      email,
      company,
      phone,
      notes,
      userId: req.user._id,
    });
    res.status(201).json({ client });
  } catch (err) {
    next(err);
  }
};

// Get clients with search, pagination
export const getClients = async (req, res, next) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    const query = {
      userId: req.user._id,
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ],
    };
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [clients, total] = await Promise.all([
      Client.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Client.countDocuments(query),
    ]);
    res.json({
      clients,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

// Get single client
export const getClient = async (req, res, next) => {
  try {
    const client = await Client.findOne({ _id: req.params.id, userId: req.user._id });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json({ client });
  } catch (err) {
    next(err);
  }
};

// Update client
export const updateClient = async (req, res, next) => {
  try {
    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json({ client });
  } catch (err) {
    next(err);
  }
};

// Delete client
export const deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json({ message: 'Client deleted' });
  } catch (err) {
    next(err);
  }
};
