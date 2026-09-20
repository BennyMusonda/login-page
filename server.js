require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const app = express();

// Allow Express to read form data
app.use(express.urlencoded({ extended: true }));

// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Test MySQL connection
db.connect((err) => {
    if (err) {
        console.error('MySQL connection failed:', err);
        return;
    }

    console.log('Connected to MySQL!');
});

// REGISTER
app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check that fields were provided
        if (!email || !password) {
            return res.status(400).send('Email and password are required');
        }

        // Hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        // Save user to database
        const sql = `
            INSERT INTO users (email, password_hash)
            VALUES (?, ?)
        `;

        db.query(sql, [email, passwordHash], (err, result) => {
            if (err) {
                console.error(err);

                // Duplicate email
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).send('Email already registered');
                }

                return res.status(500).send('Registration failed');
            }

            res.send('Registration successful!');
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Start server
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
