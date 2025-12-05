import { pool } from "../../config/db";

interface VehiclePayload {
  vehicle_name: string;
  type: string;
  registration_number: string;
  daily_rent_price: number;
  availability_status: string;
}

const createVehicle = async (payload: VehiclePayload) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  if (
    !vehicle_name ||
    !type ||
    !registration_number ||
    !daily_rent_price ||
    !availability_status
  ) {
    throw new Error("All fields are required");
  }

  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return result.rows[0];
};








const getAllVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles ORDER BY id ASC`);
  return result.rows;
};







const getVehicleById = async (id: number) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);

  if (result.rowCount === 0) {
    throw new Error("Vehicle not found");
  }

  return result.rows[0];
};









const updateVehicle = async (id: number, payload: Partial<VehiclePayload>) => {
  const check = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);

  if (check.rowCount === 0) {
    throw new Error("Vehicle not found");
  }

  const oldData = check.rows[0];
  const updatedData = {
    vehicle_name: payload.vehicle_name ?? oldData.vehicle_name,
    type: payload.type ?? oldData.type,
    registration_number:
      payload.registration_number ?? oldData.registration_number,
    daily_rent_price: payload.daily_rent_price ?? oldData.daily_rent_price,
    availability_status:
      payload.availability_status ?? oldData.availability_status,
  };

  const result = await pool.query(
    `
      UPDATE vehicles 
      SET vehicle_name = $1,
          type = $2,
          registration_number = $3,
          daily_rent_price = $4,
          availability_status = $5
      WHERE id = $6
      RETURNING *;
    `,
    [
      updatedData.vehicle_name,
      updatedData.type,
      updatedData.registration_number,
      updatedData.daily_rent_price,
      updatedData.availability_status,
      id,
    ]
  );

  return result.rows[0];
};







const deleteVehicle = async (id: number) => {
  const result = await pool.query(
    `DELETE FROM vehicles WHERE id = $1 RETURNING id`,
    [id]
  );

  if (result.rowCount === 0) throw new Error("Vehicle not found");

  return true;
};

export const vehicleServices = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
