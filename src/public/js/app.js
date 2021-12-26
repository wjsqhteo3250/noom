const socket = new WebSocket(`ws://${window.location.host}`);

const nickForm = document.getElementById("nickForm");
const chatList = document.getElementById("chatList");
const msgForm = document.getElementById("msgForm");

function stringifyToJson(type, payload) {
    const obj = { type, payload }
    return JSON.stringify(obj);
}

socket.addEventListener("open", () => {
    console.log("socket connect form server");
})

socket.addEventListener("close", () => {
    console.log("socket disconnect from server");
})

socket.addEventListener("message", (m) => {
    const li = document.createElement("li");
    li.innerText = m.data;
    chatList.append(li);
})

const handleSendMsg = (e) => {
    e.preventDefault();
    const input = msgForm.querySelector("input[type=text]");
    const msgObj = stringifyToJson("newMsg", input.value);
    socket.send(msgObj);
    input.value = "";
}

const handleSendNick = (e) => {
    e.preventDefault();
    const input = nickForm.querySelector("input[type=text]");
    const msgObj = stringifyToJson("nickName", input.value);
    socket.send(msgObj);
    input.value = "";
}

msgForm.addEventListener("submit", handleSendMsg);
nickForm.addEventListener("submit", handleSendNick);