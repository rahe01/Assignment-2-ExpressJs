import { pool } from "../../config/db";

interface BookingPayload {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
}

const createBooking = async (payload: BookingPayload) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const vehicleRes = await pool.query(
    `SELECT id, vehicle_name, daily_rent_price, availability_status 
     FROM Vehicles WHERE id = $1`,
    [vehicle_id]
  );

  if (vehicleRes.rowCount === 0) throw new Error("Vehicle not found");

  const vehicle = vehicleRes.rows[0];

  if (vehicle.availability_status !== "available") {
    throw new Error("Vehicle is not available");
  }

  const startDate = new Date(rent_start_date);
  const endDate = new Date(rent_end_date);
  const diffTime = endDate.getTime() - startDate.getTime();
  const number_of_days = diffTime / (1000 * 60 * 60 * 24);

  if (number_of_days <= 0) throw new Error("Invalid booking dates");

  const total_price = vehicle.daily_rent_price * number_of_days;

  const bookingRes = await pool.query(
    `INSERT INTO Bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES ($1, $2, $3, $4, $5, 'active')
     RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  await pool.query(
    `UPDATE Vehicles SET availability_status = 'booked' WHERE id = $1`,
    [vehicle_id]
  );

  const booking = bookingRes.rows[0];
  booking.vehicle = {
    vehicle_name: vehicle.vehicle_name,
    daily_rent_price: vehicle.daily_rent_price,
  };

  return booking;
};

export interface GetBookingsParams {
  userId?: number;
  role?: string;
}

const getBookings = async (userId?: number, role?: string) => {
  let result;

  if (role === "admin") {
    result = await pool.query(`
      SELECT b.id, b.customer_id, b.vehicle_id, b.rent_start_date, b.rent_end_date, b.total_price, b.status,
             json_build_object('name', u.name, 'email', u.email) AS customer,
             json_build_object('vehicle_name', v.vehicle_name, 'registration_number', v.registration_number) AS vehicle
      FROM Bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.id ASC
    `);
  } else {
    result = await pool.query(
      `
      SELECT b.id, b.vehicle_id, b.rent_start_date, b.rent_end_date, b.total_price, b.status,
             json_build_object('vehicle_name', v.vehicle_name, 'registration_number', v.registration_number, 'type', v.type) AS vehicle
      FROM Bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.customer_id = $1
      ORDER BY b.id ASC
    `,
      [userId]
    );
  }

  return result.rows;
};

export const bookingService = {
  createBooking,
  getBookings,
};
