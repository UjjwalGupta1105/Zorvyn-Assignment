// Not using JWT here since this is a demo/assignment project.
// The client just sends a userId in the header and we look it up in the db.
// In a real app you'd verify a token instead.

const User = require("../models/User");

async function authenticate(req, res, next) {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({ message: "Please provide x-user-id header" });
    }

    const foundUser = await User.findById(userId).select("-password");

    if (!foundUser) {
      return res.status(401).json({ message: "User not found" });
    }

    // blocked users shouldn't be able to do anything
    if (foundUser.status === "inactive") {
      return res.status(403).json({ message: "Your account is inactive" });
    }

    req.user = foundUser;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid user id" });
  }
}

module.exports = authenticate;
