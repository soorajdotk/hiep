const Product = require('../models/productModel')

// PRODUCT CLASS

//ADD PRODUCT
const addProduct = async(req, res) => {
    console.log(req.file)
    const { username } = req.params
    
    const imageName = req.file.filename
    try {
        const { name, description, price, category, quantity } = req.body;
        const product = new Product({ name, description, price, category, designer: username, image: imageName, quantity   });
        await product.save();
        res.status(201).json(product);
        
      } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
}

//GET PRODUCTS
const getProducts = async(req, res) => {
    try {
        // Fetch all products from the database
        const products = await Product.find()
        
        res.status(200).json(products);
      } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Failed to fetch products' });
      }
    
}

//GET A PRODUCT
const getProduct = async(req, res) => {
    const { productId } = req.params
    try{
        const product = await Product.findById(productId)

        res.status(200).json(product)
    }catch(error){
        console.error('Error fetching product: ',error)
        res.status(500).json({ message: 'Failed to fetch product '})
    }
}

//GET MY PRODUCTS
const getMyProducts = async (req, res) => {
  const { username } = req.params;
  try {
    // Assuming you have a Product model/schema in your database
    const products = await Product.find({ designer: username });

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//PRODUCT SEARCH SUGGESTIONS
const searchSuggestions = async(req, res) => {
  const { search } = req.query
  console.log(search)
  try{
    const products = await Product.find({ name: { $regex: search, $options: 'i' } }).limit(10); // Limiting to 10 suggestions
    const suggestions = products.map(product => ({
      name: product.name,
      id: product._id
    }));
    res.json(suggestions);  
  }catch(error){
    console.error('Error fetching search suggestions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

//SERACH PRODUCTS
const searchProducts = async (req, res) => {
  try {
      const { search } = req.query;
      console.log(search)
      // Query products based on the search term
      const products = await Product.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { category: {$regex: search, $options: 'i'}},
          { designer: {$regex: search, $options: 'i'}}
        ]
        });
      res.json(products);
  } catch (error) {
      console.error('Error searching products:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
}


module.exports = {
    addProduct,
    getProducts,
    getProduct,
    getMyProducts,
    searchSuggestions,
    searchProducts
}