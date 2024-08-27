import { Routes } from '@angular/router';
import { PhoneScreenComponent } from './phone-screen/phone-screen.component';
import { EditorPageComponent } from './editor/editor-page/editor-page.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'play', component: PhoneScreenComponent},
    // { path: '', redirectTo:'phone/messages', pathMatch:'full'},
    // { path: 'phone', component: PhoneScreenComponent, children: [{ path: 'messages', component: MessagesComponent}]},
    { path: 'editor', component: EditorPageComponent},
    { path: '**', component: PageNotFoundComponent }
];
