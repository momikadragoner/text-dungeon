import { Routes } from '@angular/router';
import { PhoneScreenComponent } from './phone-screen/phone-screen.component';
import { EditorPageComponent } from './editor/editor-page/editor-page.component';
import { MessagesComponent } from './messages/messages.component';

export const routes: Routes = [
    { path: '', component: PhoneScreenComponent},
    // { path: '', redirectTo:'phone/messages', pathMatch:'full'},
    // { path: 'phone', component: PhoneScreenComponent, children: [{ path: 'messages', component: MessagesComponent}]},
    { path: 'editor', component: EditorPageComponent}
];
