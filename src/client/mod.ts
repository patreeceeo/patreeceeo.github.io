interface MessageFromServer {
  type: "resourceUpdate";
}

connect()


function connect(reconnecting = false) {
  const wsProtocol = location.origin.startsWith('https') ? 'wss' : 'ws'

  const socket = new WebSocket(`${wsProtocol}://${location.host}/liveSocket`);
  socket.onopen = () => {
    console.log("liveSocket open!");
    if(reconnecting) {
      // assume something has been updated
      handleResourceUpdate()
    }
  };
  socket.onclose = () => {
    console.log("liveSocket close! attempting to re-open");
  };

  socket.onmessage = routeMessage;

  window.onbeforeunload = () => {
    socket.close();
  };
  const interval = setInterval(() => {
    if (socket.readyState === socket.CLOSED) {
      clearInterval(interval)
      connect(true);
    }
  }, 200);
}

const socketRouter = {
  resourceUpdate: handleResourceUpdate,
};

function routeMessage(message: MessageEvent) {
  console.log("liveSocket received", message.data);
  const parsedMessage = JSON.parse(message.data) as MessageFromServer;

  const handler = socketRouter[parsedMessage.type];
  if (handler) {
    handler();
  } else {
    console.warn("No handler for", parsedMessage.type);
  }
}

function handleResourceUpdate() {
  window.location.reload();
}

