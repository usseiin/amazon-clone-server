const express = require("express");
const admin = require("../middle_ware/admin");
const { Product } = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");
// const {User}= require('../models/order');

const adminRouter = express.Router();

adminRouter.post("/admin/add-product", admin, async (req, res) => {
  try {
    const { name, description, price, quantity, images, category } = req.body;

    let product = new Product({
      name,
      description,
      images,
      price,
      quantity,
      category,
    });

    product = await product.save();

    res.status(200).json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminRouter.get("/admin/get-orders", admin, async (req, res) => {
  let orders = [];

  try {
    const orders = await Order.find({});

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

adminRouter.get("/admin/get-products", admin, async (req, res) => {
  let products = [];
  try {
    const result = await Product.find({});

    for (var product in result) {
      products.push(result[product]);
    }
  } catch (error) {
    res.status(500).json({ error: e.message });
  }

  res.status(200).json(products);
});

adminRouter.post("/admin/delete-product", admin, async (req, res) => {
  try {
    const { id } = req.body;

    let product = await Product.findByIdAndDelete(id);

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

adminRouter.post("/admin/change-order-status", admin, async (req, res) => {
  try {
    const { id, status } = req.body;

    let order = await Product.findById(id);

    order.status += 1;

    order = await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
adminRouter.get("/admin/analytics", admin, async (req, res) => {
  try {
    const orders = await Order.find({});

    let totalEarnings = 0;

    for (let i = 0; i < orders.length; i++) {
      for (let j = 0; j < orders[i].products.length; j++) {
        totalEarnings =
          orders[i].products[j].quantity * orders[i].products[j].product.price;
      }
    }

    let mobileEarnings = await fetchCategoryWiseProduct("Mobiles");
    let applianceEarnings = await fetchCategoryWiseProduct("Appliances");
    let essentialEarnings = await fetchCategoryWiseProduct("Essentials");
    let booksEarnings = await fetchCategoryWiseProduct("Books");
    let fashionEarnings = await fetchCategoryWiseProduct("Fashion");

    let earnings = {
      totalEarnings,
      mobileEarnings,
      essentialEarnings,
      applianceEarnings,
      booksEarnings,
      fashionEarnings,
    };

    res.status(200).json(earnings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function fetchCategoryWiseProduct(category) {
  let earnings = 0;
  let categoryOrders = await Order.find({
    "products.product.category": category,
  });
  for (let i = 0; i < categoryOrders.length; i++) {
    for (let j = 0; j < categoryOrders[i].products.length; j++) {
      earnings =
        categoryOrders[i].products[j].quantity *
        categoryOrders[i].products[j].product.price;
    }
  }
  return earnings;
}

module.exports = adminRouter;
