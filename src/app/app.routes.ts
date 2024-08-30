import { Routes } from '@angular/router';
import { PhoneScreenComponent } from './game/phone-screen/phone-screen.component';
import { EditorPageComponent } from './editor/editor-page/editor-page.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { GamePageComponent } from './game/game-page/game-page.component';

export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'play', component: GamePageComponent},
    // { path: '', redirectTo:'phone/messages', pathMatch:'full'},
    // { path: 'phone', component: PhoneScreenComponent, children: [{ path: 'messages', component: MessagesComponent}]},
    { path: 'editor', component: EditorPageComponent},
    { path: '**', component: PageNotFoundComponent }
];
