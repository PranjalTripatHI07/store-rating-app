const User = require('./User');
const Store = require('./Store');
const Rating = require('./Rating');

// Define relationships
User.hasMany(Rating, { foreignKey: 'userId' });
Rating.belongsTo(User, { foreignKey: 'userId' });

Store.hasMany(Rating, { foreignKey: 'storeId' });
Rating.belongsTo(Store, { foreignKey: 'storeId' });

User.hasMany(Store, { foreignKey: 'ownerId', as: 'OwnedStores' });
Store.belongsTo(User, { foreignKey: 'ownerId', as: 'Owner' });

module.exports = {
  User,
  Store,
  Rating
}; 