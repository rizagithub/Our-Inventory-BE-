const { product } = require('../models');

// untuk menampilkan semua produk
async function getProducts(req, res) {
    try {
        const products = await product.findAll();

        res.status(200).json({
            status: 'success',
            data: {
                products
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err.message
        })
    }
}

// untuk mencari data produk berdasarkan nama, menggunakan Op.end with : nama terakhir
async function searchProduct(req, res) {
    try {
        const products = await product.findAll({
            where: {
                name: {
                    [Op.endsWith]: req.query.name
                }
            }
        })
        // validasi
        if(products){
            res.status(200).json({
                status: 'success',
                products
            })
        }else{
            res.status(404).json({
                status: 'failed',
                message: 'nama product salah'
            })
        }
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err.message
        })
    }
}

// mencari produk berdasarkan id
async function getProductById(req, res) {
    try {
        // Primary Key = PK
        const id = req.params.id;
        const data = await product.findByPk(id);

        if(data){
            res.status(200).json({
                status: 'success',
                data
            })
        }else{
            res.status(404).json({
                status: 'failed',
                message: 'nama product salah'
            })
        }
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err.message
        })
    }
}

// mengedit nama produk
async function editProduct(req, res) {
    try {
        const { name } = req.body;
        const id = req.params.id;

        await product.update({
            name
        }, {
            where: { id }
        })

        res.status(200).json({
            status: 'success',
            message: `data dari id ${id} nya berhasil berubah`
        })
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err.message
        })
    }
}

// menghapus produk
async function deleteProduct(req, res) {
    try {
        const id = req.params.id
        await product.destroy({
            where: {
                id
            }
        })

        res.status(200).json({
            'status': 'success',
            'message': `data ${id} ini berhasil di hapus`
        })
    } catch (err) {
        res.status(400).message(err.message)
    }
}

// membuat produk baru
async function createProduct(req, res) {
    try {
        const { name, price, stock } = req.body
        const newProduct = await product.create({
            name,
            price,
            stock
        })
        res.status(201).json({
            status: 'success',
            data: {
                product: newProduct
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err.message
        })
    }
}

module.exports = {
    getProducts,
    getProductById,
    searchProduct,
    deleteProduct,
    editProduct,
    createProduct,
}