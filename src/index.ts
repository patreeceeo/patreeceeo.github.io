import { Application } from '@hotwired/stimulus';
import {NavSelectController, NavSidebarController} from './controllers/navigation';

const application = Application.start();
application.register('nav-select', NavSelectController);
application.register('nav-sidebar', NavSidebarController);

