const express = require('express')

const router = express.Router()

const {
    addProduct,
    getProducts,
    getProduct,
    getMyProducts,
    searchSuggestions,
    searchProducts
} = require('../controllers/productController')

const multer = require('multer')

    const storage = multer.diskStorage({
      destination: function(req, file, cb){
        cb(null, '../client/src/images')
      },
      filename: function(req, file, cb){
        const uniqueSuffix = Date.now()
        cb(null,uniqueSuffix + file.originalname)
      }
    })
    
const upload = multer({ storage: storage })

router.post('/:username/product', upload.single('image'), addProduct)
router.get('/products', getProducts)
router.get('/search', searchProducts)
router.get('/:productId', getProduct)
router.get('/my-products/:username', getMyProducts)
router.get('/products/suggestions', searchSuggestions)

module.exports = router