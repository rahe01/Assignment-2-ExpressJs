import { pool } from "../../config/db";

const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM Users ORDER BY id ASC`
  );

  return result.rows;
};






const updateUser = async (
  userId: number,
  payload: any,
  requesterRole: string,
  requesterId: number
) => {
  const check = await pool.query(`SELECT * FROM users WHERE id = $1`, [userId]);
  if (check.rowCount === 0) throw new Error("User not found");

  const old = check.rows[0];


  if (requesterRole === "customer" && requesterId !== userId) {
    throw new Error("Customers can update only their own profile");
  }



  if (payload.role && payload.role !== old.role) {
    if (requesterRole !== "admin") {
      throw new Error("Only admin can change user role");
    }
  }

  
  const updated = {
    name: payload.name ?? old.name,
    email: payload.email?.toLowerCase() ?? old.email,
    phone: payload.phone ?? old.phone,
    role: payload.role ?? old.role, 
  };

  const result = await pool.query(
    `
      UPDATE users SET 
        name = $1,
        email = $2,
        phone = $3,
        role = $4
      WHERE id = $5
      RETURNING id, name, email, phone, role;
    `,
    [updated.name, updated.email, updated.phone, updated.role, userId]
  );

  return result.rows[0];
};



const deleteUser = async (id: number) => {
  const bookingCheck = await pool.query(
    `SELECT * FROM Bookings WHERE customer_id = $1 AND status = 'active'`,
    [id]
  );

  if (bookingCheck.rowCount! > 0) {
    throw new Error("User has active bookings, cannot be deleted");
  }

  const result = await pool.query(`DELETE FROM Users WHERE id = $1`, [id]);

  if (result.rowCount === 0) throw new Error("User not found");
};

export const userServices = {
  getAllUsers,
  updateUser,
  deleteUser,
};
