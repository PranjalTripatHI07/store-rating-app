const { Rating, Store, User } = require('../models');

// Submit a new rating or update existing (for normal users)
exports.submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    // Check if store exists
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Check if rating already exists for this user and store
    let existingRating = await Rating.findOne({
      where: { userId, storeId }
    });

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      await existingRating.save();

      return res.json({
        success: true,
        message: 'Rating updated successfully',
        rating: existingRating
      });
    }

    // Create new rating
    const newRating = await Rating.create({
      rating,
      userId,
      storeId
    });

    res.status(201).json({
      success: true,
      message: 'Rating submitted successfully',
      rating: newRating
    });
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get user's rating for a specific store (for normal users)
exports.getUserRatingForStore = async (req, res) => {
  try {
    const { storeId } = req.params;
    const userId = req.user.id;

    const rating = await Rating.findOne({
      where: { userId, storeId }
    });

    if (!rating) {
      return res.json({
        success: true,
        message: 'No rating found',
        rating: null
      });
    }

    res.json({
      success: true,
      rating
    });
  } catch (error) {
    console.error('Get user rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete a rating (for normal users or admin)
exports.deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    
    const rating = await Rating.findByPk(id);
    
    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }

    // Check if user is authorized to delete this rating
    // (either the user who submitted it or an admin)
    if (req.user.role !== 'admin' && rating.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this rating'
      });
    }

    await rating.destroy();

    res.json({
      success: true,
      message: 'Rating deleted successfully'
    });
  } catch (error) {
    console.error('Delete rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 