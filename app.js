const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Importing DB
const sequelize = require('./database/db');
const User = require('./models/User');
const Recipe = require('./models/recipes');
const Follow = require('./models/follow');
const Save = require('./models/save');

// Routes
const accountRoute = require('./routes/accountRoutes');
const userRoute = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes'); // Uncomment if needed
const recipeRoute = require('./routes/recipesRoutes');
const ratingRoute = require('./routes/ratingRoutes');
const adminRoute = require('./routes/adminRoutes');

// Middleware
app.use(cors({
    origin: '*' // Consider restricting this in production
}));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Serve static files from the views directory if necessary
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});



// Connect routes
app.use('/admin', adminRoute);
app.use('/rate', ratingRoute);
app.use('/home', recipeRoute);
app.use('/user', userRoute);
app.use('/account', accountRoute);
// app.use('/upload', uploadRoutes); // Uncomment if needed

// DB relations
User.hasMany(Recipe, { foreignKey: 'userId' });
Recipe.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Save, { foreignKey: 'userId' });
Save.belongsTo(User, { foreignKey: 'userId' });

Recipe.hasMany(Save, { foreignKey: 'recipeId' });
Save.belongsTo(Recipe, { foreignKey: 'recipeId' });

// Sync database and start server
sequelize.sync({ force: false, alter: false })
    .then(() => {
        app.listen(4000, () => {
            console.log('Server is running on port 4000');
        });
    })
    .catch(err => console.error('Failed to sync database:', err));
