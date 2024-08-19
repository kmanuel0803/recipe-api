const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
const recipeRoutes = require('./routes/recipeRoute'); // Import the route file
const userRoutes = require('./routes/userRoute');
const authRoutes = require('./routes/authRoute');
const UserModel = require('./models/user');
const RecipeModel = require('./models/recipe');

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes and apply them
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/recipe', recipeRoutes);

// Register the models
UserModel.sync();  
RecipeModel.sync();

sequelize.sync().then(() => {
  console.log('Sequelize Initialized!');
  app.listen(PORT, () => {
    console.log('Server listening on PORT:', PORT);
  });
}).catch((err) => {
  console.error('Sequelize Initialization error:', err);
});
