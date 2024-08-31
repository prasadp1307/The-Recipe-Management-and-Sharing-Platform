const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const User = require('./User'); // Make sure to use the correct path to the User model

const Recipes = sequelize.define('Recipes', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    cuisine: {
        type: Sequelize.STRING,
    },
    veg: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    recipesType: {
        type: Sequelize.STRING,
        allowNull: false
    },
    recipesName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    imgData: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ingredients: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    method: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cookingTime: {
        type: Sequelize.STRING,
        allowNull: false
    },
    // Foreign key column for user association
    // userId: {
    //     type: Sequelize.INTEGER,
    //     allowNull: false,
    //     references: {
    //         model: User, // This references the User model
    //         key: 'id'
    //     }
    // }
});

// Define Associations
User.hasMany(Recipes, { foreignKey: 'userId' }); // A user can have many recipes
Recipes.belongsTo(User, { foreignKey: 'userId' }); // Each recipe belongs to one user

module.exports = Recipes;
