const bcrypt = require("bcrypt");
const passport = require("passport");

function ensureAuthenticated(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.user?.tenant !== req.params.tenant) {
    return res.status(403).json({ error: "Access denied for this tenant" });
  }

  next();
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
      tenant: req.tenant,
    });
  } catch (err) {
    console.error("[Register] Error:", err.message);
    return res.status(500).json({ error: "Server error during registration" });
  }
}

function login(req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("[Login] Error:", err.message);
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ error: info?.message || "Invalid credentials" });
    }

    req.logIn(user, (err2) => {
      if (err2) return next(err2);

      req.session.tenant = req.tenant;

      return res.json({
        message: "Login successful",
        user,
        tenant: req.tenant,
      });
    });
  })(req, res, next);
}

function me(req, res) {
  return res.json({
    authenticated: true,
    user: req.user,
    tenant: req.user?.tenant,
  });
}

function logout(req, res, next) {
  req.logout((err) => {
    if (err) {
      console.error("[Logout] Error:", err.message);
      return next(err);
    }

    req.session.destroy((destroyErr) => {
      if (destroyErr) {
        console.error("[Logout] Session destroy error:", destroyErr.message);
      }
      res.json({ message: "Logged out successfully" });
    });
  });
}

module.exports = {
  ensureAuthenticated,
  register,
  login,
  me,
  logout,
};
