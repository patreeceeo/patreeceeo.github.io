import { Controller } from '@hotwired/stimulus';

export class NavSelectController extends Controller<HTMLSelectElement> {
  static values = {
    value: String,
  };
  connect() {
    this.setValue();
  }

  setValue = () => {
    const { element, data } = this;
    element.value = data.get('value') || data.get('defaultValue') as string
  }

  navigateToSelection() {
    location.pathname = `/portfolio/${this.element.value}`;
  }
}
