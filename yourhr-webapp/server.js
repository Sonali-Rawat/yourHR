const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const app = express();

// Middleware for serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parser
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect('mongodb+srv://Sonali:seR6Y3chqREXxI3q@sonaliapi.wrujb.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })

    .then(() => console.log("DB connected"))
    .catch(err => console.error('DB connection error:', err));

// Schema and model for users
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    contact: String,
    qualification: String,
    preference: String,
    resume: String
});
const User = mongoose.model('User', userSchema);

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.post('/signup', upload.single('resume'), async (req, res) => {
    const { name, email, contact, qualification, preference } = req.body;
    const resume = req.file.filename;

    const newUser = new User({ name, email, contact, qualification, preference, resume });

    try {
        await newUser.save(); // Using async/await for save
        res.send('Registration Successful!');
    } catch (err) {
        console.error('Error saving user:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
