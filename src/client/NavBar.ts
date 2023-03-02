import { debounce } from "async";

export const NavBar = (function NavBarInit() {
  let state: "auto" | "open" | "closed" = "auto";
  let isWideEnoughToBeOpen: boolean;
  let scrollY = 0;
  let el: HTMLElement;
  function mount() {
    el = document.querySelector("#NavBar")!;

    if (!el) {
      throw new Error("Couldn't find #NavBar in DOM");
    }

    el.addEventListener("click", handleToggle);

    globalThis.addEventListener("resize", handleWindowResize);
    globalThis.addEventListener("scroll", handleScroll);

    el.classList.add("NavBar--mounted")
    handleWindowSize();
    handleScrollWithoutDebouncing();
    update();
  }

  function handleWindowSize() {
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
        ? isWideEnoughToBeOpen && scrollY === 0
          ? "closed"
          : "open"
        : state === "open"
          ? "closed"
          : "open";
    update();
  }

  function handleScrollWithoutDebouncing () {
    const oldValue = scrollY
    scrollY = window.scrollY
    if(oldValue !== scrollY) {
      update()
    }
  }

  const handleScroll = debounce(handleScrollWithoutDebouncing, 200)

  function update() {
    if (state === "open" || state === "auto" && isWideEnoughToBeOpen && scrollY === 0) {
      el.classList.add("NavBar--open");
      el.classList.remove("NavBar--closed");
      document.body.classList.add("NavBar-bodyHack--open");
    }
    if(state === "closed" || state === "auto" && scrollY > 0) {
      el.classList.add("NavBar--closed", "NavBar--closing");
      el.classList.remove("NavBar--open");
      document.body.classList.remove("NavBar-bodyHack--open");

      setTimeout(() => {
        el.classList.remove("NavBar--closing");
      }, 500)
    }
  }

  return {
    mount,
  };
})();
