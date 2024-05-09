const port = process.env.PORT || 8080;
const wsmanager = process.env.WS_MANAGER || "ws.rciots.com";
const { Server } = require("socket.io");
const socketcli = require("socket.io-client");
const fs = require("fs");
const ioclient = new socketcli.connect("https://" + wsmanager , {
  ca: fs.readFileSync('certs/serverCA.crt', 'utf-8'),
  key: fs.readFileSync('certs/client.key', 'utf-8'),
  cert: fs.readFileSync('certs/client.crt', 'utf-8'),
  // allow self-signed certificates
  rejectUnauthorized: true,
  reconnection: true,
  reconnectionDelay: 500
});
//quiero que debuguee la conexión de ioclient que no llega a establecerse
ioclient.on('connect_error', (error) => {
  console.log("connect_error: " + error);
});
ioclient.on('error', (error) => {
  console.log("error: " + error);
});


var controller = "";
var camera = "";
computervision = "";
ioclient.on("connect", () => {
  console.log("connected to wsmanager");
}
);
const io = new Server(port, { /* options */ });
io.on('connection', (socket) => {
  console.log("component connected");
  socket.on("component", (component) => {
    socket.component = component;
    if (component == "hw01") {
      controller = socket;
      console.log("connected hw01");
    } else if (component == "cam01") {
      camera = socket;
      console.log("connected cam01");
    } else if (component == "cv01") {
      computervision = socket;
      console.log("connected cv01");
    }
  });
  socket.on("video", (data) => {
    ioclient.emit("video", data);
  });
  socket.on("color", (data) => {
    ioclient.emit("color", data);
  });
});
ioclient.on("control", (control, act) => {
  console.log("control: " + control + "act: " + act);
  controller.emit("control", control, act);
});
ioclient.on("panic", () => {
  console.log("panic");
  controller.emit("panic");
});
ioclient.on("user_on", (status) => {
  if (controller != "") {
    controller.emit("user_on", status);
  }
  });