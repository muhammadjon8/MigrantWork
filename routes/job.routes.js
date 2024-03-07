const { Router } = require("express");
const {
  getAllJobs,
  getJobById,
  addJob,
  updateJobById,
  deleteJobById,
} = require("../controllers/job.controller");

const adminPolice = require("../middlewares/admin_police");

const router = Router();

router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.post("/", adminPolice, addJob);
router.put("/:id", adminPolice, updateJobById);
router.delete("/:id", adminPolice, deleteJobById);

module.exports = router;
