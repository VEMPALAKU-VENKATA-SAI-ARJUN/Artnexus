const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    console.log("Authorization header:", req.headers.authorization);

    // 👉 Log incoming cookies
    console.log("Cookies:", req.cookies); // <== ADD THIS HERE
    let token = req.headers.authorization?.startsWith("Bearer ") 
        ? req.headers.authorization.split(" ")[1] 
        : req.cookies?.token;

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not defined in environment variables");
        return res.status(500).json({ error: "Internal server error" });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        console.log("✅ Verified user from token:", verified);
        
        next();
    } catch (err) {
        console.error(`Token verification failed: ${err.message}`);
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token has expired. Please login again." });
        }
        res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = authMiddleware;
