const { Router } = require("express");

const router = Router();

const adminRoute = require("./admin.routes");
const ApplicationRoute = require("./application.routes");
const countryRoute = require("./country.routes");
const employerRoute = require("./employer.routes");
const jobRoute = require("./job.routes");
const vacancyRoute = require("./vacancy.routes");
const workerRoute = require("./worker");

router.use("/admin", adminRoute);
router.use("/application", ApplicationRoute);
router.use("/country", countryRoute);
router.use("/employer", employerRoute);
router.use("/job", jobRoute);
router.use("/vacancy", vacancyRoute);
router.use("/worker", workerRoute);

module.exports = router;
