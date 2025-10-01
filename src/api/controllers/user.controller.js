const bcrypt = require("bcrypt");
const passport = require("passport");
const { signToken } = require("../../services/auth.service");

function ensureAuthenticated(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    req.user = user;
    next();
  })(req, res, next);
}

async function register(req, res) {
  const db = req.db;
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    const { rows: existing } = await db.query(
      "SELECT 1 FROM users WHERE LOWER(username)=LOWER($1) LIMIT 1",
      [username]
    );
    if (existing.length) {
      return res.status(409).json({ error: "Username already taken" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const { rows } = await db.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username",
      [username, passwordHash]
    );

    return res.status(201).json({
      message: "User registered successfully",
      user: rows[0],
      tenant: req.tenant
    });
  } catch (err) {
    console.error("[Register] Error:", err.message);
    return res.status(500).json({ error: "Server error during registration" });
  }
}

function login(req, res, next) {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ error: info?.message || "Invalid credentials" });
    }

    const token = signToken({ id: user.id, username: user.username, tenant: user.tenant });
    return res.json({
      message: "Login successful",
      user,
      token,
      token_type: "Bearer",
      expires_in: process.env.JWT_EXPIRES_IN
    });
  })(req, res, next);
}

function me(req, res) {
  return res.json({
    authenticated: true,
    user: req.user,
    tenant: req.user?.tenant
  });
}

function logout(_req, res) {
  return res.json({ message: "Logged out" });
}

module.exports = { ensureAuthenticated, register, login, me, logout };
