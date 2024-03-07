const { to } = require("../helpers/to_promise");
const myJwt = require("../services/jwt_service");
const pool = require("../config/db");

module.exports = async function (req, res, next) {
  
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res
        .status(403)
        .json({ message: "Admin not found(no authorization)" });
    }
    const bearer = authorization.split(" ")[0];
    const token = authorization.split(" ")[1];

    if (bearer != "Bearer" || !token) {
      return res
        .status(403)
        .json({ message: "Admin not found(token berilmagan)" });
    }
    const [error, decodedToken] = await to(myJwt.verifyAccessToken(token));
    if (error) {
      return res.status(403).json({ message: error.message });
    }
    req.adminToken = decodedToken;
    console.log(req.adminToken);

    const { is_creator } = decodedToken;
    if (!is_creator) {
      return res.status(401).json({ message: "Insufficient privileges" });
    }

    next();
  } catch (error) {
    console.log("error police", error);
    return res.status(403).json({ message: "Admin not found(token noto'g'ri" });
  }
};
