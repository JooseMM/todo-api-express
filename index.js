import express from "express";
import router from "./routes/routes.js";
import cors from "cors";
import 'dotenv/config';

const port = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router)
app.listen(port, () => {
  console.log("Server running with nodemon on: " + port);
});



