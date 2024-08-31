const User = require('../models/User');
const Recipe = require('../models/recipes');

// exports.getUsers = async (req, res) => {
//     try {
//         const userId = req.user?.id; // Safely access userId
        
//         console.log('User ID:', userId); // Log user ID

//         if (!userId) {
//             return res.status(400).json({ error: 'Invalid user ID' });
//         }

//         const adminStatus = await isAdmin(userId);
//         console.log('Admin Status:', adminStatus); // Log admin status

//         if (!adminStatus) {
//             return res.status(403).json({ error: 'Unauthorized' });
//         }

//         const users = await User.findAll();
//         console.log('Users fetched:', users); // Log fetched users

//         res.json(users);
//     } catch (error) {
//         console.error('Error fetching users:', error.message, error.stack); // Log detailed error info
//         res.status(500).json({ error: 'Error fetching users' });
//     }
// };

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
};



exports.getRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.findAll();
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching recipes' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log('Deleting User ID:', userId); // Log the user ID being deleted

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const user = await User.destroy({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error.message, error.stack); // Log detailed error info
        res.status(500).json({ error: 'Error deleting user' });
    }
};

exports.deleteRecipe = async (req, res) => {
    try {
        const recipeId = req.params.id;
        console.log('Deleting Recipe ID:', recipeId); // Log the recipe ID being deleted

        if (!recipeId) {
            return res.status(400).json({ error: 'Recipe ID is required' });
        }

        const recipe = await Recipe.destroy({ where: { id: recipeId } });
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        console.error('Error deleting recipe:', error.message, error.stack); // Log detailed error info
        res.status(500).json({ error: 'Error removing recipe' });
    }
};

async function isAdmin(userId) {
    try {
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        return user.isAdmin;
    } catch (err) {
        console.error(err);
        throw err;
    }
}