


const express = require("express");
const app = express();
const cors = require("cors");

require('dotenv').config();
const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));


//for ad upload
// app.use(express.json());
// const fileupload = require("express-fileupload");
// // app.use(fileupload());
// app.use(fileupload({
//     useTempFiles: true,
//     tempFileDir: '/tmp/',
//     createParentPath: true
// }));

const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());

require("./config/database").connect();

// Import routes
const user = require("./Routes/authRoutes");
const admin = require("./Routes/adminRoutes");
const mining = require("./Routes/miningRoutes");
const withdrawal = require("./Routes/withdrawalRoutes");
const deposit = require("./Routes/depositRoutes");
const settings = require("./Routes/settingsRoutes");
const tasks = require("./Routes/taskRoutes");

// Use routes
app.use("/api", user);
app.use("/api/admin", admin);
app.use("/api/mining", mining);
app.use("/api/withdrawal", withdrawal);
app.use("/api/deposit", deposit);
app.use("/api/settings", settings);
app.use("/api/tasks", tasks);

app.listen(PORT, () => {
    console.log(`App is listening at http://localhost:${PORT}`);
});

