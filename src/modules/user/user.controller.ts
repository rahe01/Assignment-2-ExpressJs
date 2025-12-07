import { Request, Response } from "express";
import { userServices } from "./user.service";




const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userServices.getAllUsers();

    res.status(200).json({
      success: true,
      message: users.length ? "Users retrieved successfully" : "No users found",
      data: users,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};




const updateUsers = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const payload = req.body;

    const requesterId = Number(req.user.id); 
    const requesterRole = req.user.role;      

    const updated = await userServices.updateUser(
      userId,
      payload,
      requesterRole,
      requesterId
    );

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updated,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};




const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.userId);

    
    await userServices.deleteUser(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};





export const userControllers = {
 
  getAllUsers,
  updateUsers,
  deleteUser,
};
