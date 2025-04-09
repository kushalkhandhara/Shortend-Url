import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';


// Email & Password Validator Functions
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  // At least 8 characters, one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};



// Register new user
export const register = async (req, res) => {
  const { email, password } = req.body;
 
  // Validate email and password
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format',success: false });
  }
  if (!isValidPassword(password)) {
    return res.status(400).json({
      message:
        'Password must be at least 8 characters long and include uppercase, lowercase, and a number',
        success: false
    });
  }

  if(email.trim()==="" || password.trim()===""){
    return res.status(400).json({ message: 'Both Fields are required',success: false });
  }
 
  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists',success: false });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with hashed password
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1d', // Token expiration time
    });

    res.status(200).json({ 
      "token" :token,
      "userId": newUser._id,
      "message": "User registered successfully",
      "success": true
    });


  } catch (err) {
    res.status(500).json({ message: 'Server error',success: false });
  }
};

// Login existing user
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format',success: false });
  }
  if (!isValidPassword(password)) {
    return res.status(400).json({
      message:
        'Password must be at least 8 characters long and include uppercase, lowercase, and a number',
        success: false
    });
  }

  if(email.trim()==="" || password.trim()===""){
    return res.status(400).json({ message: 'Both Fields are required',success: false });
  }
  


  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials',success: false });
  }

  try {
    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials',success: false  });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d', // Token expiration time
    });

    res.status(200).json({ 
      "token" :token,
      "userId": user._id,
      "message": "User logged in successfully",
      "success": true
    }); 
  
  
  } catch (err) {
    res.status(500).json({ message: 'Server error',success: false });
  }
};
