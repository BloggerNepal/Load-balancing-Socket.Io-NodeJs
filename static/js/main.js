let isJoined = false;

let socket = io();
let myName;

let users = [];

socket.on("message", data => {
    if (data.to) {
        //is from broadcast
        if (myName == data.to) {
            addToB(data.from, data.message, data.server);

        }
    } else {
        //is from emit
        addToB(data.from, data.message, data.server);
    }

})

socket.on("connected", data => {
    if (data.to) {
        //is from broadcast
        if (myName == data.to) {
            addToB("System", "Connected to server, ", data.server);
        }
    } else {
        //is from emit
        addToB("System", "Connected to server, ", data.server);
    }

    users = [...data.users];
    buildToUsers();
})

socket.on('newUser', data => {
    users.push(data.name)
    buildToUsers();
})

socket.on('userLeft', data =>{
    console.log(data);
    var index = users.indexOf(data.name);
    console.log(index);
    if (index != -1) {
        users.splice(index, 1);
        console.log(users);
        buildToUsers();
    }
})

let join = () => {
    let name = document.getElementById("name").value;
    document.getElementById("join").style.display = "none"
    isJoined = true;
    document.getElementById("chat").style.display = "block";
    // console.log(name);

    myName = name;
    socket.emit("join", {
        name: name
    })

    document.getElementById("me").innerText = myName;
}

let send = () => {
    let message = document.getElementById("message").value;
    let to = document.getElementById("to").value;
    console.log("Send", message, "to", to);
    addToA(message, to);
    socket.emit("send", {
        to: to,
        message: message
    })

}

let spaceForA = document.createElement("br");
document.getElementById('right').appendChild(spaceForA);

function addToA(message, to) {
    let left = document.getElementById('left');

    let br = document.createElement("br");
    let br2 = document.createElement("br");
    left.insertBefore(br, left.childNodes[0]);
    left.insertBefore(br2, left.childNodes[0]);

    let elem = document.createElement("div");
    let messageE = document.createElement("span")
    messageE.textContent = message + " -->";
    let toE = document.createElement("small")
    toE.textContent = to;

    elem.appendChild(messageE);
    elem.appendChild(toE);

    left.insertBefore(elem, left.childNodes[0]);
}



function addToB(from, message, server) {
    let right = document.getElementById('right');

    let br = document.createElement("br");
    let br2 = document.createElement("br");
    right.insertBefore(br, right.childNodes[0]);

    let elem = document.createElement("div");
    let messageE = document.createElement("span")
    messageE.textContent =  from +": " + message + " | ";
    let serverE = document.createElement("small")
    serverE.textContent = server;
    elem.appendChild(messageE);
    elem.appendChild(serverE);

    right.insertBefore(elem, right.childNodes[0]);

    right.insertBefore(br2, right.childNodes[0]);

}

function buildToUsers() {
    // console.log(data.users);
    to = document.getElementById('to');
    to.options.length = 0;

    for (let i = 0; i < users.length; i++) {
        const element = users[i];
        to.options[i] = new Option(element, element);
    }
}

