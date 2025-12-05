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




const updateUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.userId);
    const loggedInUser = req.user;


    if (loggedInUser?.role === "customer" && loggedInUser?.id !== id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update other users",
      });
    }

    const user = await userServices.updateUser(id, req.body);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
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
  updateUser,
  deleteUser,
};
