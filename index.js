import express from "express";
import router from "./routes/routes.js";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";

const port = process.env.PORT || 3000;
const app = express();
app.use(cors({
  origin: 'https://todo-app-jm.netlify.app',
  //origin: 'http://localhost:4200',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", router)
app.get("/", (_req, res)=> {
  res.send("Hello, this is a basic api to serve a todo list app");
})
app.listen(port, () => {
  console.log("Server running with nodemon on: " + port);
});



