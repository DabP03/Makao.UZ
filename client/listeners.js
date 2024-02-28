let game;
let playersInLobby;

socket.on("connect", () => {
    console.log(`connected`);
});

socket.on("disconnect", () => {
    console.log(`disconnected`);
});

socket.on("info", (message) => {
    console.log(`info: ${message}`)
});

socket.on("playersUpdated", (players) => {
    console.log(`players in game: ${players}`);
});

socket.on("gameEnded", () => {
    console.log(`game ended`);
});

socket.on("changeDivLobby", () => {
    document.getElementById('loginDiv').setAttribute("style", "display:none");
    document.getElementById('lobbyDiv').setAttribute("style", "display:block");
});

socket.on("lobbyPlayers", (playerNames) => {
    playersInLobby = playerNames;
    console.log(playerNames);
    document.querySelector("players").innerHTML = `<ol>${playersInLobby}</ol>`;
});
