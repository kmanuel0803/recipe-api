const User = require('./user');
const Recipe = require('./recipe');

// Define relationship
User.hasMany(Recipe, { foreignKey: 'UserId', as: 'recipes' });
Recipe.belongsTo(User, { foreignKey: 'UserId', as: 'user' });

module.exports = { User, Recipe };
