import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
// import chatRoute from "./routes/chat.route.js";
// import messageRoute from "./routes/message.route.js";
import dotenv from 'dotenv';
// Load environment variables from the .env file
dotenv.config({ path: './.env' });


const app = express();
app.use(cors({ 
  origin: process.env.CLIENT_URL, // pass client side URL
  credentials: true // true bc we are sending cookies to client side
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/test", testRoute);
app.use("/api/users", userRoute);
// app.use("/api/chats", chatRoute);
// app.use("/api/messages", messageRoute);

app.listen(8800, () => {
  console.log("Server is running!");
});
