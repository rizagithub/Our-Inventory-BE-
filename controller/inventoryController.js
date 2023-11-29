const httpStatus = require("http-status");
const { inventory } = require("../models");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

//Create New Inventory
const createInventory = catchAsync(async(req,res)=>{
    const {name,code,admin_name,type,year} = req.body;
 
    // req body create
    const newInventory = await inventory.create({
        name, code, admin_name, type, year
    });

    res.status(201).json({
        status: "success",
        data: {
          inventory : newInventory
        },
      });


})

//Update Inventory
const updateInventory = catchAsync(async(req,res)=>{
    const {name,code,admin_name,type,year} = req.body;
    const id = req.params.id;
    const inventorys = await inventory.findByPk(id);

    if(!inventorys){
        throw new ApiError(httpStatus.NOT_FOUND,`Data with id ${id} is not found`)
    }else{
        await inventory.update({
            name,code,admin_name,type,year
        },{where :{id}})
    
        res.status(200).json({
            status: "success",
            data: {
                name,code,admin_name,type,year
            },
          });
    }

})


//Get All Data Inventory
const findAllInventory = catchAsync(async (req,res)=>{
    const inventorys = await inventory.findAll();
    res.status(200).json({
        status: "Success",
        data: {
          inventorys,
        },
      });

})

//Get Inventory By ID
const findInventoryById = catchAsync(async(req,res)=>{
    const id = req.params.id;
    const inventorys = await inventory.findByPk(id);

    if(!inventorys){
        throw new ApiError(
            httpStatus.NOT_FOUND, `id ${id} is not found`
        )
    }

    res.status(200).json({
        status: "Success",
        data :{
            inventorys
        }
    })
})

//Delete Inventory Data
const deleteInventory = catchAsync(async(req,res)=>{
    const id = req.params.id;

    const inventorys = await inventory.findByPk(id);

    if(!inventorys){
        throw new ApiError(
            httpStatus.NOT_FOUND, `id ${id} is not found`
        )
    }

    await inventory.destroy({
        where:{
            id,
        }
    })

    res.status(200).json({
        status: "Success",
        message: `Inventory dengan id ${id} terhapus`,
      });

})

module.exports={
    createInventory,
    updateInventory,
    findAllInventory,
    findInventoryById,
    deleteInventory
}