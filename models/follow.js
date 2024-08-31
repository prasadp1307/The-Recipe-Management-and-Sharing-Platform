const sequelize = require('../database/db');
const { DataTypes } = require('sequelize');
const User = require('./User');

const Follow = sequelize.define('Follow', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    followerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    followedId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
});

// Define associations between the User model and the Follow model

User.belongsToMany(User, {
    through: Follow,
    as: 'Followers',
    foreignKey: 'followedId',
    otherKey: 'followerId'
});

User.belongsToMany(User, {
    through: Follow,
    as: 'Following',
    foreignKey: 'followerId',
    otherKey: 'followedId'
});

module.exports = Follow;
