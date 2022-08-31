const express = require("express");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middle_ware/auth");

const authRouter = express.Router();

const authToken = "x-auth-token";
const publicKey = 'passwordKey';

authRouter.post("/api/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ msg: "User with email does not exist!! Create an account" });
    }
    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect password" });
    }

    //verify user
    const token = jwt.sign({ id: user._id }, publicKey);
    res.json({ token, ...user._doc });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

authRouter.post("/api/signup", async (req, res) => {
  try {
    //get data from client
    //match/get the request from user
    const { name, email, password } = req.body;

    //post data to database
    const existingUser = await User.findOne({ email });

    //check if user already exist
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User with the same email already exist!" });
    }

    const hashPassword = await bcryptjs.hash(password, 8);

    let user = new User({ email, password: hashPassword, name });

    user = await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  //return data to the user
});

// token is valid
authRouter.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header(authToken);
    if (!token) return res.json({'no token':false});
    const verified = jwt.verify(token, publicKey);
    if (!verified) return res.json({'token not verify':false});
    const user = await User.findById(verified.id);
    if (!user) return res.json({'cant find user':false});
    res.json(true);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//GET user data
authRouter.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({ ...user._doc, token: req.token });
});

module.exports = authRouter;
