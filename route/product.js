const express = require("express");
const auth = require("../middle_ware/auth");
const {Product} = require("../models/product");

const productRouter = express.Router();

productRouter.get("/api/products", auth, async (req, res) => {
  try {
    const categories = req.query.categories;

    const products = await Product.find({ category: categories });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

productRouter.post("/api/rate-product", auth, async (req, res) => {
  try {
    const { id, rating } = req.body;

    let product = await Product.findById(id);

    for (let i = 0; i < product.ratings.length; i++) {
      if (product.ratings[i].userId == req.user) {
        product.ratings.splice(i, 1);
        break;
      }
    }

    const ratingSchema = { userId: req.user, rating };

    product.ratings.push(ratingSchema);

    // for (var rate in product.rating) {
    //     // if (Object.hasOwnProperty.call(product.rating, rating)) {
    //     //     const element = product.rating[rating];

    //     // }

    //     if (rate.userId == req.user) {
    //         product.rating.splice(product.rating.indexOf(rate),1);
    //     }
    // }

    // product.rating = rating;

    product = await product.save();

    res.status(200).json(product);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

productRouter.get('/api/deal-of-the-day',auth,async(req,res)=>{
  try {
    let products = await  Product.find({});

    function totalRating(rating)  {
      let totalRating = 0;
      for (let i = 0; i < rating.length; i++) {
        totalRating += rating[i].rating;
      }

      return totalRating;
    }

    // console.log(products);

    
    // products = products.sort((a,b)=>{
    //   let aSum = 0;
    //   let bSum = 0;

    //   for (let i = 0; i < a.ratings.length; i++) {
    //     aSum+=a.ratings[i].rating;
    //   }


    //   for (let i = 0; i < b.ratings.length; i++) {
    //     bSum+=b.ratings[i].rating;
    //   }

    //   return aSum < bSum ? 1 : -1;
    // });
    

    products = products.sort((a,b)=>totalRating(b)-totalRating(a));
    res.status(200).json(products[0]);
  
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = productRouter;
