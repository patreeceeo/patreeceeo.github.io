import { Controller } from '@hotwired/stimulus';

export class NavSelectController extends Controller<HTMLSelectElement> {
  static values = {
    value: String,
  };
  connect() {
    const { element } = this;
    element.value = this.data.get('value') as string;
  }

  navigateToSelection() {
    location.pathname = `/portfolio/${this.element.value}`;
  }

  /**
  * Doing this before navigation prevents WebKit from trying to preserve the select value across page reloads
  */
  clearSelection() {
    this.element.value = "";
  }
}
