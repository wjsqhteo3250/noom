import http from "http";
import express from "express";
import morgan from "morgan";
import socketIo from "socket.io";


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
const io = socketIo(server);

const getPublicRooms = () => {
    const rooms = io.sockets.adapter.rooms;
    const sids = io.sockets.adapter.sids;
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if (sids.get(key) === undefined) {
            publicRooms.push(key);
        }
    })
    return publicRooms;
}

const getRoomSize = (roomName) => {
    return io.sockets.adapter.rooms.get(roomName)?.size;
}

io.on("connection", (socket) => {
    socket.onAny((event) => {
        console.log(`socket event : ${event}`);
    })
    socket["nickName"] = "Anon";
    socket.on("room", (roomName, done) => {
        socket.join(roomName);
        done(roomName, getRoomSize(roomName));
        io.sockets.emit("changeRoom", getPublicRooms());
    })
    socket.on("nickName", (roomName, nickName, done) => {
        socket.to(roomName).emit("welcome", nickName, getRoomSize(roomName));
        socket["nickName"] = nickName;
        done();
    })
    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => {
            socket.to(room).emit("bye", socket["nickName"], getRoomSize(room) - 1);
        });
    })
    socket.on("disconnect", () => {
        io.sockets.emit("changeRoom", getPublicRooms());
    })
    socket.on("message", (msg, roomName, done) => {
        socket.to(roomName).emit("message", msg, socket["nickName"]);
        done(`you : ${msg}`);
    })
})

// const ws = new WebSocket.Server({ server });
// const socketDB = [];
// ws.on("connection", (socket) => {
//     socketDB.push(socket);
//     socket["nickName"] = "Anon";
//     console.log("socket connect");
//     socket.on("close", () => {
//         console.log("disconnect from browser");
//     })
//     socket.on("message", (m) => {
//         const parsedMsg = JSON.parse(m);
//         switch (parsedMsg.type) {
//             case "newMsg":
//                 socketDB.forEach(aSocket => aSocket.send(`${socket["nickName"]} : ${parsedMsg.payload}`));
//                 break;

//             case "nickName":
//                 socket["nickName"] = parsedMsg.payload;
//                 break;
//         }
//     })
// })

server.listen(4000, () => { console.log("listening on port 4000") });
