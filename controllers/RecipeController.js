const RecipeModel = require('../models/recipe'); // Adjust the path as needed
const path = require('path');

module.exports = {
  getRecipes: async (req, res) => {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
    const offset = (page - 1) * limit;
    const queryFilters = { UserId: userId };

    try {
      const recipes = await RecipeModel.findAndCountAll({
        where: queryFilters,
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      res.json({
        recipes: recipes.rows,
        total: recipes.count,
        page: parseInt(page),
        limit: parseInt(limit),
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  getRecipeById: async (req, res) => {
    const {
      params: { recipeId },
    } = req;

    try {
      const recipe = await RecipeModel.findOne({ where: { id: recipeId } });
      if (recipe) {
        const photoUrl = recipe.photo ? `${req.protocol}://${req.get('host')}/${recipe.photo}` : null;
        try {
          ingredientsArray = JSON.parse(recipe.ingredients);
        } catch (err) {
          ingredientsArray = []; // Default to empty array if parsing fails
        }

        res.status(200).json({
          status: true,
          data: {
            ...recipe.toJSON(),
            ingredients: ingredientsArray,
            photoUrl,
          },
        });
      } else {
        res.status(404).json({
          status: false,
          error: 'Recipe not found',
        });
      }
    } catch (err) {
      res.status(500).json({
        status: false,
        error: err.message,
      });
    }
  },

  createRecipe: async (req, res) => {
    try {
        const {
          params: { recipeId },
          body: payload,
      } = req;

         // Check if a file is uploaded and add it to payload
        if (req.file) {
          payload.photo = req.file.path;
        }
        payload.UserId = req.user.id;
            
        const recipe = await RecipeModel.create(payload, {
          where: { id: recipeId },
           returning: true, 
        });

        res.status(201).json({
            status: true,
            data: recipe.toJSON()
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            error: err.message
        });
    }
},

updateRecipe: async (req, res) => {
    const {
      params: { recipeId },
      body: payload,
  } = req;

  // Check if a file is uploaded and add it to payload
    if (req.file) {
      payload.photo = req.file.path;
    }

  try {
   
    const existingRecipe = await RecipeModel.findOne({ where: { id: recipeId } });
   
    if (!existingRecipe) {
      return res.status(404).json({
        status: false,
        error: 'Recipe not found',
      });
    }

    const updatedRecipe = await RecipeModel.update(payload, {
      where: { id: recipeId },
      returning: true, 
    });

    // Fetch the updated after the update
    const recipe = await RecipeModel.findOne({ where: { id: recipeId } });

    if(recipe) {
      const photoUrl = recipe.photo ? `${req.protocol}://${req.get('host')}/${recipe.photo}` : null;
      res.status(200).json({
        status: true,
        data: { ...recipe.toJSON(), photoUrl }
      });
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      error: err.message,
    });
  }
},

  deleteRecipe: async (req, res) => {
    const {
      params: { recipeId },
    } = req;

    try {
      const numberOfEntriesDeleted = await RecipeModel.destroy({
        where: { id: recipeId },
      });
      res.status(200).json({
        status: true,
        data: {
          numberOfRecipesDeleted: numberOfEntriesDeleted
        },
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        error: err.message,
      });
    }
  },
};
