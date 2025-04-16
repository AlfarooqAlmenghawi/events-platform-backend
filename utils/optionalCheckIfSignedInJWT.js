const SQL_DATABASE = require("../database/connection");

const JWT = require("jsonwebtoken");

const optionalCheckIfSignedInJWT = async (request, response, next) => {
  try {
    const token = request.header("Authorization")?.split(" ")[1];

    if (!token) {
      request.user = null; // No token, user is not signed in
      return next(); // Proceed to the next middleware
    }

    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    const result = await SQL_DATABASE.query(
      "SELECT id, first_name, last_name, email, join_date, email_verified FROM users WHERE id = $1",
      [decoded.id]
    );

    if (result.rows.length === 0) {
      request.user = null; // Token is invalid, user is not signed in
      return next(); // Proceed to the next middleware
    }

    request.user = result.rows[0]; // Use fresh DB data
    next();
  } catch (error) {
    request.user = null; // Token is invalid or expired, user is not signed in
    console.error("JWT Auth Error:", error);
    return next(); // Proceed to the next middleware
  }
};

module.exports = optionalCheckIfSignedInJWT;
