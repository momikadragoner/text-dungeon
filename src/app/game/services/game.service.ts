import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GameData } from '../model/game-data.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private http: HttpClient) { }

  getGameData(name: string):Observable<GameData> {
    return this.http.get<GameData>('/api/games/' + name);
  }
}
