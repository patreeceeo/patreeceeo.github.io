import { Controller } from '@hotwired/stimulus';

export class NavSelectController extends Controller<HTMLSelectElement> {
  static values = {
    value: String,
  };
  connect() {
    this.setValue();
    // WebKit tries to preserve the select value across page reloads
    // The only known workaround
    setTimeout(this.setValue, 200);
  }

  setValue = () => {
    const { element } = this;
    element.value = this.data.get('value') as string;
  }

  navigateToSelection() {
    location.pathname = `/portfolio/${this.element.value}`;
  }
}
