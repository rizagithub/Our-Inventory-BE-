module.exports = (role)=>{
    return async function (req,res, next){
        console.log(role)
        console.log("===================================================")
        if(req.user.role!== role){
            // forbiden
            res.status(403).json({
                status : 'failed',
                message : `kamu gak bisa akses karena bukan ${role}`
            })

        }else{
            next()
        }

    }
} 