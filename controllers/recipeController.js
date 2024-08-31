// const Recipes = require("../models/recipes");
// const User = require('../models/User');
// const Follow = require('../models/follow');
// const { Op } = require('sequelize');

// exports.getRecipes = async (req, res) => {
//     try {
//         const limit = parseInt(req.query.limit) || 10;
//         const page = parseInt(req.query.page) || 1;
//         const offset = (page - 1) * limit;
//         const searchText = req.query.search || '';
//         // console.log(searchText);
//         const veg = req.query.veg ? (req.query.veg === 'true') : null;
//         const cuisine = req.query.cuisine || '';
//         const recipesType = req.query.recipesType || '';
//         const loggedInUser = req.user.id;

//         let whereCondition = {
//             [Op.or]: [
//                 { recipesName: { [Op.like]: `%${searchText}%` } },
//                 { '$User.name$': { [Op.like]: `%${searchText}%` } }
//             ]
//         };

//         if (veg !== null) {
//             whereCondition.veg = veg;
//         }

//         if (cuisine !== '') {
//             whereCondition.cuisine = cuisine;
//         }

//         if (recipesType !== '') {
//             whereCondition.recipesType = recipesType;
//         }

//         const { count, rows: recipes } = await Recipes.findAndCountAll({
//             limit,
//             offset,
//             include: [
//                 {
//                     model: User,
//                     attributes: ['name']
//                 },

//             ],
//             where: whereCondition
//         });

//         const totalPages = Math.ceil(count / limit);

//         res.json({ recipes, totalPages, currentPage: page, loggedInUser });

//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ message: 'Error in getRecipes', error: err.message });
//     }
// };

// exports.getRecipeById = async (req, res) => {
//     const recipeId = req.params.id;
//     const loggedInUserId = req.user.id;
//     try {
//         const recipe = await Recipes.findOne({
//             where: { id: recipeId },
//             include: [{ model: User, attributes: ['name'] }]
//         });

//         if (!recipe) {
//             return res.status(404).json({ message: 'Recipe not found' });
//         }
//         // console.log(recipe.UserId)
//         const isFollowing = await Follow.findOne({
//             where: {
//                 followerId: loggedInUserId,
//                 followedId: recipe.UserId
//             }
//         });

//         res.json({ recipe, isFollowing: !!isFollowing, loggedInUserId });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Failed to fetch recipe', error: err.message });
//     }
// };


// exports.followUser = async (req, res) => {
//     // const followerId = req.user.id;
//     const followedId = req.params.userId;

//     const { followerId } = req.body; // Or req.query, or req.params depending on your implementation
// if (!followerId) {
//     return res.status(400).json({ error: 'Follower ID is required' });
// }
//     try {
//         await Follow.create({ followerId, followedId });
//         res.json({ message: 'User followed successfully' });
//     } catch (error) {
//         console.error('Error following user:', error);
//         res.status(500).json({ message: 'Failed to follow user', error: error.message });
//     }
// };

// exports.unfollowUser = async (req, res) => {
//     const followerId = req.user.id;
//     const followedId = req.params.userId;

//     try {
//         await Follow.destroy({
//             where: { followerId, followedId }
//         });
//         res.json({ message: 'User unfollowed successfully' });
//     } catch (error) {
//         console.error('Error unfollowing user:', error);
//         res.status(500).json({ message: 'Failed to unfollow user', error: error.message });
//     }
// };


// exports.deleteRecipe = async (req, res) => {
//     const recipeId = req.params.id;
//     const userId = req.user.id;

//     console.log('Attempting to delete recipe');
//     console.log('Recipe ID:', recipeId);
//     console.log('User ID:', userId);

//     try {
//         // Check if the recipe exists and belongs to the user
//         const recipe = await Recipes.findOne({ where: { id: recipeId, UserId: userId } });

//         if (!recipe) {
//             console.log('Recipe not found or user does not have permission to delete');
//             return res.status(404).json({ message: 'Recipe not found or you do not have permission to delete this recipe' });
//         }

//         // Delete the recipe
//         await recipe.destroy();
//         console.log('Recipe deleted successfully');
//         res.json({ message: 'Recipe deleted successfully' });
//     } catch (err) {
//         console.error('Error deleting recipe:', err);
//         res.status(500).json({ message: 'Failed to delete recipe', error: err.message });
//     }
// };



const Recipes = require("../models/recipes");
const User = require('../models/User');
const Follow = require('../models/follow');
const { Op } = require('sequelize');

// Fetch Recipes with Filtering and Pagination
exports.getRecipes = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;
        const searchText = req.query.search || '';
        const veg = req.query.veg ? (req.query.veg === 'true') : null;
        const cuisine = req.query.cuisine || '';
        const recipesType = req.query.recipesType || '';
        const loggedInUser = req.user.userId;

        let whereCondition = {
            [Op.or]: [
                { recipesName: { [Op.like]: `%${searchText}%` } },
                { '$User.name$': { [Op.like]: `%${searchText}%` } }
            ]
        };

        if (veg !== null) {
            whereCondition.veg = veg;
        }

        if (cuisine) {
            whereCondition.cuisine = cuisine;
        }

        if (recipesType) {
            whereCondition.recipesType = recipesType;
        }

        const { count, rows: recipes } = await Recipes.findAndCountAll({
            limit,
            offset,
            include: [
                {
                    model: User,
                    attributes: ['name']
                }
            ],
            where: whereCondition
        });

        const totalPages = Math.ceil(count / limit);
        console.log(`RECIPE USER>>>>>>>>>>>>`,loggedInUser)
        res.json({ recipes, totalPages, page, loggedInUser });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error in getRecipes', error: err.message });
    }
};

// Get Recipe By ID
// exports.getRecipeById = async (req, res) => {
//     const recipeId = req.params.id;
//     const loggedInUserId = req.user.id;
//     try {
//         const recipe = await Recipes.findOne({
//             where: { id: recipeId },
//             include: [{ model: User, attributes: ['name'] }]
//         });

//         if (!recipe) {
//             return res.status(404).json({ message: 'Recipe not found' });
//         }

//         const isFollowing = await Follow.findOne({
//             where: {
//                 followerId: loggedInUserId,
//                 followedId: recipe.UserId
//             }
//         });

//         res.json({ recipe, isFollowing: !!isFollowing, loggedInUserId });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Failed to fetch recipe', error: err.message });
//     }
// };

exports.getRecipeById = async (req, res) => {
    const recipeId = req.params.id;
    const loggedInUserId = req.user.userId;
console.log(recipeId,loggedInUserId);

    try {
        const recipe = await Recipes.findOne({
            where: { id: recipeId },
            include: [{ model: User, attributes: ['name'] }]
        });

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        const isFollowing = await Follow.findOne({
            where: {
                followerId: loggedInUserId,
                followedId: recipeId
            }
        });

        res.json({ recipe, isFollowing: !!isFollowing, loggedInUserId });
    } catch (err) {
        console.error('Error fetching recipe by ID:', err);
        res.status(500).json({ message: 'Failed to fetch recipe', error: err.message });
    }
};



// Follow User
exports.followUser = async (req, res) => {
    // Assuming followerId is retrieved from the authenticated user
    const followerId = req.user?.id; // Using optional chaining to prevent undefined errors
    const followedId = req.params.userId; // Assuming followedId comes from URL params

    // Debugging output to check values
    console.log('Follower ID:', followerId);
    console.log('Followed ID:', followedId);

    // Validate both IDs
    if (!followerId) {
        return res.status(400).json({ error: 'Follower ID is required' });
    }
    if (!followedId) {
        return res.status(400).json({ error: 'Followed ID is required' });
    }

    try {
        await Follow.create({ followerId, followedId });
        res.json({ message: 'User followed successfully' });
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ message: 'Failed to follow user', error: error.message });
    }
};


// Unfollow User
exports.unfollowUser = async (req, res) => {
    const followerId = req.user.id;
    const followedId = req.params.userId;

    try {
        await Follow.destroy({
            where: { followerId, followedId }
        });
        res.json({ message: 'User unfollowed successfully' });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).json({ message: 'Failed to unfollow user', error: error.message });
    }
};

// Delete Recipe
exports.deleteRecipe = async (req, res) => {
    const recipeId = req.params.id;
    const userId = req.user.id;

    console.log('Attempting to delete recipe');
    console.log('Recipe ID:', recipeId);
    console.log('User ID:', userId);

    try {
        const recipe = await Recipes.findOne({ where: { id: recipeId, UserId: userId } });
       
        if (!recipe) {
            console.log('Recipe not found or user does not have permission to delete');
            return res.status(404).json({ message: 'Recipe not found or you do not have permission to delete this recipe' });
        }

        await recipe.destroy();
        console.log('Recipe deleted successfully');
        res.json({ message: 'Recipe deleted successfully' });
    } catch (err) {
        console.error('Error deleting recipe:', err);
        res.status(500).json({ message: 'Failed to delete recipe', error: err.message });
    }
};
