const Product = require("../models/product.models");
const { errorHandler } = require("../utils/error");

exports.addProduct = async (req, res, next) => {
    const {name, imageUrl, description, price, sizes, color} = req.body;
    
    if (
        !name ||
        !imageUrl ||
        !description ||
        !price ||
        !color ||
        name === "" ||
        imageUrl === "" ||
        description === "" ||
        price <= 0 ||
        color === ""
      ) {
         return next(errorHandler(400, "Provide all the required fields"));
      }
      
      const product = new Product({
        name,
        imageUrl,
        description,
        price,
        sizes : sizes || undefined,
        color
      })

    try {
      await product.save();
      res.json("new product added")  
    } catch (error) {
        next(error)
    }
}

exports.getProducts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 9 
        const products = await Product.find({
            ...(req.query.productId  && {_id : req.query.productId}),
            ...(req.query.name && {name : req.query.name}),
            ...(req.query.searchTerm && {
                $or: [
                  { name: { $regex: req.query.searchTerm, $options: 'i' } },
                  { description: { $regex: req.query.searchTerm, $options: 'i' } },
                ],
              }),
        })
        .skip(startIndex)
        .limit(limit)

        const totalProducts = await Product.countDocuments()

        if(!products){
            return next(errorHandler(404, 'Products Not Found'))
        }
        res.status(200).json({products,totalProducts});
    } catch (error) {
        next(errorHandler(500, "server error"))
    }
}