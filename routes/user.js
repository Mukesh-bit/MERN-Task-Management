const router = require("express").Router();
const userModal = require("../models/userModal");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Sign-up
router.post("/signUp", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await userModal.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exist..." });
    } else {
      const hashPassword = await bcrypt.hash(password, 10);

      const newUser = new userModal({
        name: name,
        email: email,
        password: hashPassword,
      });
      await newUser.save();
      res.status(200).json({ message: "signUp successfully..." });
    }
  } catch (error) {
    console.log(error);
  }
});

// Sign-in
router.post("/signIn", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModal.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "Email or Password Invalid!" });
    }

    bcrypt.compare(password, user.password, (err, data) => {
      if (data) {
        const authClaims = [
          { name: email },
          { jti: jwt.sign({}, "taskManagement") },
        ];
        const token = jwt.sign({ authClaims }, "taskManagement", {
          expiresIn: "2d",
        });

        res.status(200).json({ id: user._id, token: token });
      } else {
        return res.status(400).json({ message: "Email or Password Invalid!" });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
