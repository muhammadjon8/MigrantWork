const { Router } = require("express");
const {
  getAllCountry,
  getCountryById,
  addCountry,
  updateCountryById,
  deleteCountryById,
} = require("../controllers/country.controller");

const adminPolice = require("../middlewares/admin_police");

const router = Router();

router.get("/", getAllCountry);
router.get("/:id", getCountryById);
router.post("/", adminPolice, addCountry);
router.put("/:id", adminPolice, updateCountryById);
router.delete("/:id", adminPolice, deleteCountryById);

module.exports = router;
