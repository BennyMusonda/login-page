const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static HTML files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MySQL Workbench database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '@_Delta123', // Replace with your actual MySQL password
    database: 'user_system'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL Workbench database.');
});

// Handle registration form submission
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Hash the password securely before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
        db.query(sql, [email, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.send('Email already registered.');
                }
                return res.status(500).send('Database error occurred.');
            }
            res.send('Account created successfully! You can now log in.');
        });
    } catch {
        res.status(500).send('Server error processing registration.');
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
