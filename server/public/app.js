const socket = io("ws://localhost:3500");

const msgInput = document.querySelector(".msgInput");
const nameInput = document.querySelector("#name");
const chatRoom = document.querySelector("#room");
const usersList = document.querySelector(".user-list");
const roomList = document.querySelector(".room-list");
const chatDisplay = document.querySelector(".chat-display");

function sendMessage(e) {
  console.log("send message pressed");
  e.preventDefault();
  if (nameInput.value && chatRoom.value && msgInput.value) {
    socket.emit("message", {
      name: nameInput.value,
      text: msgInput.value,
    });
    msgInput.value = "";
  }
  msgInput.focus();
}

function enterRoom(e) {
  e.preventDefault();
  if (nameInput.value && chatRoom.value) {
    socket.emit("enterRoom", {
      name: nameInput.value,
      room: chatRoom.value,
    });

    document.querySelector(".avatar").textContent = nameInput.value
      .slice(0, 1)
      .toUpperCase();

    document.getElementById("name-area").textContent = nameInput.value;
  }
}

document.querySelector(".form-join").addEventListener("submit", enterRoom);

document.querySelector(".form-msg").addEventListener("submit", sendMessage);

// lsiten for messages

socket.on("message", (data) => {
  // activity.textContent = "";
  const { name, text, time } = data;
  const li = document.createElement("li");
  li.className = "post";

  if (name === nameInput.value) li.className = "post post--left";
  if (name !== nameInput.value && name !== "Admin")
    li.className = "post post--right";

  if (name !== "Admin") {
    li.innerHTML = `<div class ="post__header ${
      name === nameInput.value ? "post__header--user" : "post__header--reply"
    }">
      <span class="post__header--name">${name}</span>
      <span class="post__header--time">${time}</span>
      </div>
      <div class="post__text">${text}</div>`;
  } else {
    li.innerHTML = `<div class="post__text">${text}</div>`;
  }

  document.querySelector(".chat-display").appendChild(li);

  chatDisplay.scrollTop = chatDisplay.scrollHeight;
});

// ...............

let activityTimer;
socket.on("activity", (name) => {
  activity.textContent = `${name} is typing...`;

  // Clear after 3 seconds
  clearTimeout(activityTimer);
  activityTimer = setTimeout(() => {
    activity.textContent = "";
  }, 2000);
});

socket.on("userList", ({ users }) => {
  showUsers(users);
});

socket.on("roomList", ({ rooms }) => {
  showRooms(rooms);
});

function showUsers(users) {
  usersList.textContent = "";

  if (users) {
    // usersList.innerHTML = `<em>Users in ${chatRoom.value}:</em>`;
    users.forEach((user, i) => {
      const li = document.createElement("li");
      li.textContent = user.name;
      usersList.appendChild(li);
      // usersList.textContent += `${user.name}`;
      // if (users.length > 1 && i !== user.length - 1) {
      //   usersList.textContent += ",";
      // }
    });
  }
}
function showRooms(rooms) {
  roomList.textContent = "";

  if (rooms) {
    // roomList.innerHTML = "<em>Active Rooms:</em> ";
    rooms.forEach((room, i) => {
      const li = document.createElement("li");
      li.textContent = room;
      roomList.appendChild(li);
      // roomList.textContent += `${room}`;
      // if (rooms.length > 1 && i !== rooms.length - 1) {
      //   roomList.textContent += ",";
      // }
    });
  }
}
