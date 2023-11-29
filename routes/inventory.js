const router = require("express").Router();

const Inventory = require("../controller/inventoryController");

const Uploader = require("../middleware/uploaders");

//API
router.post("/", Inventory.createInventory);
router.get("/", Inventory.findAllInventory);
router.put("/:id", Inventory.updateInventory);
router.get("/:id", Inventory.findInventoryById);
router.delete("/:id", Inventory.deleteInventory)


module.exports = router;