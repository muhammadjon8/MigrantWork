const pool = require("../config/db");

const addApplication = async (req, res) => {
  const { vacancy_id, worker_id, application_date } = req.body;
  try {
    const workerExists = await pool.query(
      `SELECT * FROM vacancy WHERE id = $1`,
      [worker_id]
    );
    if (workerExists.rows.length === 0) {
      return res.status(400).json({ error: "Invalid worker_id" });
    }

    const vacancyExists = await pool.query(
      `SELECT * FROM vacancy WHERE id = $1`,
      [vacancy_id]
    );
    if (vacancyExists.rows.length === 0) {
      return res.status(400).json({ error: "Invalid vacancy_id" });
    }

    const newVacancy = await pool.query(
      `
    INSERT INTO application (vacancy_id, worker_id, application_date) VALUES($1, $2, $3) RETURNING *`,
      [vacancy_id, worker_id, application_date]
    );
    if (newVacancy.rows[0].length == 0) {
      return res.status(404).send({ message: "Application not found" });
    }
    return res.status(201).send(newVacancy.rows[0]);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAllApplication = async (req, res) => {
  try {
    const allAdmins = await pool.query("SELECT * FROM application");
    if (allAdmins.rows.length == 0) {
      return res.status(404).send({ message: "No applications found" });
    }
    return res.status(200).send(allAdmins.rows);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAppById = async (req, res) => {
  const { id } = req.params;
  try {
    const admin = await pool.query(`SELECT * FROM application WHERE id = $1`, [
      id,
    ]);
    if (admin.rows.length == 0) {
      return res.status(404).send({ message: "Application not found" });
    }
    return res.status(200).send(admin.rows[0]);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateAppById = async (req, res) => {
  const { id } = req.params;
  const { vacancy_id, worker_id, application_date } = req.body;
  try {
    const updatedAdmin = await pool.query(
      `UPDATE application SET vacancy_id = $1, worker_id = $2, application_date = $3 WHERE id = $4 RETURNING *`,
      [vacancy_id, worker_id, application_date, id]
    );
    if (updatedAdmin.rows.length == 0) {
      return res.status(404).send({ message: "Application not found" });
    }
    return res.status(200).json({ message: "Updated application successful" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteApplication = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedAdmin = await pool.query(
      `DELETE FROM application WHERE id = $1`,
      [id]
    );
    if (deletedAdmin.rows.length == 0) {
      return res.status(404).send({ message: "Application not found" });
    }
    return res.status(200).json({ message: "Deleted application successful" });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addApplication,
  getAllApplication,
  getAppById,
  updateAppById,
  deleteApplication,
};
