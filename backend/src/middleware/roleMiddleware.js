// role check middleware - used to restrict routes by role

const allowRoles = (...allowedRoles) => {
  return function(req, res, next) {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // simple check - is the user's role in the allowed list?
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. You don't have permission to do this.",
      });
    }

    next();
  };
};

// check if the account is still active
const isActive = (req, res, next) => {
  if (req.user && req.user.status === "inactive") {
    return res.status(403).json({ message: "Your account is inactive." });
  }
  next();
};

module.exports = { allowRoles, isActive };
