import { Controller } from '@hotwired/stimulus';

export class LayoutController extends Controller {
  static targets = ['sidebarList'];

  connect(): void {
    window.addEventListener('resize', this.onResize, {passive: true});
  }

  viewportHeightThreshold = 0;

  onResize = () => {
    // prevent the list from vertically overflowing the viewport
    // If the viewport is too short to show all items, toggle the is-mobile class
    const listElement = this.targets.find('sidebarList')!;
    const {element} = this;
    const {top, bottom} = listElement.getBoundingClientRect();
    const listHeight = bottom - top;
    element.classList.toggle('is-mobile', listHeight > 0 ? top < 0 || bottom > window.innerHeight : window.innerHeight < this.viewportHeightThreshold);
    if(listHeight > 0) {
      this.viewportHeightThreshold = window.innerHeight;
    }
  }
}
