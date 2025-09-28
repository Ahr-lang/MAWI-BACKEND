const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { getPool } = require("../db");

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      session: true,
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const db = req.db;
        const { rows } = await db.query(
          "SELECT id, username, password_hash FROM users WHERE LOWER(username)=LOWER($1) LIMIT 1",
          [username]
        );

        const user = rows[0];
        if (!user) return done(null, false, { message: "Invalid username or password" });

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return done(null, false, { message: "Invalid username or password" });

        return done(null, { id: user.id, username: user.username, tenant: req.tenant });
      } catch (err) {
        console.error("[Auth] Login error:", err.message);
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, { id: user.id, tenant: user.tenant });
});

passport.deserializeUser(async (key, done) => {
  try {
    const db = getPool(key.tenant);
    const { rows } = await db.query(
      "SELECT id, username FROM users WHERE id=$1 LIMIT 1",
      [key.id]
    );

    const user = rows[0];
    if (!user) return done(null, false);
    done(null, { id: user.id, username: user.username, tenant: key.tenant });
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
