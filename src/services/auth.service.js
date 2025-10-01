const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getPool } = require("../db/index");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
      session: false
    },
    async (req, username, password, done) => {
      try {
        const db = req.db;
        const { rows } = await db.query(
          "SELECT id, username, password_hash FROM users WHERE LOWER(username)=LOWER($1) LIMIT 1",
          [username]
        );
        const user = rows[0];
        if (!user) return done(null, false, { message: "Invalid credentials" });

        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) return done(null, false, { message: "Invalid credentials" });

        return done(null, { id: user.id, username: user.username, tenant: req.tenant });
      } catch (err) {
        return done(err);
      }
    }
  )
);

const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
  passReqToCallback: true
};

passport.use(
  new JwtStrategy(jwtOpts, async (req, payload, done) => {
    try {
      if (!payload.tenant || payload.tenant !== req.params.tenant) {
        return done(null, false);
      }

      const db = getPool(payload.tenant);
      const { rows } = await db.query(
        "SELECT id, username FROM users WHERE id=$1 LIMIT 1",
        [payload.id]
      );
      const user = rows[0];
      if (!user) return done(null, false);

      return done(null, { id: user.id, username: user.username, tenant: payload.tenant });
    } catch (err) {
      return done(err, false);
    }
  })
);

module.exports = passport;
module.exports.signToken = signToken;
