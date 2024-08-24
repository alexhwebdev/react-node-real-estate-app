import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import dotenv from 'dotenv';
// Load environment variables from the .env file
dotenv.config({ path: '../.env' });


export const register = async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(hashedPassword);

    // CREATE NEW USER, THEN SAVE TO DB
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    console.log(newUser);
    res.status(201).json({ message: "User created successfully" });
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create user!"});
  }
}

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // CHECK IF THE USER EXISTS
    const user = await prisma.user.findUnique({
      // where: { username }, // can do this way
      where: { username: username },
    });
    if (!user) return res.status(400).json({ message: "Invalid Credentials!" });

    // CHECK IF THE PASSWORD IS CORRECT
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid Credentials!" });

    // GENERATE COOKIE TOKEN AND SEND TO THE USER
    // res.setHeader("Set-Cookie", "test=" + "myValue").json("success")
    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: true,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    const { password: userPassword, ...userInfo } = user;

    res
      // .cookie("test2", "myValue2", {
      .cookie("token", token, {
        httpOnly: true,
        // secure:true, // In Production, set this to true. Right now we are using localhost so comment it out.
        maxAge: age, // Cookie expires when we close our Session so add this.
      })
      .status(200)
      .json(userInfo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to login!" });
  }
}

export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};


// --------------------------------------------------
// export const login = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     // CHECK IF THE USER EXISTS

//     const user = await prisma.user.findUnique({
//       where: { username },
//     });

//     if (!user) return res.status(400).json({ message: "Invalid Credentials!" });

//     // CHECK IF THE PASSWORD IS CORRECT
//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (!isPasswordValid)
//       return res.status(400).json({ message: "Invalid Credentials!" });

//     // GENERATE COOKIE TOKEN AND SEND TO THE USER
//     // res.setHeader("Set-Cookie", "test=" + "myValue").json("success")
//     const age = 1000 * 60 * 60 * 24 * 7;

//     const token = jwt.sign(
//       {
//         id: user.id,
//         isAdmin: false,
//       },
//       process.env.JWT_SECRET_KEY,
//       { expiresIn: age }
//     );

//     const { password: userPassword, ...userInfo } = user;

//     res
//       .cookie("token", token, {
//         httpOnly: true,
//         // secure:true,
//         maxAge: age,
//       })
//       .status(200)
//       .json(userInfo);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to login!" });
//   }
// };

// export const logout = (req, res) => {
//   res.clearCookie("token").status(200).json({ message: "Logout Successful" });
// };
