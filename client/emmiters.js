const socket = io();

function login() {
    let name = document.getElementById("nameInput").value;
    socket.emit("login", name);
}

function joinGame() {
    socket.emit("joinGame");
}

function startGame() {
    socket.emit("startGame");
}

function stopGame() {
    socket.emit("stopGame");
}