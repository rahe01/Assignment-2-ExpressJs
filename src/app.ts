import express, { Request, Response } from "express";
import initDB, { pool } from "./config/db";
import { userRoutes } from "./modules/user/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { vehicleRoutes } from "./modules/vehicle/vehicle.routes";



const app = express();


// parser
app.use(express.json());


// initializing db
initDB();



app.get("/",  (req: Request, res: Response) => {
  res.send("Hello World! Next level");
});




// ===========user ===========

app.use("/api/v1/auth/" , userRoutes)




//=======================auth routes================
app.use("/api/v1/auth/", authRoutes);


// ========================vehicle routes================


app.use("/api/v1/" , vehicleRoutes);



// ==================Not found=================================

app.use((req:Request, res: Response) =>{

    res.status(404).json({
        success:false,
        message: "Route not found",
        path: req.path
    })


})




export default app;