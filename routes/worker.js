const { Router } = require("express");
const {
  getAllWorker,
  getWorkerById,
  addWorker,
  updateWorker,
  deleteWorker,
  loginWorker,
  logoutWorker,
  workerActivate,
} = require("../controllers/worker");

const router = Router();

router.get("/", getAllWorker);
router.get("/:id", getWorkerById);
router.post("/", addWorker);
router.put("/:id", updateWorker);
router.delete("/:id", deleteWorker);
router.post("/login", loginWorker);
router.post("/logout", logoutWorker);
router.get("/activate/:link", workerActivate);

module.exports = router;
