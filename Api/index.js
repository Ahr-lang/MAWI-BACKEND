require("dotenv").config();

const express = require("express");
const cors = require("cors");

const passport = require("./handlers/auth");
const userRoutes = require("./routes/user");
const { connectDB } = require("./db");

const app = express();
const PORT = process.env.PORT;

async function startServer() {
  try {
    await connectDB();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(passport.initialize());

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
