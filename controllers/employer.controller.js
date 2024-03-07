const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { errorHandler } = require("../helpers/error-handler");
const { employerValidation } = require("../validations/employer.validation");
const myJwt = require("../services/jwt_service");
const config = require("config");


const addEmployer = async (req, res) => {
  const { error, value } = employerValidation(req.body);
  const {
    company_name,
    industry,
    country_id,
    address,
    location,
    contact_name,
    contact_passport,
    contact_email,
    contact_phone,
    hashed_password,
    confirm_password,
    refresh_token,
  } = value;
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }
  if (hashed_password !== confirm_password) {
    return res.status(400).json({
      message: "Passwords do not match",
    });
  }
  const hashedPassword = await bcrypt.hash(hashed_password, 7);
  try {
    const newEmployer = await pool.query(
      `INSERT INTO employer (
          company_name,
          industry,
          country_id,
          address,
          location,
          contact_name,
          contact_passport,
          contact_email,
          contact_phone,
          hashed_password,
          refresh_token
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        company_name,
        industry,
        country_id,
        address,
        location,
        contact_name,
        contact_passport,
        contact_email,
        contact_phone,
        hashedPassword, // Use hashedPassword instead of hashed_password
        refresh_token,
      ]
    );
    res.status(201).json({ message: "success", data: newEmployer.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllEmployers = async (req, res) => {
  try {
    const allEmployers = await pool.query(`SELECT * FROM employer`);
    if (allEmployers.rows.length == 0) {
      return res.status(404).json({ message: "No employers found" });
    }
    res.status(200).json({ data: allEmployers.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const loginEmployer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const auth = await pool.query(
      `SELECT * FROM employer WHERE contact_email = '${email}'`
    );
    if (!auth) {
      return res.status(400).json({
        message: "Employer not found",
      });
    }
    console.log(auth);
    const isMatch = await bcrypt.compare(
      password,
      auth.rows[0].hashed_password
    );
    if (!isMatch) {
      return res.status(400).json({
        message: "Password or Email is wrong",
      });
    }
    const payload = {
      id: auth.id,
    };

    const tokens = myJwt.generateTokens(payload);

    const updateQuery = "UPDATE employer SET employer_token = $1 WHERE id = $2";
    await pool.query(updateQuery, [tokens.refreshToken, auth.id]);

    res.cookie("refresh_token", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      httpOnly: true,
    });

    return res.status(200).send(tokens);
  } catch (error) {
    errorHandler(res, error);
  }
};

const logoutEmployer = async (req, res) => {
  try {
    const { refresh_token } = req.cookies;
    if (!refresh_token) {
      return res.status(400).json({ message: "No refresh token provided" });
    }

    const updateQuery =
      "UPDATE employer SET refresh_token = NULL WHERE refresh_token = $1 RETURNING *";
    const result = await pool.query(updateQuery, [refresh_token]);

    res.clearCookie("refresh_token");
    res.send({ message: "Successfully logged out" });
  } catch (error) {
    res.send({ error: error.message });
  }
};

const getEmployerById = async (req, res) => {
  const { id } = req.params;
  try {
    const employer = await pool.query(`SELECT * FROM employer WHERE id = $1`, [
      id,
    ]);
    if (employer.rows.length == 0) {
      return res.status(404).json({ message: "No employer found" });
    }
    res.status(200).json({ data: employer.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateEmployer = async (req, res) => {
  const { id } = req.params;
  const {
    company_name,
    industry,
    country_id,
    address,
    location,
    contact_name,
    contact_passport,
    contact_email,
    contact_phone,
    hashed_password,
    hashed_refresh_token,
  } = req.body;
  const hashedPassword = await bcrypt.hash(hashed_password, 7);
  try {
    const updatedEmployer = await pool.query(
      `UPDATE employer SET
      company_name = $1,
      industry = $2,
      country_id = $3,
      address = $4,
      location = $5,
      contact_name = $6,
      contact_passport = $7,
      contact_email = $8,
      contact_phone = $9,
      hashed_password = $10,
      hashed_refresh_token = $11
      WHERE id = $12 RETURNING *`,
      [
        company_name,
        industry,
        country_id,
        address,
        location,
        contact_name,
        contact_passport,
        contact_email,
        contact_phone,
        hashedPassword,
        hashed_refresh_token,
        id,
      ]
    );
    if (updatedEmployer.rows.length == 0) {
      return res.status(404).json({ message: "No employer found" });
    }
    res.status(200).json({ message: "success", data: updatedEmployer.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteEmployer = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedEmployer = await pool.query(
      `DELETE FROM employer WHERE id = $1`,
      [id]
    );
    res
      .status(200)
      .json({ message: "success removing employer", data: deletedEmployer });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addEmployer,
  getAllEmployers,
  getEmployerById,
  updateEmployer,
  deleteEmployer,
  loginEmployer,
  logoutEmployer,
};
