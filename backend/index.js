const express = require("express");
require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const cors = require("cors");

const db = mongoose
  .connect(process.env.URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log(error));

const messageSchema = new mongoose.Schema({
  message: String,
});
const Message = mongoose.model("Message", messageSchema);

app.use(cors());
app.use(express.json());

app.get("/api/getAllMessages", async (req, res) => {
  try {
    const messages = await Message.find();
    res.send(messages);
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/send", (req, res) => {
  const { message } = req.body;
  try {
    const newMessage = new Message({ message });
    newMessage.save();
    res
      .status(201)
      .json({ data: message, message: "Message sent successfully" });
  } catch (error) {}
  res.status(200).json({ message: "message stored" });
});

app.delete("/api/delete", async (req, res) => {
  const { id } = req.body;
  try {
    if (id) {
      await Message.findByIdAndDelete(id);
      res.status(200).json({ message: "message deleted" });
    } else {
      res.status(400).json({ message: "id is required" });
    }
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, (req, res) => {
  console.log(`port is running on ${port}`);
});
