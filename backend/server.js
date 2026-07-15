import express from "express";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat.js";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    console.log("THIS IS MY SERVER.JS");
  res.send("Server is working!");
});

app.use("/api/chat", chatRoutes);


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});