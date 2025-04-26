import { Application } from '@hotwired/stimulus';
import {NavSelectController} from './controllers/navigation';

const application = Application.start();
application.register('nav-select', NavSelectController);

