const router = require("express").Router();

// controller
const adminController = require("../controller/adminController");

// middleware

// API
router.post("/register", adminController.register);
router.post("/login", adminController.login);
router.put("/:id", adminController.updateAdmin);
router.get("/", adminController.findAllAdmin);
router.get("/:id", adminController.findAdminById);
router.delete("/:id", adminController.deleteAdmin);

module.exports = router;
