const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
const PORT = 3000;

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
});

const User = mongoose.model("User", userSchema);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;
  const user = new User({ name, email, password });
  user.save();
  if (user) {
    res.send("User created");
  } else {
    res.send("User not created");
  }
});

app.get("/api/users", (req, res) => {
  User.find().then((users) => res.json(users));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
