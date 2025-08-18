import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';



const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        // console.log("User found for token generation:", user);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save()

        return {accessToken, refreshToken}


    } catch (error) {
        throw new Error("Something went wrong while generating refresh and access token")
    }
}


// Register User
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login User
export const loginUser = async (req, res) => {

  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT
    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    // const localStorage = globalThis.localStorage || {}; // Fallback for server-side
    // if (!localStorage.setItem) {
    //   localStorage.setItem = (key, value) => {
    //     localStorage[key] = value;
    //   }; 
    // }
    // localStorage.setItem("token", token);
  const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken")

     const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined
    }


    res.
    status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      { 
        user: loggedInUser,
        accessToken,
        refreshToken
      }
    );
  } catch (err) { 
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const refreshAccessToken = async(req,res)=>{
  const incomingRefreshToken= req.cookies.refreshToken || req.body.refreshToken;

  if(!incomingRefreshToken) return res.status(401).json({ message: 'Refresh token is required' });

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    )
    const user =await User.findById(decodedToken?.id);
    if(!user){
      throw new Error('Invalid refresh token');
    }
    if(incomingRefreshToken!=user?.refreshToken){
            throw new Error("Invalid refresh token")
        }

     const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined
    }
    const {accessToken,refreshToken: newRefreshToken}=await generateAccessAndRefereshTokens(user._id)
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",newRefreshToken,options)
    .json(
        {
          accessToken,
          refreshToken: newRefreshToken
        }
    )

  } catch (err) {
    res.status(500).json({ message: 'Error refreshing the access token', error: err.message });
  }
}

export const logoutUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { refreshToken: 1 } },
      { new: true }
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: 'Logout failed', error: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -refreshToken");
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user', error: error.message });
  }
};
