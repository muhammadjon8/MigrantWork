const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { errorHandler } = require("../helpers/error-handler");

const addWorkerJob = async (req, res) => {
  const { worker_id, job_id } = req.body;
  try {
    const workerExists = await pool.query(
      `SELECT * FROM worker WHERE id = $1`,
      [worker_id]
    );
    if (workerExists.rows.length === 0) {
      return res.status(400).json({ error: "Invalid worker_id" });
    }
    const jobExists = await pool.query(`SELECT * FROM jobs WHERE id = $1`, [
      job_id,
    ]);
    if (jobExists.rows.length === 0) {
      return res.status(400).json({ error: "Invalid job_id" });
    }

    const all = await pool.query(
      `
    INSERT INTO worker_job (worker_id, job_id) VALUES($1, $2) RETURNING *`,
      [worker_id, job_id]
    );
    res.status(201).json(all.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllWorkerJob = async (req, res) => {
  try {
    const all = await pool.query(
      `
        SELECT * FROM worker_job
        `
    );
    res.status(200).json(all.rows);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getWorkerJobById = async (req, res) => {
  const { id } = req.params;
  try {
    const all = await pool.query(
      `
            SELECT * FROM worker_job WHERE id = $2;
            `,
      [id]
    );
    if (all.rows.length == 0) {
      return res.status(404).json({ message: "worker_job not found" });
    }
    res.status(200).json(all.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteWorkerJob = async (req, res) => {
  const { id } = req.params;
  try {
    const all = await pool.query(
      `
            DELETE FROM worker_job WHERE id = $1;
            `,
      [id]
    );
    if (all.rows.length == 0) {
      return res.status(404).json({ message: "worker_job not found" });
    }
    res.status(200).json({ message: "worker_job deleted successfully" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateWorkerJob = async (req, res) => {
  const { id } = req.params;
  try {
    const all = await pool.query(
      `
            UPDATE worker_job SET worker_id = $1, job_id = $2 WHERE id = $3;
            `,
      [worker_id, job_id, id]
    );
    if (all.rows.length == 0) {
      return res.status(404).json({ message: "worker_job not found" });
    }
    res.status(200).json({ message: "worker_job updated successfully" });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addWorkerJob,
  getAllWorkerJob,
  getWorkerJobById,
  deleteWorkerJob,
  updateWorkerJob,
};
