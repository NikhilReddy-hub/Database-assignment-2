require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { resolve } = require("path");
const bcrypt = require("bcrypt");
const User = require("./models/User"); // Import the User model

const app = express();
const port = 3010;

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(express.static("static"));

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Connection Error:", err));

// Serve index.html
app.get("/", (req, res) => {
    res.sendFile(resolve(__dirname, "pages/index.html"));
});

// Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
