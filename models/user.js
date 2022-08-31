const mongoose = require("mongoose");
const { productSchema } = require("../models/product");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (value) => {
        const re =
          /^(([-\w \.]+)|(&quot;&quot;[-\w \.]+&quot;&quot;) )?&lt;([\w\-\.]+)@((\[([0-9]{1,3}\.){3}[0-9]{1,3}\])|(([\w\-]+\.)+)([a-zA-Z]{2,4}))&gt;$/;

        value.match(re);
      },

      message: "Please enter a valid email",
    },
  },
  password: {
    required: true,
    type: String,
    validate: {
      validator: (value) => {
        value.length >= 6;
      },
      message: "Please enter a valid password",
    },
  },
  address: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "user",
  },
  cart: [
    {
      product: productSchema,
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  //Cart
});

const User = mongoose.model("User", userSchema);

module.exports = User;
