import { Controller } from '@hotwired/stimulus';

export class ThumbnailController extends Controller<HTMLElement> {
  set(event: {params: { src: string }}) {
    this._set(event.params.src);
  }
  _set(src: string) {
    const target = this.targets.find('thumbnail') as HTMLElement;
    target.style.backgroundImage = `url(${src})`;
  }
  reset() {
    const target = this.targets.find('thumbnail') as HTMLElement;
    target.style.backgroundImage = '';
  }
}
