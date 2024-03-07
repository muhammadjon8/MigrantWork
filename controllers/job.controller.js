const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { errorHandler } = require("../helpers/error-handler");

const addJob = async (req, res) => {
  const { name, description, icon } = req.body;
  try {
    const job = await pool.query(
      "INSERT INTO job (name, description, icon) VALUES ($1, $2, $3) RETURNING *",
      [name, description, icon]
    );
    if (job.rows.length == 0) {
      return res.status(400).json({ message: "Job not found" });
    }
    res.status(201).json(job.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllJobs = async (req, res) => {
  try {
    const job = await pool.query(`SELECT * FROM job `);
    if (job.rows.length == 0) {
      return res.status(400).json({ message: "Job not found" });
    }
    res.status(200).json(job.rows);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getJobById = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await pool.query(`SELECT * FROM job WHERE id = $1`, [id]);
    if (job.rows.length == 0) {
      return res.status(400).json({ message: "Job not found" });
    }
    res.status(200).json(job.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateJobById = async (req, res) => {
  const { id } = req.params;
  const { name, description, icon } = req.body;
  try {
    const job = await pool.query(
      `UPDATE job SET name = $1, description = $2, icon = $3 WHERE id = $4 RETURNING *`,
      [name, description, icon, id]
    );
    if (job.rows.length == 0) {
      return res.status(400).json({ message: "Job not found" });
    }
    res.status(200).json(job.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteJobById = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await pool.query(`DELETE FROM job WHERE id = $1`, [id]);
    if (job.rows.length == 0) {
      return res.status(400).json({ message: "Job not found" });
    }
    res.status(200).json(job.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addJob,
  getAllJobs,
  getJobById,
  updateJobById,
  deleteJobById,
};
