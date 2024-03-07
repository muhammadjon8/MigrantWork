const { Router } = require("express");
const {
  getAllEmployers,
  getEmployerById,
  addEmployer,
  updateEmployer,
  deleteEmployer,
  loginEmployer,
  logoutEmployer,
} = require("../controllers/employer.controller");

const router = Router();

router.get("/", getAllEmployers);
router.get("/:id", getEmployerById);
router.post("/", addEmployer);
router.put("/:id", updateEmployer);
router.delete("/:id", deleteEmployer);
router.post("/login", loginEmployer);
router.post("/logout", logoutEmployer);

module.exports = router;
