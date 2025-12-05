import express from "express";
import auth from "../../middleware/auth";
import { bookingController } from "./booking.controller";


const router = express.Router();

router.post("/", auth("customer", "admin"), bookingController.createBooking);
router.get("/" , auth("customer" , "admin"), bookingController.getBookings);




export const bookingRoute = router;
