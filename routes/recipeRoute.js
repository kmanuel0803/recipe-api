const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const RecipeController = require("../controllers/RecipeController");
const authMiddleware = require('../middleware/AuthMiddleware');

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Define the folder to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Create a unique file name
  }
});

const upload = multer({ storage });

router.use(authMiddleware);

router.get(
  "/",
  RecipeController.getRecipes
);

router.get(
  "/:recipeId",
  RecipeController.getRecipeById
);

router.post(
  "/",  upload.single('photo'),
  RecipeController.createRecipe
);

router.put(
  "/:recipeId", upload.single('photo'),
  RecipeController.updateRecipe
);

router.delete(
  "/:recipeId",
  RecipeController.deleteRecipe
);
  
module.exports = router;