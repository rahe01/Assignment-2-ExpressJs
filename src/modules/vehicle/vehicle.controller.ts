import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehicleServices.createVehicle(req.body);

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: vehicle,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};






const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await vehicleServices.getAllVehicles();

    res.status(200).json({
      success: true,
      message: vehicles.length
        ? "Vehicles retrieved successfully"
        : "No vehicles found",
      data: vehicles,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};










const getVehicleById = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehicleServices.getVehicleById(
      Number(req.params.vehicleId)
    );

    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: vehicle,
    });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
};








const updateVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehicleServices.updateVehicle(
      Number(req.params.vehicleId),
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: vehicle,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};









const deleteVehicle = async (req: Request, res: Response) => {
  try {
    await vehicleServices.deleteVehicle(Number(req.params.vehicleId));

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};







export const vehicleController = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
