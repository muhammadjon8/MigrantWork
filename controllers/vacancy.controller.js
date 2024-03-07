const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { errorHandler } = require("../helpers/error-handler");

const addVacancy = async (req, res) => {
  const {
    employer_id,
    city,
    job_id,
    salary,
    description,
    requirements,
    internship,
    job_type,
    work_hour,
    medicine,
    housing,
    gender,
    age_limit,
    education,
    experience,
    trial_period,
  } = req.body;

  try {
    const newVacancy = await pool.query(
      `
    INSERT INTO vacancy (
   employer_id,
    city,
    job_id,
    salary,
    description,
    requirements,
    internship,
    job_type,
    work_hour,
    medicine,
    housing,
    gender,
    age_limit,
    education,
    experience,
    trial_period
    )
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *
  `,
      [
        employer_id,
        city,
        job_id,
        salary,
        description,
        requirements,
        internship,
        job_type,
        work_hour,
        medicine,
        housing,
        gender,
        age_limit,
        education,
        experience,
        trial_period,
      ]
    );
    res.status(201).send(newVacancy.rows);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllVacancy = async (req, res) => {
  try {
    const allVacancy = await pool.query(
      `
      SELECT * FROM vacancy
      `
    );
    if (allVacancy.rows.length == 0) {
      return res.status(404).json({ message: "No vacancy found" });
    }
    res.status(200).send(allVacancy.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getVacancyById = async (req, res) => {
  const { id } = req.params;
  try {
    const vacancyById = await pool.query(
      `
      SELECT * FROM vacancy
      WHERE id = $1
      `,
      [id]
    );
    if (vacancyById.rows.length == 0) {
      return res.status(404).json({ message: "No vacancy found" });
    }
    res.status(200).send(vacancyById.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateVacancy = async (req, res) => {
  const { id } = req.params;
  const {
    employer_id,
    city,
    job_id,
    salary,
    description,
    requirements,
    internship,
    job_type,
    work_hour,
    medicine,
    housing,
    gender,
    age_limit,
    education,
    experience,
    trial_period,
  } = req.body;
  try {
    const updatedVacancy = await pool.query(
      `
       UPDATE vacancy SET 
        employer_id = $1,
        city = $2,
        job_id = $3,
        salary = $4,
        description = $5,
        requirements = $6,
        internship = $7,
        job_type = $8,
        work_hour = $9,
        medicine = $10,
        housing = $11,
        gender = $12,
        age_limit = $13,
        education = $14,
        experience = $15,
        trial_period = $16
        WHERE id = $17
        RETURNING *
            `,
      [
        employer_id,
        city,
        job_id,
        salary,
        description,
        requirements,
        internship,
        job_type,
        work_hour,
        medicine,
        housing,
        gender,
        age_limit,
        education,
        experience,
        trial_period,
        id,
      ]
    );
    if (updatedVacancy.rows.length == 0) {
      return res.status(404).send({ message: "vacancy not found" });
    }
    res.status(200).send(updatedVacancy.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteVacancy = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedVacancy = await pool.query(
      `
            DELETE FROM vacancy WHERE id = $1
            RETURNING *
            `,
      [id]
    );
    if (deletedVacancy.rows.length == 0) {
      return res.status(404).send({ message: "vacancy not found" });
    }
    res.status(200).send(deletedVacancy.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addVacancy,
  getAllVacancy,
  getVacancyById,
  updateVacancy,
  deleteVacancy,
};
