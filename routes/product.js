const router = require('express').Router();
const productController = require('../controller/productController');
const Auth = require('../middleware/auth')

// API product
// 1. get produk bisa diakses all role
// 2. create, update hanya bisa diakses admin dan superadmin
// 3. delete hanya bisa diakses oleh superadmin
router.get('/', Auth, productController.getProducts)
router.get('/search', Auth, productController.searchProduct)
router.get('/:id', Auth, productController.getProductById)
router.put(':id', Auth, productController.editProduct)
router.delete('/:id', Auth, productController.deleteProduct)
router.post('/', Auth, productController.createProduct)


module.exports = router