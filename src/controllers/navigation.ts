import { Controller } from '@hotwired/stimulus';

export class NavSelectController extends Controller<HTMLSelectElement> {
  connect() {
    const { element } = this;
    // element.value = window.location.pathname;
  }

  navigateToSelection() {
    location.href = this.element.value;
  }

}
