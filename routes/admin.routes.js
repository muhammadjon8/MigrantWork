const { Router } = require("express");
const {
  addAdmin,
  getAllAdmin,
  getAdminById,
  updateAdminById,
  deleteAdmin,
  loginAdmin,
  logoutAdmin,
  refreshAdminToken,
} = require("../controllers/admin.controller");
const adminPolice = require("../middlewares/admin_police");
const isCreator = require("../middlewares/is_creator_police");
const router = Router();

router.post("/", isCreator, addAdmin);
router.get("/", adminPolice, getAllAdmin);
router.get("/:id", adminPolice, getAdminById);
router.put("/:id", updateAdminById);
router.delete("/:id", deleteAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.post("/refresh", refreshAdminToken);

module.exports = router;
