import { User } from "../modules/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendMail from "../middleware/sendemail.js";

// new user registration
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, contact } = req.body;

    // check email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User email already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // 6 digit

    // store temporary user data inside JWT
    const userdata = { name, email, password: hashedPassword, contact };
    const activationtoken = jwt.sign(
      { userdata, otp },
      process.env.ACTIVATION_SECRET,
      { expiresIn: "5m" }
    );

    // send OTP to email
    const message = `Please verify your account. Your OTP is: ${otp}`;
    await sendMail(email, "Welcome! Verify your account", message);

    return res.status(200).json({
      message: "OTP sent to your email",
      activationtoken // (Only for testing, remove in production)
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// verify otp
export const verifyUser = async (req, res) => {
  try {
    const { otp, activationtoken } = req.body;

    // verify activation token
    const verify = jwt.verify(activationtoken, process.env.ACTIVATION_SECRET);

    if (parseInt(verify.otp) !== parseInt(otp)) {
      console.log("Token OTP:", verify.otp, "Request OTP:", otp);
      return res.status(400).json({ message: "Wrong OTP" });
    }

    // Save user in DB after OTP success
    await User.create({
      name: verify.userdata.name,
      email: verify.userdata.email,
      password: verify.userdata.password,
      contact: verify.userdata.contact,
    });

    return res.status(200).json({ message: "User Registration Success" });

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "OTP expired" });
    }
    return res.status(500).json({ message: error.message });
  }
};

// login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log("Login request:", email, password);
    console.log("User from DB:", user);

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    console.log("Password match result:", matchPassword);

    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15d"
    });

    return res.status(200).json({
      message: `Login successful! Welcome, ${user.name}`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
//  user profile
export const profileUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
