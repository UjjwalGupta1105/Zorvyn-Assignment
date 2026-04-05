// manual validation - didn't use any library, keeping it simple

const validateUser = (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "name, email, and password are required" });
  }

  // just a basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  const validRoles = ["viewer", "analyst", "admin"];
  if (role && !validRoles.includes(role)) {
    return res.status(400).json({ message: "Role must be viewer, analyst, or admin" });
  }

  next();
};

const validateRecord = (req, res, next) => {
  const { amount, type, category, date } = req.body;

  if (!amount && amount !== 0) {
    return res.status(400).json({ message: "amount is required" });
  }

  if (isNaN(amount) || Number(amount) < 0) {
    return res.status(400).json({ message: "amount must be a non-negative number" });
  }

  if (!type) {
    return res.status(400).json({ message: "type is required (income or expense)" });
  }

  if (!["income", "expense"].includes(type)) {
    return res.status(400).json({ message: "type must be income or expense" });
  }

  if (!category) {
    return res.status(400).json({ message: "category is required" });
  }

  if (!date) {
    return res.status(400).json({ message: "date is required" });
  }

  // make sure the date string is actually parseable
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({ message: "Invalid date format" });
  }

  next();
};

module.exports = { validateUser, validateRecord };
