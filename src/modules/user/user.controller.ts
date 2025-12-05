import { Request, Response } from "express";
import { userServices } from "./user.service";






const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userServices.createUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};















export const userControllers = {
  createUser,
  
};
