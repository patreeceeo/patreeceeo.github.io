import { debounce } from "async";

interface MessageFromServer {
  type: "resourceUpdate";
}

connect();

function connect(reconnecting = false) {
  const wsProtocol = location.origin.startsWith("https") ? "wss" : "ws";

  const socket = new WebSocket(`${wsProtocol}://${location.host}/liveSocket`);
  socket.onopen = () => {
    console.log("liveSocket open!");
    if (reconnecting) {
      // assume something has been updated
      handleResourceUpdate();
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
      clearInterval(interval);
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

/* More reason to migrate to Svelte, React... I guess. */

setTimeout(() => {
  NavBar.mount();
}, 100);

const NavBar = (function NavBarInit() {
  let state: "auto" | "open" | "closed" = "auto";
  let isWideEnoughToBeOpen: boolean;
  let el: HTMLElement;
  function mount() {
    el = document.querySelector("#NavBar")!;

    if (!el) {
      throw new Error("Couldn't find #NavBar in DOM");
    }

    const elToggle = el?.querySelector(".NavToggle");

    elToggle?.addEventListener("click", handleToggle);

    globalThis.addEventListener("resize", handleWindowResize);

    el.classList.add("NavBar--mounted")
    handleWindowSize();
    update();
  }

  function handleWindowSize() {
    console.log("handleSize");
    const oldValue = isWideEnoughToBeOpen;
    isWideEnoughToBeOpen = window.innerWidth > 1050;
    if (oldValue !== isWideEnoughToBeOpen) {
      update();
    }
  }

  const handleWindowResize = debounce(handleWindowSize, 200);

  function handleToggle() {
    state =
      state === "auto"
        ? isWideEnoughToBeOpen
          ? "closed"
          : "open"
        : state === "open"
          ? "closed"
          : "open";
    update();
  }

  function update() {
    console.log({isWideEnoughToBeOpen, state})
    // if ((isWideEnoughToBeOpen && state === "auto") || state === "open") {
    if (state === "open") {
      el.classList.add("NavBar--open");
      el.classList.remove("NavBar--closed");
    }
    if(state === "closed") {
      el.classList.add("NavBar--closed");
      el.classList.remove("NavBar--open");
    }
  }

  return {
    mount,
  };
})();
