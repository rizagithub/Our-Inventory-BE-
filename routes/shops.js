const router = require('express').Router();
const shopController = require('../controller/shopController');
const Auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// API shops hanya bisa diakses admin/superadmin a.k.a role member gabisa
// get dan searc bisa diakses semua role
router.get('/', shopController.getShops)
router.get('/search',Auth, shopController.searchShops)
router.get('/:id',Auth, shopController.getShopById)
router.put('/:id',Auth, shopController.editShop)
router.delete('/:id',Auth, shopController.deleteShop)
router.post('/', Auth, checkRole('user'),shopController.createShop)


module.exports = router