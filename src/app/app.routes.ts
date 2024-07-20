import { Routes } from '@angular/router';
import { PhoneScreenComponent } from './phone-screen/phone-screen.component';
import { EditorPageComponent } from './editor/editor-page/editor-page.component';

export const routes: Routes = [
    { path: '', component: PhoneScreenComponent},
    { path: 'editor', component: EditorPageComponent}
];
