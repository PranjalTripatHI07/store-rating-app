const { User, Store, Rating } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../database/config');

// Get all users (for admin)
exports.getAllUsers = async (req, res) => {
  try {
    const { name, email, address, role } = req.query;
    const where = {};
    
    // Apply filters if provided
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };
    if (role) where.role = role;

    const users = await User.findAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get user by ID (for admin)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // If user is a store owner, get their store rating
    let rating = null;
    if (user.role === 'store_owner') {
      const stores = await Store.findAll({
        where: { ownerId: user.id },
        include: [{
          model: Rating,
          attributes: []
        }],
        attributes: [
          'id',
          [sequelize.fn('AVG', sequelize.col('Ratings.rating')), 'averageRating']
        ],
        group: ['Store.id']
      });

      if (stores.length > 0) {
        rating = stores.reduce((acc, store) => {
          return acc + (parseFloat(store.getDataValue('averageRating')) || 0);
        }, 0) / stores.length;
      }
    }

    res.json({
      success: true,
      user: {
        ...user.toJSON(),
        ...(rating !== null && { rating })
      }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Create new user (for admin)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    // Check if user already exists
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create new user
    user = await User.create({
      name,
      email,
      password,
      address,
      role
    });

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update user (for admin)
exports.updateUser = async (req, res) => {
  try {
    const { name, email, address, role } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (address) user.address = address;
    if (role) user.role = role;

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete user (for admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get dashboard data (for admin)
exports.getDashboardData = async (req, res) => {
  try {
    const userCount = await User.count();
    const storeCount = await Store.count();
    const ratingCount = await Rating.count();

    res.json({
      success: true,
      data: {
        totalUsers: userCount,
        totalStores: storeCount,
        totalRatings: ratingCount
      }
    });
  } catch (error) {
    console.error('Get dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 