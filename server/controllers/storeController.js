const { Store, User, Rating } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../database/config');

// Get all stores (for admin or normal users)
exports.getAllStores = async (req, res) => {
  try {
    const { name, address } = req.query;
    const where = {};
    
    // Apply filters if provided
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    const stores = await Store.findAll({
      where,
      attributes: [
        'id', 
        'name', 
        'email', 
        'address', 
        'ownerId',
        [sequelize.fn('AVG', sequelize.col('Ratings.rating')), 'averageRating'],
        [sequelize.fn('COUNT', sequelize.col('Ratings.id')), 'ratingCount']
      ],
      include: [
        {
          model: User,
          as: 'Owner',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Rating,
          attributes: []
        }
      ],
      group: ['Store.id'],
      order: [['name', 'ASC']]
    });

    // If request is from a logged-in user, include their rating for each store
    if (req.user && req.user.role === 'user') {
      const userRatings = await Rating.findAll({
        where: { userId: req.user.id },
        attributes: ['storeId', 'rating']
      });

      const userRatingsMap = userRatings.reduce((acc, rating) => {
        acc[rating.storeId] = rating.rating;
        return acc;
      }, {});

      const storesWithUserRating = stores.map(store => {
        const storeData = store.toJSON();
        return {
          ...storeData,
          userRating: userRatingsMap[store.id] || null
        };
      });

      return res.json({
        success: true,
        count: stores.length,
        stores: storesWithUserRating
      });
    }

    res.json({
      success: true,
      count: stores.length,
      stores
    });
  } catch (error) {
    console.error('Get all stores error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get store by ID
exports.getStoreById = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'Owner',
        attributes: ['id', 'name', 'email']
      }, {
        model: Rating,
        include: [{
          model: User,
          attributes: ['id', 'name', 'email']
        }]
      }]
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Calculate average rating
    const ratings = store.Ratings || [];
    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

    // If request is from a logged-in user, include their rating
    let userRating = null;
    if (req.user && req.user.role === 'user') {
      const rating = ratings.find(r => r.userId === req.user.id);
      if (rating) userRating = rating.rating;
    }

    res.json({
      success: true,
      store: {
        ...store.toJSON(),
        averageRating,
        ...(userRating !== null && { userRating })
      }
    });
  } catch (error) {
    console.error('Get store by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Create new store (for admin)
exports.createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    // Check if store already exists
    let store = await Store.findOne({ where: { email } });
    if (store) {
      return res.status(400).json({
        success: false,
        message: 'Store already exists'
      });
    }

    // Check if owner exists and is a store owner
    const owner = await User.findByPk(ownerId);
    if (!owner || owner.role !== 'store_owner') {
      return res.status(400).json({
        success: false,
        message: 'Invalid store owner ID'
      });
    }

    // Create new store
    store = await Store.create({
      name,
      email,
      address,
      ownerId
    });

    res.status(201).json({
      success: true,
      store
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update store (for admin)
exports.updateStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;
    const store = await Store.findByPk(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Check if new owner exists and is a store owner
    if (ownerId) {
      const owner = await User.findByPk(ownerId);
      if (!owner || owner.role !== 'store_owner') {
        return res.status(400).json({
          success: false,
          message: 'Invalid store owner ID'
        });
      }
    }

    // Update store fields
    if (name) store.name = name;
    if (email) store.email = email;
    if (address) store.address = address;
    if (ownerId) store.ownerId = ownerId;

    await store.save();

    res.json({
      success: true,
      message: 'Store updated successfully',
      store
    });
  } catch (error) {
    console.error('Update store error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete store (for admin)
exports.deleteStore = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    await store.destroy();

    res.json({
      success: true,
      message: 'Store deleted successfully'
    });
  } catch (error) {
    console.error('Delete store error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get store owner dashboard data (for store owner)
exports.getStoreOwnerData = async (req, res) => {
  try {
    const stores = await Store.findAll({
      where: { ownerId: req.user.id },
      attributes: [
        'id', 
        'name', 
        'email', 
        'address',
        [sequelize.fn('AVG', sequelize.col('Ratings.rating')), 'averageRating'],
        [sequelize.fn('COUNT', sequelize.col('Ratings.id')), 'ratingCount']
      ],
      include: [{
        model: Rating,
        attributes: []
      }],
      group: ['Store.id']
    });

    // Get users who rated the store owner's stores
    const storeIds = stores.map(store => store.id);
    const ratingUsers = await Rating.findAll({
      where: { storeId: { [Op.in]: storeIds } },
      include: [{
        model: User,
        attributes: ['id', 'name', 'email']
      }],
      attributes: [
        'id', 
        'rating', 
        'storeId',
        'createdAt'
      ],
      order: [['createdAt', 'DESC']]
    });

    // Overall average rating across all stores
    const overallAverageRating = stores.length > 0
      ? stores.reduce((sum, store) => {
          const avg = parseFloat(store.getDataValue('averageRating')) || 0;
          return sum + avg;
        }, 0) / stores.length
      : 0;

    res.json({
      success: true,
      data: {
        stores,
        ratingUsers,
        overallAverageRating
      }
    });
  } catch (error) {
    console.error('Get store owner data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

 