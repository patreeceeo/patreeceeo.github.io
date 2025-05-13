import { Controller } from '@hotwired/stimulus';

export class NavSelectController extends Controller<HTMLSelectElement> {
  static values = {
    value: String,
  };

  slugs: string[] = [];

  connect() {
    this.setValue();
    this.slugs = this.data.get('slugs')?.split(',') || [];
    window.addEventListener('scroll', this.onScroll, { passive: true });
  }

  disconnect() {
    window.removeEventListener('scroll', this.onScroll);
  }

  setValue = () => {
    const { element, data } = this;
    element.value = data.get('value') || data.get('defaultValue') as string
  }

  navigateToSelection() {
    location.hash = `${this.element.value}`;
  }

  onScroll = () => {
    const { slugs } = this;
    // Remove the selected class from all items
    const selectedSlug = decideSelectedSlug(slugs);
    if (selectedSlug) {
      this.element.value = selectedSlug;
    }
  }
}

export class NavSidebarController extends Controller<HTMLElement> {
  slugs: string[] = [];
  connect(): void {
    this.slugs = this.data.get('slugs')?.split(',') || [];

    // Listen for scroll events, update the selected item based on the current scroll position
    window.addEventListener('scroll', this.onScroll, { passive: true });
    this.onScroll();
  }

  disconnect(): void {
    // Clean up the event listener when the controller is disconnected
    window.removeEventListener('scroll', this.onScroll);
  }

  onScroll = () => {
    const { slugs, targets } = this;
    // Remove the selected class from all items
    for (const slug of slugs) {
      const target = targets.find(slug)!;
      target.classList.remove('Sidebar_item--selected');
    }
    const selectedSlug = decideSelectedSlug(slugs);
    if (selectedSlug) {
      const target = targets.find(selectedSlug)!;
      target.classList.add('Sidebar_item--selected');
    }
  }
}

function decideSelectedSlug(slugs: string[]): string | undefined {
  const viewportHeight = window.innerHeight;
  const halfViewportHeight = viewportHeight >> 1;
  const slugCount = slugs.length;
  const selectedSlug = slugs.find((slug) => {
    const element = document.getElementById(slug);
    if (element) {
      const { top, bottom } = element.getBoundingClientRect();
      const slugIndex = slugs.indexOf(slug);
      const bottomThreshold = halfViewportHeight * (slugIndex / slugCount);
        // Return true if any part of the element is in the viewport
      return top < viewportHeight && bottom > bottomThreshold
    }
    return false;
  });
  return selectedSlug;
}
