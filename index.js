import express from "express";
import router from "./routes/routes.js";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";

const port = process.env.PORT || 3000;
const app = express();
app.use(cors({ methods: ['GET', 'POST', 'PUT', 'DELETE']}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", router)
app.listen(port, () => {
  console.log("Server running with nodemon on: " + port);
});



