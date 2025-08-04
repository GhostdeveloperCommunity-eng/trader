const jwt = require("jsonwebtoken");
const configs = require("../configs.json");
const dbUtils = require("../utils/db_operations");
const DATABASE_COLLECTIONS = configs.CONSTANTS.DATABASE_COLLECTIONS;

module.exports.generateToken = ({ email, id, role }) => {
    const secretKey = configs.JWT_SECRET;
    const payload = { email, id, role };
    const options = { expiresIn: configs.JWT_ACCESS_TOKEN_EXPIRY };
    const token = jwt.sign(payload, secretKey, options);
    return token;
};

module.exports.validateJwt = (req, res, next) => {
    const secretKey = configs.JWT_SECRET;
    const authHeader = req.headers["authorization"];
    let token = undefined;
    if (authHeader) {
        const [bearer, accessToken] = authHeader?.split(" ");
        if (bearer === "Bearer" && accessToken) {
            token = accessToken;
        }
    }

    if (!token) {
        return res.status(403).json({
            error: "Please provide accessToken.",
        });
    }
    try {
        const decodedToken = jwt.verify(token, secretKey);
        req.decodedToken = decodedToken;
        console.log(decodedToken);

        next();
    } catch (err) {
        return res.status(403).json({
            error: "Invalid accessToken provided.",
        });
    }
};

module.exports.validateRole = (roles) => {
    return (req, res, next) => {
        const userRoles = req.decodedToken.role;
        const hasAccess = userRoles.some((role) => roles.includes(role));
        if (!hasAccess) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        return next();
    };
};
