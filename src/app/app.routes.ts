import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Cv } from './components/cv/cv';
import { ExtractorDemoComponent } from './components/extractor-demo/extractor-demo.component';
import { PlausidatorDemoComponent } from './components/plausidator-demo/plausidator-demo.component';
import { ValidationStatusComponent } from './components/plausidator-demo/validation-status/validation-status.component';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'cv', component: Cv },
    { path: 'extractor', component: ExtractorDemoComponent },
    { path: 'plausidator', component: PlausidatorDemoComponent },
    { path: 'plausidator/status', component: ValidationStatusComponent },
];
