const router = require('express').Router();
const swaggerUi = require('swagger-ui-express')
// import file json
const swaggerDocument=require('../docs/swagger.json')

const User = require('./user')
const Product = require('./product')
const Shop = require('./shops')
const Admin = require('./admin');

// API docs => dokumentasi API
router.use('/api-docs', swaggerUi.serve)
router.use('/api-docs', swaggerUi.setup(swaggerDocument))

// pindahan dari url biar lebih rapi/ singkat
router.use('/api/v1/users', User)
router.use('/api/v1/shops', Shop)
router.use('/api/v1/product', Product)
router.use('/admin/products', Admin);

module.exports = router