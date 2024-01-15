import express from "express";
import router from "./routes/routes.js";
import cors from "cors";

const port = 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router)
app.listen(port, () => {
  console.log("Server running with nodemon on: " + port);
});



