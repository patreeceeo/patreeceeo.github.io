import { Application } from '@hotwired/stimulus';
import {NavSelectController, NavSidebarController} from './controllers/navigation';
import {ThumbnailController} from './controllers/thumbnail';

const application = Application.start();

const controllerPairs = [
  ['nav-select', NavSelectController],
  ['nav-sidebar', NavSidebarController],
  ['thumbnail', ThumbnailController],
] as const;

for (const [name, controller] of controllerPairs) {
  application.register(name, controller);
}


