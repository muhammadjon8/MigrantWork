const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { errorHandler } = require("../helpers/error-handler");

const addCountry = async (req, res) => {
  const { name, flag } = req.body;
  try {
    
    const country = await pool.query(
      "INSERT INTO country (name, flag) VALUES ($1, $2) RETURNING *",
      [name, flag]
    );
    res
      .status(201)
      .json({ messsage: "Saved successfully", data: country.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllCountry = async (req, res) => {
  try {
    const country = await pool.query(`SELECT * from country`);
    if (country.rows.length == 0) {
      return res.json({ messsage: "No country found" });
    }
    res.status(200).json({ data: country.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getCountryById = async (req, res) => {
  const { id } = req.params;
  try {
    const country = await pool.query(`SELECT * from country where id = $1`, [
      id,
    ]);
    if (country.rows.length == 0) {
      return res.json({ messsage: "No country found" });
    }
    res.status(200).json({ data: country.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateCountryById = async (req, res) => {
  const { id } = req.params;
  const { name, flag } = req.body;
  try {
    const country = await pool.query(
      `UPDATE country SET name = $1, flag = $2 WHERE id = $3 RETURNING *`,
      [name, flag, id]
    );
    if (country.rows.length == 0) {
      return res.json({ messsage: "No country found" });
    }
    res
      .status(200)
      .json({ message: "Country updated successfully", data: country.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteCountryById = async (req, res) => {
  const { id } = req.params;
  try {
    const country = await pool.query(`DELETE FROM country WHERE id = $1`, [id]);
    if (country.rows.length == 0) {
      return res.json({ messsage: "No country found" });
    }
    res.status(200).json({ message: "Country deleted successfully" });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addCountry,
  getAllCountry,
  getCountryById,
  updateCountryById,
  deleteCountryById,
};
