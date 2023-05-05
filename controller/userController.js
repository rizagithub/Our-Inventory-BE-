const { users, shops } = require('../models');
// import bcrypt for autentification
const bcrypt = require('bcrypt');
// import jwt sebagai autorization
const jwt = require('jsonwebtoken');

// untuk menampilkan all user
async function getUsers(req, res) {
    try {
        const data = await users.findAll();

        res.status(200).json({
            status: 'success',
            data
        })
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err.message
        })
    }
}

// mencari user berdasarkan id
async function getUserById(req, res) {
    try {
        // Primary Key = PK
        const id = req.params.id;
        const data = await users.findByPk(id,{
            include: {
                model: shops
            }
        });

        if(data){
            res.status(200).json({
                status: 'success',
                data
            })
        }else{
            res.status(404).json({
                status: 'failed',
                message: 'salah id yaa'
            })
        }
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err.message
        })
    }
}

// mengedit nama user
async function editUser(req, res) {
    try {
        const { username } = req.body;
        const id = req.params.id;

        await users.update({
            username
        }, {
            where: { id }
        })

        if(username.length<4){
            res.status(200).json({
                status: 'success',
                message: `nama dari id ${id} nya berhasil berubah`
            })
        }else{
            res.status(400).json({
                status: 'failed',
                message: `nama ${username} kurang dari 4 huruf!`
            })

        }
        
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err.message
        })
    }
}

// menghapus user
async function deleteUser(req, res) {
    try {
        const id = req.params.id
        await users.destroy({
            where: {
                id
            }
        })

        res.status(200).json({
            'status': 'success',
            'message': `data user dengan ${id} ini berhasil di hapus`
        })
    } catch (err) {
        res.status(400).message(err.message)
    }
}

// membuat user baru
async function createUser(req, res) {
    try {
        const { username, password} = req.body
        // proses enkripsi password
        const hashedPassword = bcrypt.hashSync(password,10);
        const name = await users.findOne({
            where:{
                username
            }})

        const newUser = await users.create({
            username,
            // enskripsi di database
            // kiri = key, kanan = value
            password : hashedPassword,
            role : req.body.role
        })
        // try validasi, if we never tryyyyyyy
        if(!name){
            res.status(201).json({
                status: 'success',
                data: {
                    user: newUser
                }
            })
        }else{
            res.status(400).json({
                status : 'failed',
                message : `nama ${username} sudah ada`
            })
        }  
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err.message
        })
    }
}

// login
async function login(req, res) {
    try {
        const { username, password} = req.body
        // cari user berdasarkan username
        const user = await users.findOne({
            where:{
                username
            }
        })
        if(!user){
            res.status(404).json({
                status : 'failed',
                message : `user ${username} gak ada`
            })
        }
        console.log(password)
        console.log(user.password)

        if(user && bcrypt.compareSync(password, user.password)){
            // generate token untuk user
            const token = jwt.sign({
                id : user.id,
                username : user.username,
                role : user.role
            },'rahasia')

            res.status(200).json({
                status: 'success',
                data: {
                    user,
                    token
                }
            })
        }            
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err.message
        })
    }
}

module.exports = {
    getUsers,
    getUserById,
    deleteUser,
    editUser,
    createUser,
    login,
}