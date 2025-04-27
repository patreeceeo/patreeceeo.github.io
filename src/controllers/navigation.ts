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

export class NavSidebarController extends Controller<HTMLElement> {
  connect() {
    this.resetThumbnail();
  }
  setThumbnail(event: {params: { src: string }}) {
    this._setThumbnail(event.params.src);
  }
  _setThumbnail(src: string) {
    const target = this.targets.find('thumbnail') as HTMLElement;
    target.style.backgroundImage = `url(${src})`;
  }
  resetThumbnail() {
    const defaultThumbnailSrc = this.data.get('defaultThumbnailSrc')!;
    this._setThumbnail(defaultThumbnailSrc);
  }
}
