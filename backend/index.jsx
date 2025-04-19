const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcrypt");
const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
const PORT = 3000;
const secretKey = process.env.JWT_SECRET;

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

const validateToken = (req, res, next) => {
  const accessToken = req.headers["authorization"];
  if (!accessToken) {
    return res.status(401).json({ message: "Access token required" });
  }
  const token = accessToken.split(" ")[1];
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    res.status(201).send("User created");
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send("Email already exists");
    } else {
      res.status(500).send("User not created");
    }
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (isPasswordCorrect) {
        const accessToken = jwt.sign(
          { email: user.email, role: user.role },
          secretKey,
          { expiresIn: "1h" }
        );
        res.json({
          email: user.email,
          role: user.role,
          accessToken,
        });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred during login" });
  }
});

app.get("/api/users", validateToken, (req, res) => {
  User.find().then((users) => res.json(users));
});

app.delete("/api/users/:id", validateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.send("User deleted");
  } catch (error) {
    res.status(500).send("Error deleting user");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
