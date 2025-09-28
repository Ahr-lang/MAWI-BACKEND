const { Router } = require("express");
const { useTenant } = require("../middleware/tenant");
const { ensureAuthenticated, register, login, me, logout } = require("../controllers/user");

const router = Router();

router.post("/:tenant/users/register", useTenant, register);
router.post("/:tenant/users/login", useTenant, login);
router.get("/:tenant/users/me", useTenant, ensureAuthenticated, me);
router.post("/:tenant/users/logout", useTenant, ensureAuthenticated, logout);

module.exports = router;
