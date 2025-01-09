const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const port = 8080;
require("dotenv").config();

app.use(cors());
app.use(express.json());

const db = mongoose.connect(process.env.URL).then(() => {
  console.log("Database Connected");
});

const messageSchema = mongoose.Schema({
  message: String,
});
const Message = mongoose.model("Message", messageSchema);

app.get("/", (req, res) => {
  res.send("Server working");
});

app.get("/api/messages", async (req, res) => {
  const messages = await Message.find();
  res.status(200).json(messages);
});

app.post("/api/send", async (req, res) => {
  const { message } = req.body;
  try {
    const newMessage = new Message({ message });
    newMessage.save();
    res.status(201).json({ message: "Message Save Successfully" });
  } catch (error) {
    console.log(error);
  }
});

app.delete("/api/delete", async (req, res) => {
  const { id } = req.body;
  try {
    await Message.findByIdAndDelete(id);
    res.status(200).json({ message: "Message Deleated" });
  } catch (error) {
    console.log(error);
  }
});

app.put("/api/update", async (req, res) => {
  const { id, newMessage } = req.body;
  try {
    await Message.findByIdAndUpdate(id, { message: newMessage });
    res.status(200).json({ message: "Message Updated" });
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, (req, res) => {
  console.log(`server running on port : ${port}`);
});
