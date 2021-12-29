const socket = io();
const nickForm = document.getElementById("nickForm");
const chatList = document.getElementById("chatList");
const msgForm = document.getElementById("msgForm");
const roomForm = document.getElementById("roomForm");
const chatPlace = document.getElementById("chatPlace");
const roomHead = document.getElementById("roomName");
const roomList = document.getElementById("roomList");

nickForm.hidden = true;
chatPlace.hidden = true;

let roomName;

const createChat = (msg) => {
    const li = document.createElement("li");
    li.innerText = msg;
    chatList.append(li);
}

const showRoomHead = (name, size) => {
    roomHead.innerText = `${name} (${size})`
}

const showRoom = (name, size) => {
    roomList.hidden = true;
    roomForm.hidden = true;
    nickForm.hidden = false;
    showRoomHead(name, size);
};

const showChat = () => {
    nickForm.hidden = true;
    chatPlace.hidden = false;
    const handleMsgSubmit = (e) => {
        e.preventDefault();
        const input = msgForm.querySelector("input[type=text");
        const msg = input.value;
        socket.emit("message", msg, roomName, createChat);
        input.value = ""
    };
    msgForm.addEventListener("submit", handleMsgSubmit);
}

const handleRoomSubmit = (e) => {
    e.preventDefault();
    const input = roomForm.querySelector("input[type=text]");
    roomName = input.value;
    socket.emit("room", roomName, showRoom);
    input.value = "";
};

const handleNickSubmit = (e) => {
    e.preventDefault();
    const input = nickForm.querySelector("input[type=text");
    const nickName = input.value;
    socket.emit("nickName", roomName, nickName, showChat);
    input.value = "";
};

socket.on("changeRoom", (rooms) => {
    roomList.innerHTML = "";
    rooms.forEach(room => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    })
})

socket.on("message", (msg, nickName) => {
    createChat(`${nickName} : ${msg}`);
})

socket.on("welcome", (nickName, roomSize) => {
    showRoomHead(roomName, roomSize);
    createChat(`${nickName} entered.`);
});

socket.on("bye", (nickName, roomSize) => {
    showRoomHead(roomName, roomSize);
    createChat(`${nickName} has left.`)
})

roomForm.addEventListener("submit", handleRoomSubmit);
nickForm.addEventListener("submit", handleNickSubmit);

