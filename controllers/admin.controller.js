const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { errorHandler } = require("../helpers/error-handler");
const { adminValidation } = require("../validations/admin-validation");
const myJwt = require("../services/jwt_service");
const config = require("config");

const addAdmin = async (req, res) => {
  console.log("admin");
  try {
    const { error, value } = adminValidation(req.body);
    const {
      name,
      email,
      hashed_password,
      confirm_password,
      phone_number,
      tg_link,
      is_active,
      is_creator,
      refresh_token,
      description,
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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(hashed_password, salt);
    const newAdmin = await pool.query(
      `
    INSERT INTO admin (
      name,
      email,
      hashed_password,
      phone_number,
      tg_link,
      is_active,
      is_creator,
      refresh_token,
      description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        name,
        email,
        hashedPassword,
        phone_number,
        tg_link,
        is_active,
        is_creator,
        refresh_token,
        description,
      ]
    );

    const payload = {
      id: newAdmin.rows[0].id,
      is_creator: newAdmin.rows[0].is_creator,
    };
    const tokens = myJwt.generateTokens(payload);

    const updateQuery = "UPDATE admin SET refresh_token = $1 WHERE id = $2";
    await pool.query(updateQuery, [tokens.refreshToken, newAdmin.rows[0].id]);

    res.cookie("refresh_token", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      httpOnly: true,
    });
    res.status(201).json({
      message: "Admin Added Successfully",
      newAdmin: newAdmin.rows[0],
    });
  } catch (error) {
    console.error(error);
    errorHandler(res, error);
  }
};

const getAllAdmin = async (req, res) => {
  try {
    const newAdmin = await pool.query(`SELECT * FROM admin`);
    if (newAdmin.rows.length == 0) {
      return res.status(404).json({
        message: "No Admin Found",
      });
    }
    res.status(200).json(newAdmin.rows);
  } catch (error) {
    errorHandler(res, error);
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const auth = await pool.query(
      `SELECT * FROM admin WHERE email = '${email}'`
    );
    if (!auth) {
      return res.status(400).json({
        message: "Admin not found",
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
      id: auth.rows[0].id,
      is_creator: auth.rows[0].is_creator,
    };
    console.log(payload);
    const tokens = myJwt.generateTokens(payload);

    const updateQuery = "UPDATE admin SET refresh_token = $1 WHERE id = $2";
    await pool.query(updateQuery, [tokens.refreshToken, auth.rows[0].id]);

    res.cookie("refresh_token", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      httpOnly: true,
    });

    return res.status(200).send(tokens);
  } catch (error) {
    errorHandler(res, error);
  }
};

const logoutAdmin = async (req, res) => {
  try {
    const { refresh_token } = req.cookies;
    if (!refresh_token) {
      return res.status(400).json({ message: "No refresh token provided" });
    }

    const updateQuery =
      "UPDATE admin SET refresh_token = NULL WHERE refresh_token = $1 RETURNING *";
    const result = await pool.query(updateQuery, [refresh_token]);

    res.clearCookie("refresh_token");
    res.send({ message: "Successfully logged out" });
  } catch (error) {
    res.send({ error: error.message });
  }
};

const getAdminById = async (req, res) => {
  const { id } = req.params;
  try {
    const newAdmin = await pool.query(`SELECT * FROM admin WHERE id = $1`, [
      id,
    ]);
    if (newAdmin.rows.length == 0) {
      return res.status(404).json({
        message: "No Admin Found",
      });
    }
    res.status(200).json(newAdmin.rows[0]);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateAdminById = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    email,
    phone_number,
    tg_link,
    is_active,
    is_creator,
    hashed_refresh_token,
    description,
  } = req.body;
  try {
    const newAdmin = await pool.query(
      `
          UPDATE admin SET name = $1, email = $2, phone_number = $3, tg_link = $4 , is_active = $5, is_creator = $6, hashed_refresh_token = $7, description = $8 WHERE id = $9`,
      [
        name,
        email,
        phone_number,
        tg_link,
        is_active,
        is_creator,
        hashed_refresh_token,
        description,
        id,
      ]
    );
    if (newAdmin.rowCount == 0) {
      return res.status(404).json({
        message: "No Admin Found",
      });
    }
    res.status(200).json({
      data: newAdmin.rows[0],
      message: "Admin updated successfully",
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const newAdmin = await pool.query(`DELETE FROM admin WHERE id = $1`, [id]);
    if (newAdmin.rowCount == 0) {
      return res.status(404).json({
        message: "No Admin Found",
      });
    }
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const refreshAdminToken = async (req, res) => {
  try {
    const { refresh_token } = req.cookies;
    console.log(refresh_token);
    if (!refresh_token) {
      return res.status(400).send({ message: "Cookie refresh topilmadi" });
    }

    const adminDataFromCookie = myJwt.verifyRefreshToken(refresh_token);
    if (!adminDataFromCookie) {
      return res
        .status(403)
        .send({ message: "Admin ro'yhatdan o'tmagan (Token notog'ri)" });
    }

    const adminDataFromDB = await pool.query(
      "SELECT * FROM admin WHERE refresh_token = $1",
      [refresh_token]
    );
    console.log(adminDataFromDB);
    if (adminDataFromDB.rows.length === 0) {
      return res.status(403).send({ message: "Ruxsat etilmagan (Admin yo'q)" });
    }

    const payload = {
      id: adminDataFromDB.rows[0]._id,
      is_expert: adminDataFromDB.rows[0].is_expert,
    };

    const tokens = myJwt.generateTokens(payload);

    await pool.query(
      "UPDATE admin SET refresh_token = $1 WHERE refresh_token = $2",
      [tokens.refreshToken, refresh_token]
    );

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("refresh_ms"),
      httpOnly: true,
    });

    res.status(200).send(tokens);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
};

module.exports = {
  addAdmin,
  getAllAdmin,
  getAdminById,
  updateAdminById,
  deleteAdmin,
  loginAdmin,
  logoutAdmin,
  refreshAdminToken,
};
