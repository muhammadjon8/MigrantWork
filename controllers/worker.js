const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { errorHandler } = require("../helpers/error-handler");
const { workerValidation } = require("../validations/worker.validation");

const myJwt = require("../services/jwt_service");
const config = require("config");

const uuid = require("uuid");
const mail_service = require("../services/mail_service");

const addWorker = async (req, res) => {
  const { error, value } = workerValidation(req.body);

  const {
    first_name,
    last_name,
    birth_date,
    gender,
    passport,
    phone_number,
    email,
    tg_link,
    hashed_password,
    confirm_password,
    refresh_token,
    is_active,
    education,
    skills,
    experience,
  } = value;
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }
  if (hashed_password !== confirm_password) {
    return res.status(400).send({ message: "password not match" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(hashed_password, salt);

  const worker_activation_link = uuid.v4();

  try {
    const newWorker = await pool.query(
      `
    INSERT INTO worker (
      first_name,
      last_name,
      birth_date,
      gender,
      passport,
      phone_number,
      email,
      tg_link,
      hashed_password,
      refresh_token,
      is_active,
      education,
      skills,
      experience,
      worker_activation_link
    )
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *
  `,
      [
        first_name,
        last_name,
        birth_date,
        gender,
        passport,
        phone_number,
        email,
        tg_link,
        hashedPassword,
        refresh_token,
        is_active,
        education,
        skills,
        experience,
        worker_activation_link,
      ]
    );

    await mail_service.sendActivationMail(
      email,
      `${config.get("api_uri")}:${config.get(
        "port"
      )}/author/activate/${worker_activation_link}`
    );

    res.status(201).json({ message: "Success", data: newWorker.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const workerActivate = async (req, res) => {
  try {
    const { link } = req.params;
    const auth = await pool.query(
      `SELECT * FROM worker WHERE worker_activation_link = $1;`,
      [link]
    );
    if (!auth.rows[0]) {
      return res.status(400).json({ message: "Invalid link" });
    }
    if (auth.rows[0].is_active) {
      return res.status(200).json({ message: "Already active" });
    }
    await pool.query(`UPDATE worker SET is_active = true WHERE id = $1`, [
      auth.rows[0].id,
    ]);
    return res.status(200).json({ message: "Worker activated" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAllWorker = async (req, res) => {
  try {
    const allWorker = await pool.query(
      `
      SELECT * FROM worker
      `
    );
    res.status(200).send(allWorker.rows);
  } catch (error) {
    errorHandler(error, res);
  }
};

const loginWorker = async (req, res) => {
  try {
    const { email, password } = req.body;
    const auth = await pool.query(
      `SELECT * FROM worker WHERE email = '${email}'`
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
      is_active: auth.rows[0].is_active,
    };

    const tokens = myJwt.generateTokens(payload);

    const updateQuery = "UPDATE worker SET worker_token = $1 WHERE id = $2";
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

const logoutWorker = async (req, res) => {
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

const getWorkerById = async (req, res) => {
  const { id } = req.params;
  try {
    const workerById = await pool.query(
      `
      SELECT * FROM worker
      WHERE id = $1
      `,
      [id]
    );
    if (workerById.rows.length == 0) {
      return res.send({ message: "Worker not found" });
    }
    res.status(200).send(workerById.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const updateWorker = async (req, res) => {
  const { id } = req.params;
  const {
    first_name,
    last_name,
    birth_date,
    gender,
    passport,
    phone_number,
    email,
    tg_link,
    hashed_refresh_token,
    is_active,
    education,
    skills,
    experience,
  } = req.body;
  try {
    const updatedWorker = await pool.query(
      `
        UPDATE worker SET 
        first_name = $1,
        last_name = $2,
        birth_date = $3,
        gender = $4,
        passport = $5,
        phone_number = $6,
        email = $7,
        tg_link = $8,
        hashed_refresh_token = $9,
        is_active = $10,
        education = $11,
        skills = $12,
        experience = $13 WHERE id = $14
        RETURNING *
            `,
      [
        first_name,
        last_name,
        birth_date,
        gender,
        passport,
        phone_number,
        email,
        tg_link,
        hashed_refresh_token,
        is_active,
        education,
        skills,
        experience,
        id,
      ]
    );

    if (updatedWorker.rows.length == 0) {
      return res.status(404).send({ message: "worker not found" });
    }

    res
      .status(200)
      .json({ message: "Updated Successfully", data: updatedWorker.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteWorker = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedWorker = await pool.query(
      `
            DELETE FROM worker WHERE id = $1
            RETURNING *
            `,
      [id]
    );
    if (deletedWorker.rows.length == 0) {
      return res.status(404).send({ message: "worker not found" });
    }
    res
      .status(200)
      .json({ message: "Deleted successfully", data: deletedWorker.rows[0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addWorker,
  getAllWorker,
  getWorkerById,
  updateWorker,
  deleteWorker,
  loginWorker,
  logoutWorker,
  workerActivate,
};
