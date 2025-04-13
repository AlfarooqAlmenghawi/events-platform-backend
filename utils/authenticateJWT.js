const SQL_DATABASE = require("../database/connection");

const JWT = require("jsonwebtoken");

const authenticateJWT = async (request, response, next) => {
  try {
    const token = request.header("Authorization")?.split(" ")[1];

    if (!token) {
      return response
        .status(401)
        .json({ error: "Unauthorized: No token provided" });
    }

    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    const result = await SQL_DATABASE.query(
      "SELECT id, first_name, last_name, email, join_date, email_verified FROM users WHERE id = $1",
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return response.status(404).json({ error: "User not found" });
    }

    request.user = result.rows[0]; // Use fresh DB data
    next();
  } catch (error) {
    console.error("JWT Auth Error:", error);
    return response.status(403).json({ error: "Invalid or expired token" });
  }
};

module.exports = authenticateJWT;
