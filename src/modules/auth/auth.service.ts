import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const loginUser = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error("Email  password  required");
  }

  const emailLower = email.toLowerCase();

  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    emailLower,
  ]);

  if (result.rows.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Invalid email or password");
  }

  const secret = config.jwtSecret as string;

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn: "7d" }
  );

  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };

  return { token, user: userData };
};

export const authServices = {
  loginUser,
};
