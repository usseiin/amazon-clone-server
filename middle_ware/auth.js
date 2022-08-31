const jwt = require("jsonwebtoken");
const authToken = 'x-auth-token';
const publicKey = 'passwordKey';

const auth = async (req, res, next) => {

  try {

    const token = req.header(authToken);

    if (!token) return res.status(401).json({ msg: "No auth token, access denied" });

    const verified = jwt.verify(token, publicKey);

    if (!verified)
      return res
        .status(401)
        .json({ msg: "token verification failed, authorization denial" });

    req.user= verified.id;
    
    req.token = token;
    // run the next call ack function
    next();

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


module.exports = auth;