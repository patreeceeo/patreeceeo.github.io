import { Controller } from '@hotwired/stimulus';

export class NavSelectController extends Controller<HTMLSelectElement> {
  static values = {
    value: String,
  };

  hrefs: string[] = [];

  connect() {
    this.setValue();
    this.hrefs = this.data.get('hrefs')?.split(',') || [];
    window.addEventListener('scroll', this.onScroll, { passive: true });

    // Override the SELECT element's default width behavior, allowing it to become smaller than its content
    this.element.style.width = '0';
  }

  disconnect() {
    window.removeEventListener('scroll', this.onScroll);
  }

  setValue = () => {
    const { element, data } = this;
    element.value = data.get('value') || data.get('defaultValue') as string
  }

  navigateToSelection() {
    location.href = this.element.value;
  }

  onScroll = () => {
    const { hrefs } = this;
    // Remove the selected class from all items
    const selectedHref = decideSelectedHref(hrefs);
    if (selectedHref) {
      this.element.value = selectedHref;
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
    const selectedSlug = decideSelectedHref(slugs);
    if (selectedSlug) {
      const target = targets.find(selectedSlug)!;
      target.classList.add('Sidebar_item--selected');
    }
  }
}

function decideSelectedHref(hrefs: string[]): string | undefined {
  const viewportHeight = window.innerHeight;
  const halfViewportHeight = viewportHeight >> 1;
  const count = hrefs.length;
  const selectedHref = hrefs.find((href) => {
    const element = document.getElementById(href.slice(2));
    if (element) {
      const { top, bottom } = element.getBoundingClientRect();
      const index = hrefs.indexOf(href);
      const bottomThreshold = halfViewportHeight * (index / count);
        // Return true if any part of the element is in the viewport
      return top < viewportHeight && bottom > bottomThreshold
    }
    return false;
  });
  return selectedHref;
}
