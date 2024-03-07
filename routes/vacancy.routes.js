const { Router } = require("express");
const {
  getAllVacancy,
  getVacancyById,
  addVacancy,
  updateVacancy,
  deleteVacancy,
} = require("../controllers/vacancy.controller");

const router = Router();

router.get("/", getAllVacancy);
router.get("/:id", getVacancyById);
router.post("/", addVacancy);
router.put("/:id", updateVacancy);
router.delete("/:id", deleteVacancy);

module.exports = router;
