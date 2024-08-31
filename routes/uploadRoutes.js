const express = require('express');
const router = express.Router();
const Recipes = require('../models/recipes')
const upload = require('../config/upload'); // Adjust path as needed

// Route to add a new recipe with an image
router.post('/add-recipe', upload.single('imgData'), async (req, res) => {
    try {
        const newRecipe = await Recipes.create({
            cuisine: req.body.cuisine,
            veg: req.body.veg === 'true', // Convert from string to boolean
            recipesType: req.body.recipesType,
            recipesName: req.body.recipesName,
            imgData: req.file.path, // Store the path to the uploaded image
            ingredients: req.body.ingredients,
            method: req.body.method,
            cookingTime: req.body.cookingTime,
        });
        res.status(201).json(newRecipe);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while adding the recipe' });
    }
});

module.exports = router;
