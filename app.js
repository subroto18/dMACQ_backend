const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const activitiesRoute = require("./src/routes/activityRoutes");

const allowedOrigins = [process.env.CLIENT_URL, "https://dmacq.netlify.app/"];

const app = express();

// connect DB
connectDB();

// create HTTP server from express
const server = http.createServer(app);

// attach socket.io to server
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  },
});

// make io accessible globally (simple approach)

app.set("io", io);

// socket connection handler
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

// routes
app.use("/api", activitiesRoute);

// health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
