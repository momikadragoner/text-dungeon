import { Routes } from '@angular/router';
import { PhoneScreenComponent } from './phone-screen/phone-screen.component';
import { GraphVisualComponent } from './graph-visual/graph-visual.component';

export const routes: Routes = [
    { path: '', component: PhoneScreenComponent},
    { path: 'graph', component: GraphVisualComponent}
];
