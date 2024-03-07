const { Router } = require("express");
const {
  getAllApplication,
  getAppById,
  addApplication,
  updateAppById,
  deleteApplication,
} = require("../controllers/application.controller");

const router = Router();

router.get("/", getAllApplication);
router.get("/:id", getAppById);
router.post("/", addApplication);
router.put("/:id", updateAppById);
router.delete("/:id", deleteApplication);

module.exports = router;
