//import form package
const { json } = require("express");
const express = require("express");
const mongoose = require("mongoose");

const DB =
  "mongodb+srv://usseiin:qwerty12@cluster0.yh34xgs.mongodb.net/?retryWrites=true&w=majority";

//Import from other files
const authRouter = require("./route/auth");
const adminRouter = require('./route/admin');
const productRouter = require('./route/product');
const searchRouter = require('./route/search');
const userRouter = require('./route/user');

//creating a API
//get put post delete update => crud

const PORT = process.env.PORT;

//init
const app = express();

//middleware
//client -> middleware server -> client
app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(searchRouter);
app.use(userRouter);

//connect to database (mongodb)
mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((error) => {
    console.log(`Catched db error: =>\n${error}`);
  });

//listen to the localhost port
app.listen(PORT,() => {
  console.log(`connected at port ${PORT}`);
});
