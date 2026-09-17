const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse incoming HTML form submissions
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve your CSS and frontend JS files from your project folder
app.use(express.static(__dirname));

// 1. Connect to your MySQL Workbench database instance (Port 3306)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: '@Delta123',
    database: 'user_db' 
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
        return;
    }
    console.log('Successfully connected to MySQL Workbench database.');
});

// 2. Automatically load create.html as your homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'create.html'));
});
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 3. Handle Registration Form Submission (matching action="/register")
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Please provide both an email and a password.');
    }

    try {
        // Securely hash the password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert the credentials into the MySQL database safely
        const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
        
        db.query(sql, [email, hashedPassword], (err, result) => {
            if (err) {
                // Handle duplicate email error safely
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).send('An account with this email already exists.');
                }
                console.error(err);
                return res.status(500).send('Error saving user data to the database.');
            }
            res.send('Account successfully registered!');
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server processing error.');
    }
});

// Start your local server
app.listen(PORT, () => {
    console.log(`Server running smoothly at http://localhost:${PORT}`);
});
