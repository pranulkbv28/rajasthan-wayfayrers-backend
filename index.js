import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { serverPort } from "./constants.js";
import connectToDb from "./db/index.db.js";
import userRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/adminRoutes/cab.routes.js";
import cors from "cors"


dotenv.config({
  path: "./.env",
});

const app = express();

const corsOptions = {
  origin: 'https://3000-idx-rajasthanwayfarersfe-172043481537…qyfcabgo6.cloudworkstations.dev/',
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Enable credentials (cookies, authorization headers) cross-origin
}

app.use(cors({ corsOptions }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const port = serverPort;

app.use("/api/v1/user", userRoutes);
app.use("/api/vi/admin", adminRoutes);
// app.get("/test", (req, res) => {
//   res.send("Hello World!");
// });

app.listen(port, () => {
  connectToDb();
  // console.log(port);
  // console.log(process.env.MONGODB_URI);
  // console.log(process.env.REFRESH_TOKEN_SECRET);
  // console.log(process.env.ACCESS_TOKEN_SECRET);
  console.log(`Server is running on: http://localhost:${port}`);
});
