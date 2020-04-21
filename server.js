const express = require('express');
const connectDB = require('./config/db'); //2

const app = express();

//Connect to Database
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

//Using Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
