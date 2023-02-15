interface MessageFromServer {
  type: "resourceUpdate";
}

connect()


function connect() {
  const socket = new WebSocket(`ws://${location.host}/devSocket`);
  socket.onopen = () => {
    console.log("devSocket open!");
  };
  socket.onclose = () => {
    console.log("devSocket close! attempting to re-open");
  };

  socket.onmessage = routeMessage;

  window.onbeforeunload = () => {
    socket.close();
  };
  const interval = setInterval(() => {
    if (socket.readyState === socket.CLOSED) {
      clearInterval(interval)
      connect();
    }
  }, 200);
}

const socketRouter = {
  resourceUpdate: handleResourceUpdate,
};

function routeMessage(message: MessageEvent) {
  console.log("devSocket received", message.data);
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

