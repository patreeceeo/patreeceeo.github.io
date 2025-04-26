import { Controller } from '@hotwired/stimulus';

export class NavSelectController extends Controller<HTMLSelectElement> {
  static values = {
    value: String,
  };
  connect() {
    const { element } = this;
    setTimeout(() => {
      element.value = this.data.get('value') as string;
    });
  }

  navigateToSelection() {
    location.pathname = `/portfolio/${this.element.value}`;
  }
}
