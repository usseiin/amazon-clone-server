const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authToken = "x-auth-token";
const publicKey = "passwordKey";

const admin = async (req, res, next) => {

  try {
    
    const token = req.header(authToken);

    if (!token) {

      return res.status(401).json({ msg: "No auth token, access denialed" });

    }

    const verified = jwt.verify(token, publicKey);

    if (!verified) {

      return res
        .status(401)
        .json({ msg: "token berification failed, authouriztion denied" });

    }

    const user = await User.findById(verified.id);

    if (user.type == "user" || user.type == "seller") {

      return res.status(401).json({ msg: "You are not an admin" });

    }

    req.user = verified.id;

    req.token = token;

    next();

  } catch (e) {

    res.status(500).json({ error: e.message });

  }

};

module.exports = admin;
