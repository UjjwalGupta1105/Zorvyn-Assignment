// small helper for consistent error responses
// TODO: use this more consistently across controllers
function sendError(res, statusCode, msg) {
  return res.status(statusCode).json({ message: msg });
}

module.exports = { sendError };
