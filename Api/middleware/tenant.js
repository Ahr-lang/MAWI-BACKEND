const { getPool, TENANTS } = require("../db");

function useTenant(req, res, next) {
  const { tenant } = req.params;

  if (!tenant || !TENANTS[tenant]) {
    return res.status(400).json({ error: "Invalid tenant." });
  }

  try {
    req.tenant = tenant;
    req.db = getPool(tenant);
    next();
  } catch (err) {
    console.error("[Tenant] Error setting DB:", err.message);
    res.status(500).json({ error: "Failed to connect to tenant database" });
  }
}

module.exports = { useTenant };
