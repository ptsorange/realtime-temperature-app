const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const temperatureData = [];
const maxDataData = 200;

app.use(express.json());

app.get("/", (req, res) => {
    res.send(temperatureData);
});

app.post("/sendData", (req, res) => {
    data = req.body;
    temperatureData.push({
        temperature: data.temperature,
        humidity: data.humidity
    });
    if (temperatureData.length > maxDataData) {
        temperatureData.splice(0, temperatureData.length - maxDataData);
    }
    res.status(200).send("Data received");
});

io.on("connection", (socket) => {
    console.log("Client connected");
    socket.on("getNewData", () => {
        socket.emit("newData", temperatureData[temperatureData.length - 1]);
    });
    socket.on("getAllData", () => {
        socket.emit("allData", temperatureData);
    });
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});