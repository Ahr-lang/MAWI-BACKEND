require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");

const passport = require("./handlers/auth");
const userRoutes = require("./routes/user");
const { connectDB } = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDB();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(
      session({
        name: "sid",
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          sameSite: "lax",
          secure: false
        },
      })
    );

    app.use(passport.initialize());
    app.use(passport.session());

    app.use("/api", userRoutes);
    app.use((_req, res) => res.status(404).json({ error: "Not found" }));

    app.listen(PORT, () => {
      console.log(`Auth API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error.message);
    process.exit(1);
  }
}

startServer();
