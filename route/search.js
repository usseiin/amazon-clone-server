const express = require("express");
const {Product} = require("../models/product");
const auth = require("../middle_ware/auth");

const searchRouter = express.Router();

searchRouter.get(
  "/api/products/search/:searchValue",
  auth,
  async (req, res) => {
    try {
      const search = req.params.searchValue;

      let product = await Product.find({
        name: { $regex: search, $options: "i" },
      });
      res.status(200).json(product);
    } catch (error) {
      res.status(200).json({ error: error.message });
    }
  }
);

module.exports= searchRouter;