import http from "http";
import express from "express";
import morgan from "morgan";
import WebSocket from "ws";


const app = express();

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use("/public", express.static(__dirname + "/public"));
app.use(morgan("dev"));

app.get("/", (_, res) => {
    res.render("home");
})
app.get("/*", (_, res) => {
    res.redirect("/");
})

const server = http.createServer(app);
const ws = new WebSocket.Server({ server });

const socketDB = [];

ws.on("connection", (socket) => {
    socketDB.push(socket);
    socket["nickName"] = "Anon";
    console.log("socket connect");
    socket.on("close", () => {
        console.log("disconnect from browser");
    })
    socket.on("message", (m) => {
        const parsedMsg = JSON.parse(m);
        switch (parsedMsg.type) {
            case "newMsg":
                socketDB.forEach(aSocket => aSocket.send(`${socket["nickName"]} : ${parsedMsg.payload}`));
                break;

            case "nickName":
                socket["nickName"] = parsedMsg.payload;
                break;
        }
    })
})

server.listen(4000, () => { console.log("listening on port 4000") });
