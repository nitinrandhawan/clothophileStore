import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ConnectDB } from "./DB/index.js";

dotenv.config();

ConnectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}))
const PORT = process.env.PORT || 8000;


// routes
import UserRouter from './Routes/User.routes.js'
import ProductRoute from './Routes/Product.routes.js'
import CartRoute from './Routes/Cart.routes.js'
app.use("/",UserRouter)
app.use("/",ProductRoute)
app.use("/",CartRoute)
app.listen(PORT, () => {
  console.log(`app is listening on ${PORT}`);
});
